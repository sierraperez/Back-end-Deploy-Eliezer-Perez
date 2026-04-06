import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Environment Validation ---
const requiredEnv = [
    "OPENAI_API_KEY",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS"
];
requiredEnv.forEach(env => {
    if (!process.env[env]) {
        console.warn(`[WARNING]: ${env} is missing from environment variables.`);
    }
});

// --- Initialize OpenAI ---
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// --- AI Prompts (Consolidated) ---
const CHAT_SYSTEM_PROMPT = `O teu objetivo é qualificar leads de forma humana e direta, seguindo RIGOROSAMENTE esta ordem de prioridade:

1. **Identificação**: Pergunta o NOME do utilizador e o que a sua EMPRESA faz. (Nunca assumas nomes, se não sabes, pergunta).
2. **Diagnóstico**: Entende qual o PROBLEMA específico que querem resolver com IA ou Automação.
3. **Logística**: Pergunta pelo PRAZO (urgência) e se têm um ORÇAMENTO aproximado.
4. **Contacto**: Finaliza pedindo o EMAIL para o Eliezer enviar a proposta detalhada.

Regras de Ouro:
- NUNCA uses placeholders como "[teu nome]", "[empresa]" ou parênteses retos. Fala como um humano.
- Faz apenas UMA pergunta por mensagem.
- Sê muito breve (máximo 2 frases curtas por resposta).
- NUNCA mostres JSON ou resumos técnicos diretamente ao utilizador.
- Se o utilizador já deu uma informação, não a voltes a perguntar.

Regra de Ouro: NUNCA mostres blocos de código, formatos JSON ou resumos técnicos diretamente ao utilizador no chat. Fala sempre de forma humana e conversacional.`;

const EXTRACTION_SYSTEM_PROMPT = `És um assistente de extração de dados de leads de alta precisão.
A tua tarefa é analisar a conversa entre um utilizador e um assistente de IA para extrair todos os detalhes relevantes de uma lead num formato JSON válido.

Instruções:
- Se um campo não foi mencionado ou é ambíguo, deixa-o vazio "".
- Extrai o nome real, não placeholders.
- O campo "interest" deve resumir o que o cliente quer (ex: "Automação de orçamentos", "Bot para WhatsApp").
- O campo "pain_point" refere-se ao problema atual que eles têm.
- Se o cliente mencionou o domínio do site da empresa, coloca-o em "company_domain".
- O campo "source" deve ser sempre "portfolio_ai_agent".
- Lê toda a conversa para ver se as informações apareceram em momentos diferentes.`;

// --- Lead Qualification Logic ---
function isLeadQualified(leadData) {
    if (!leadData) return false;
    
    // Critérios mais rigorosos: Precisamos de Nome, E-mail e Interesse claro.
    const hasName = leadData.name && leadData.name.trim().length > 1;
    const hasEmail = leadData.email && leadData.email.includes("@") && leadData.email.includes(".");
    const hasInterest = leadData.interest && leadData.interest.trim().length > 5;
    
    // Se tivermos as 3 bases, disparar o Webhook.
    const qualified = Boolean(hasName && hasEmail && hasInterest);
    
    if (qualified) {
        console.log(`✅ Lead Qualificada: ${leadData.name || 'Sem nome'} (${leadData.email || 'Sem e-mail'})`);
    }
    return qualified;
}

async function extractLeadData(conversation) {
    try {
        if (!process.env.OPENAI_API_KEY) return null;
        const formatted = conversation.map(c => `${c.role}: ${c.content}`).join('\n');

        const res = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
                { role: "user", content: `Please extract lead data from this conversation:\n\n${formatted}` }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "lead_extraction",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            email: { type: "string" },
                            company: { type: "string" },
                            company_domain: { type: "string" },
                            interest: { type: "string" },
                            pain_point: { type: "string" },
                            goal: { type: "string" },
                            budget: { type: "string" },
                            urgency: { type: "string" },
                            tools_used: { type: "string" },
                            conversation_summary: { type: "string" },
                            source: { type: "string" }
                        },
                        additionalProperties: false,
                        required: [
                            "name", "email", "company", "company_domain",
                            "interest", "pain_point", "goal", "budget",
                            "urgency", "tools_used", "conversation_summary", "source"
                        ]
                    }
                }
            }
        });
        return JSON.parse(res.choices[0].message.content);
    } catch (e) {
        console.error("Lead extraction error:", e);
        return null;
    }
}

// --- App Setup ---
const app = express();
const PORT = process.env.PORT || 3001;

// Helper to ensure JSON responses on errors
const jsonError = (res, status, message, details = null) => {
    return res.status(status).json({
        success: false,
        error: message,
        details: details
    });
};

// Configuração de Segurança
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "connect-src": ["'self'", "https://api.eliezerperez.com", "http://localhost:3001"],
            "img-src": ["'self'", "data:", "https://eliezerperez.com"],
        },
    },
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
    : ["https://eliezerperez.com", "https://www.eliezerperez.com"];

