// backend/index.js (Pure API Server for Hostinger)
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

// --- AI Prompts (Consolidated from ai-agent/server.js) ---
const CHAT_SYSTEM_PROMPT = `És um consultor especializado em automação, workflows e soluções com IA para o portfólio de Eliezer Perez.
O teu objetivo é qualificar leads, perceber problemas reais de negócio e recolher informação suficiente para uma proposta.
Fala em português europeu (ou na língua que o utilizador falar), de forma clara, profissional e natural.
Faz uma pergunta de cada vez. Evita respostas longas.
Tenta perceber: problema real, objetivo, urgência, orçamento e ferramentas atuais.
Quando tiveres contexto suficiente, encaminha para recolher contacto (Nome e Email).`;

const EXTRACTION_SYSTEM_PROMPT = `You are a data extraction assistant. Your job is to analyze the conversation and extract the required fields as structured JSON. Do not invent data.`;

// --- Lead Qualification Logic ---
function isLeadQualified(leadData) {
    const hasRequiredFields = leadData.interest && leadData.pain_point && leadData.goal;
    const hasContact = leadData.email || leadData.name;
    return Boolean(hasRequiredFields && hasContact);
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
                            interest: { type: "string" },
                            pain_point: { type: "string" },
                            goal: { type: "string" },
                            budget: { type: "string" },
                            urgency: { type: "string" },
                            tools_used: { type: "string" },
                            source: { type: "string" }
                        },
                        required: ["name", "email", "company", "interest", "pain_point", "goal", "budget", "urgency", "tools_used", "source"],
                        additionalProperties: false
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
const PORT = process.env.PORT || 3000;

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
    : ["https://eliezerperez.com", "https://www.eliezerperez.com"];

const corsOptions = {
    origin: (origin, cb) => {
        // Permitir localhost para testes e origens permitidas
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
app.use(express.json());

// Serving Static Files (Dist Path Logic)
const getDistPath = () => {
    const paths = [
        path.join(__dirname, "public"),
        path.join(__dirname, "../public_html"),
    ];
    for (const p of paths) { if (fs.existsSync(p)) return p; }
    return paths[0];
};
const distPath = getDistPath();
app.use(express.static(distPath));

// --- API Routes ---

app.get("/health", (req, res) => {
    res.json({ 
        status: "ok", 
        message: "API is running",
        host: req.get('host'),
        origin: req.get('origin')
    });
});

const chatRequestSchema = z.object({
    conversation: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
    language: z.enum(["pt", "en", "fr", "es"]).optional()
});

app.post('/api/chat', rateLimit({ windowMs: 60000, max: 20 }), async (req, res) => {
    try {
        const { conversation } = chatRequestSchema.parse(req.body);
        
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: CHAT_SYSTEM_PROMPT }, ...conversation],
        });
        
        const reply = chatResponse.choices[0].message.content;
        const updatedConv = [...conversation, { role: "assistant", content: reply }];
        
        // Extraction logic
        const leadData = await extractLeadData(updatedConv);
        const leadReady = leadData ? isLeadQualified(leadData) : false;

        res.json({ reply, leadReady, leadData });
    } catch (error) {
        console.error("🔥 Chat Error:", error.message);
        res.status(500).json({ error: "Erro na IA." });
    }
});

app.post('/api/send-lead', async (req, res) => {
    try {
        const leadData = req.body;
        if (!leadData) return res.status(400).json({ error: "No data" });

        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (!webhookUrl) {
            console.warn("N8N_WEBHOOK_URL is not set.");
            return res.status(200).json({ success: true, message: "Webhook not configured, skipping" });
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
        });

        res.json({ success: response.ok });
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ error: "Failed to send lead" });
    }
});

const contactSchema = z.object({
    name: z.string().min(2), 
    email: z.string().email(),
    subject: z.string(), 
    message: z.string(), 
    hp: z.string().max(0).optional(),
});

app.post("/api/contact", rateLimit({ windowMs: 3600000, max: 5 }), async (req, res) => {
    try {
        const validated = contactSchema.parse(req.body);
        if (validated.hp) return res.status(400).send("Bot Detected");

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, 
            port: parseInt(process.env.SMTP_PORT || "465"),
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
            subject: `[Portfolio Contact] ${validated.subject}`, 
            text: `From: ${validated.name}\nEmail: ${validated.email}\n\n${validated.message}`
        });

        res.status(200).json({ message: "Sent!" });
    } catch (e) { 
        console.error("Email Error:", e);
        res.status(500).json({ error: "Failed to send email" }); 
    }
});

// Catch-all
app.get("*", (req, res) => {
    const index = path.join(distPath, "index.html");
    if (fs.existsSync(index)) res.sendFile(index);
    else res.json({ message: "Eliezer Perez API. Endpoint not found." });
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));

