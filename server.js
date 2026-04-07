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

const CHAT_SYSTEM_PROMPT = `Your goal is to qualify leads in a human and direct way, following RIGOROUSLY this priority order:

1. **Identification**: Ask the user's NAME, company name and what their COMPANY does. (Never assume names, if you don't know, ask).
2. **Diagnosis**: Understand the SPECIFIC PROBLEM they want to solve with AI or Automation.
3. **Tools**: Ask which tools or software they currently use (e.g. CRM, WhatsApp, Excel, Zapier, etc).
4. **Logistics**: Ask about the DEADLINE (urgency) and if they have an approximate BUDGET.
5. **Contact & Booking**: Ask for their EMAIL and immediately after confirming it, send a message in THE SAME LANGUAGE as the conversation saying that Eliezer will follow up by email and they can book a free 30-minute discovery call at this link (show the URL as plain text, never as markdown): https://calendly.com/eliezerperez/30min

Golden Rules:
- LANGUAGE: Detect the language of the user's first message and ALWAYS respond in that language until the end of the conversation. If they write in Portuguese, respond in Portuguese. If they write in French, respond in French. If they write in Spanish, respond in Spanish.
- NEVER use placeholders like "[your name]", "[company]" or square brackets. Speak like a human.
- Ask only ONE question per message.
- Be very brief (maximum 2 short sentences per response).
- NEVER show JSON or technical summaries directly to the user.
- If the user has already provided information, do not ask for it again.

Golden Rule: NEVER show code blocks, JSON formats or technical summaries directly to the user in the chat. Always speak in a human and conversational way.`;

const EXTRACTION_SYSTEM_PROMPT = `You are a high-precision lead data extraction assistant.
Your task is to analyze the conversation between a user and an AI assistant to extract all relevant lead details in a valid JSON format.

CRITICAL RULES:
- NEVER use placeholders like "[Name]", "[Company Name]", "[email]" or any text in square brackets.
- Extract ONLY real values explicitly mentioned in the conversation.
- If the real name was not mentioned, set "name": "".
- If the real email was not mentioned, set "email": "".
- If the real company was not mentioned, set "company": "".

MANDATORY VALIDATION:
- If "name" is empty ("") or a placeholder, set "ready_to_send": false.
- If "email" is empty ("") or a placeholder, set "ready_to_send": false.
- Only set "ready_to_send": true if both name and email are real and valid values.

Extraction instructions:
- The "interest" field should summarize what the client wants (e.g. "Budget automation", "WhatsApp Bot").
- The "pain_point" field refers to the current problem they have.
- The "goal" field is the final objective they want to achieve.
- The "budget" field is the budget mentioned (e.g. "2000-3000 euros", "no budget defined").
- The "urgency" field is the urgency mentioned (e.g. "Urgent", "1 month", "no deadline defined").
- The "tools_used" field contains the tools they already use.
- If the client mentioned the company website domain, put it in "company_domain".
- The "source" field must always be "portfolio_ai_agent".
- The "conversation_summary" field must be a clear 2-3 sentence summary of what the client wants, written in the SAME LANGUAGE as the conversation.
- Read the entire conversation to check if information appeared at different points.`;
// --- Lead Qualification Logic ---
function isLeadQualified(leadData) {
    if (!leadData) return false;

    const hasName = leadData.name && leadData.name.trim().length > 1;
    const hasEmail = leadData.email && leadData.email.includes("@") && leadData.email.includes(".");
    const hasInterest = leadData.interest && leadData.interest.trim().length > 5;
    const isReady = leadData.ready_to_send === true;

    const qualified = Boolean(hasName && hasEmail && hasInterest && isReady);

    if (qualified) {
        console.log(`✅ Lead Qualificada: ${leadData.name} (${leadData.email})`);
    } else {
        console.log(`⏳ Lead incompleta - Nome: ${leadData.name || 'vazio'} | Email: ${leadData.email || 'vazio'} | Ready: ${isReady}`);
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
                            source: { type: "string" },
                            ready_to_send: { type: "boolean" }
                        },
                        additionalProperties: false,
                        required: [
                            "name", "email", "company", "company_domain",
                            "interest", "pain_point", "goal", "budget",
                            "urgency", "tools_used", "conversation_summary",
                            "source", "ready_to_send"
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

const jsonError = (res, status, message, details = null) => {
    return res.status(status).json({ success: false, error: message, details });
};

// Segurança
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

// Ficheiros estáticos
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
            webhook_url_preview: process.env.N8N_WEBHOOK_URL
                ? `${process.env.N8N_WEBHOOK_URL.substring(0, 15)}...`
                : "not set"
        }
    });
});

const chatRequestSchema = z.object({
    conversation: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1)
    })),
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

        // Validação: só envia se tiver nome real, email real e ready_to_send true
        const hasName = leadData.name && leadData.name.trim().length > 1;
        const hasEmail = leadData.email && leadData.email.includes("@") && leadData.email.includes(".");
        const isReady = leadData.ready_to_send === true;

        if (!hasName || !hasEmail || !isReady) {
            console.log(`⛔ Lead bloqueada - Nome: ${leadData.name || 'vazio'} | Email: ${leadData.email || 'vazio'} | Ready: ${isReady}`);
            return res.json({ success: false, message: "Lead incompleta - nome e email obrigatórios" });
        }

        // Remove o campo ready_to_send antes de enviar para o N8n
        delete leadData.ready_to_send;

        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (!webhookUrl) {
            console.warn("⚠️ N8N_WEBHOOK_URL is not set in environment.");
            return res.json({ success: false, message: "Webhook URL missing" });
        }

        console.log(`📤 Enviando lead para o n8n: ${leadData.name} (${leadData.email})`);

        if (typeof fetch === 'undefined') {
            console.error("❌ Erro: 'fetch' não está definido. Por favor utilize Node.js 18+.");
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