const corsOptions = {
    origin: (origin, cb) => {
        if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1") || allowedOrigins.includes(origin)) {
            return cb(null, true);
        }
        console.warn(`🚨 CORS blocked: ${origin}`);
        return cb(new Error("CORS blocked"));
    },
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

// Serving Static Files
const getDistPath = () => {
    const paths = [
        path.join(__dirname, "frontend/dist"),
        path.join(__dirname, "public"),
        path.join(__dirname, "../public_html"),
    ];
    for (const p of paths) {
        if (fs.existsSync(p)) {
            console.log("📂 Servindo ficheiros de:", p);
            return p;
        }
    }
    return paths[0];
};
const distPath = getDistPath();
app.use(express.static(distPath));

// --- API Routes ---

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "SERVER IS RUNNING (WEBHOOK OPTIMIZED)",
        host: req.get('host'),
        node_version: process.version,
        env_vars_status: {
            openai: !!process.env.OPENAI_API_KEY,
            smtp: !!process.env.SMTP_HOST,
            webhook_configured: !!process.env.N8N_WEBHOOK_URL,
            webhook_url_preview: process.env.N8N_WEBHOOK_URL ? `${process.env.N8N_WEBHOOK_URL.substring(0, 15)}...` : "not set"
        }
    });
});

const chatRequestSchema = z.object({
    conversation: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1) })),
    language: z.enum(["pt", "en", "fr", "es"]).optional()
});

app.post('/api/chat', rateLimit({ windowMs: 60000, max: 20 }), async (req, res) => {
    console.log("📩 Novo pedido de Chat recebido!");
    try {
        const { conversation } = chatRequestSchema.parse(req.body);

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: CHAT_SYSTEM_PROMPT }, ...conversation],
        });

        const reply = chatResponse.choices[0].message.content || "Não consegui gerar uma resposta.";
        const updatedConv = [...conversation, { role: "assistant", content: reply }];

        const leadData = await extractLeadData(updatedConv);
        const leadReady = isLeadQualified(leadData);

        if (leadData) {
            console.log("📊 Dados Extraídos:", JSON.stringify(leadData, null, 2));
            console.log("🎯 Lead Pronta?", leadReady);
        }

        res.json({ reply, leadReady, leadData });
    } catch (error) {
        console.error("🔥 Chat Error:", error.message);
        if (error instanceof z.ZodError) {
            return jsonError(res, 400, "Invalid request body", error.flatten());
        }
        jsonError(res, 500, "An error occurred with the AI integration.");
    }
});

app.post('/api/send-lead', async (req, res) => {
    try {
        const leadData = req.body;
        if (!leadData) return jsonError(res, 400, "No data");

        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (!webhookUrl) {
            console.warn("⚠️ N8N_WEBHOOK_URL is not set in environment.");
            return res.json({ success: false, message: "Webhook URL missing" });
        }

        console.log(`📤 Enviando lead para o n8n... (${webhookUrl})`);

        // Check for fetch availability (Node 18+)
        if (typeof fetch === 'undefined') {
            console.error("❌ Erro: 'fetch' não está definido. Por favor utilize Node.js 18+ ou superior na Hostinger.");
            return res.status(500).json({ 
                success: false, 
                error: "Node version too old", 
                details: "Server needs Node.js 18+ to use native fetch." 
            });
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
        });

        const status = response.status;
        console.log(`📡 Resposta do n8n: ${status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Erro no Webhook n8n: ${status} - ${errorText}`);
            return res.status(status).json({ success: false, status, details: errorText });
        }

        res.json({ success: true, status });
    } catch (error) {
        console.error("🔥 Erro Fatal no Webhook:", error);
        jsonError(res, 500, "Failed to send lead", error.message);
    }
});

const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(1),
    message: z.string().min(1),
    hp: z.string().max(0).optional(),
});

app.post("/api/contact", rateLimit({ windowMs: 3600000, max: 5 }), async (req, res) => {
    console.log("📩 Novo pedido de e-mail recebido de:", req.body.email);
    try {
        const validated = contactSchema.parse(req.body);
        if (validated.hp) {
            console.warn("🛡️ Honeypot detetado! Bloqueando bot.");
            return res.status(400).send("Bot Detected");
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "465", 10),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            replyTo: validated.email,
            subject: `[Website Contact] ${validated.subject}`,
            text: `From: ${validated.name}\nEmail: ${validated.email}\n\n${validated.message}`
        });

        res.status(200).json({ success: true, message: "Sent!" });
    } catch (e) {
        console.error("🔥 Email Error:", e.message);
        if (e instanceof z.ZodError) {
            return jsonError(res, 400, "Invalid contact payload", e.flatten());
        }
        jsonError(res, 500, "Failed to send email");
    }
});

app.get("*", (req, res) => {
    const index = path.join(distPath, "index.html");
    if (fs.existsSync(index)) res.sendFile(index);
    else res.json({ message: "Eliezer Perez API is live." });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
