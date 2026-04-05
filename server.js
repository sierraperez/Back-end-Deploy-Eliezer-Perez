// backend/server.js (Pure API Server for Hostinger)
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// AI Agent System Prompt Generator
const getSystemPrompt = (lang) => {
    const langNames = {
        fr: "Francês",
        en: "Inglês",
        pt: "Português (Europeu)",
        es: "Espanhol"
    };
    
    const targetLang = langNames[lang] || "Português (Europeu)";

    return `És um consultor especializado em automação, workflows e soluções com IA para o portfólio de Eliezer Perez.

O teu objetivo é qualificar leads, perceber problemas reais de negócio e recolher informação suficiente para uma proposta.

Fala em ${targetLang}, de forma clara, profissional e natural.
Faz uma pergunta de cada vez.
Evita respostas longas.

Tenta perceber:
- problema real
- objetivo
- urgência
- orçamento
- ferramentas atuais

Nunca inventes dados.
Se ainda faltar informação, continua a perguntar.
Quando tiver contexto suficiente, encaminha para recolher contacto (Nome e Email).`;
};

const EXTRACTION_SYSTEM_PROMPT = `You are a data extraction assistant. Your job is to analyze the conversation between the user and the AI consultant, and extract the required fields as structured JSON.
If a field is not yet discussed or unknown, leave it as an empty string "".
Do not invent data.`;

// Function to check if lead is qualified
function isLeadQualified(leadData) {
    const hasRequiredFields = leadData.interest && leadData.pain_point && leadData.goal;
    const hasContact = leadData.email || leadData.name;
    return Boolean(hasRequiredFields && hasContact);
}

// Function to extract lead data from conversation
async function extractLeadData(conversation) {
    try {
        const formattedConversation = conversation.map(c => `${c.role}: ${c.content}`).join('\n');
        
        const extractionResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
                { role: "user", content: `Please extract the lead data from this conversation:\n\n${formattedConversation}` }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "lead_data_extraction",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            name: { type: "string", description: "The lead's name" },
                            email: { type: "string", description: "The lead's email address" },
                            company: { type: "string", description: "The lead's company name" },
                            company_domain: { type: "string", description: "The lead's company domain/website" },
                            interest: { type: "string", description: "What the lead is interested in" },
                            pain_point: { type: "string", description: "The lead's current pain point or problem" },
                            goal: { type: "string", description: "The lead's goal or desired outcome" },
                            budget: { type: "string", description: "The lead's available budget" },
                            urgency: { type: "string", description: "The lead's urgency level" },
                            tools_used: { type: "string", description: "Current tools the lead is using" },
                            conversation_summary: { type: "string", description: "A brief summary of the conversation" },
                            source: { type: "string", description: "Always return 'portfolio_ai_agent'" }
                        },
                        required: ["name", "email", "company", "company_domain", "interest", "pain_point", "goal", "budget", "urgency", "tools_used", "conversation_summary", "source"],
                        additionalProperties: false
                    }
                }
            }
        });

        const leadDataJson = extractionResponse.choices[0].message.content;
        return JSON.parse(leadDataJson);
    } catch (error) {
        console.error("Extraction error:", error);
        return null;
    }
}


const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// CORS configuration (Strict)
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
    : [
        "https://eliezerperez.com",
        "https://www.eliezerperez.com",
        "https://api.eliezerperez.com",
    ];

const corsOptions = {
    origin: (origin, cb) => {
        // Allow same-origin (browser) or development-only bypass
        if (!origin || (process.env.NODE_ENV !== "production" && origin.includes("localhost"))) {
            return cb(null, true);
        }
        // Extra resilience for multiple localhost ports
        if (origin.includes("localhost:") || origin.includes("127.0.0.1:")) {
            return cb(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return cb(null, true);
        }
        return cb(new Error("Access blocked by CORS (Senior Security applied)"));
    },
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

// --- Rate Limiting (Defense in Depth) ---

// Global base limit (100 requests per 15 min per IP)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Global request limit exceeded." },
});

// Chat specific limit (High conversation rate protection: 20 per minute per IP)
const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: { error: "Chat conversation limit exceeded. Please wait a minute." },
});

// Contact specific limit (Bot/Spam protection: 5 per hour per IP)
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: "Message limit reached. Please contact directly via email if urgent." },
});

app.use(globalLimiter);
app.use(express.json());

// Serve Frontend Static Files (Hostinger All-in-One)
const distPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(distPath));

// Validation schema
const contactSchema = z.object({
    name: z.string().min(2).max(60).trim(),
    email: z.string().email().trim(),
    subject: z.string().min(3).max(120).trim(),
    message: z.string().min(5).max(3000).trim(),
    // honeypot field must be empty
    hp: z.string().max(0).optional(),
});

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API route
app.post("/api/contact", contactLimiter, async (req, res) => {
    try {
        const validated = contactSchema.parse(req.body);
        if (validated.hp) return res.status(400).json({ error: "Bot detected." });

        // Hostinger default SSL port 465 (can be overridden)
        const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: smtpPort,
            secure: smtpPort === 465, // IMPORTANT: must be true for 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"${validated.name}" <${process.env.SMTP_USER}>`,
            replyTo: validated.email,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            subject: `[Portfolio Contact] ${validated.subject}`,
            text:
                `Name: ${validated.name}\n` +
                `Email: ${validated.email}\n` +
                `Subject: ${validated.subject}\n\n` +
                `Message:\n${validated.message}`,
        });

        return res.status(200).json({ message: "Message sent successfully!" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Invalid form data.",
                details: error.errors,
            });
        }
        console.error("Email Error:", error);
        return res.status(500).json({ error: "Failed to send message." });
    }
});

// AI Chat Validation Schema
const chatRequestSchema = z.object({
  conversation: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().min(1).max(3000).trim()
  })),
  language: z.enum(["pt", "en", "fr", "es"])
});

// Route: Handle Chat Messages
app.post('/api/chat', chatLimiter, async (req, res) => {
    try {
        // Validate payload structure
        const { conversation, language } = chatRequestSchema.parse(req.body);
        
        // 1. Get Reply from AI Consultant
        const messages = [
            { role: "system", content: getSystemPrompt(language) },
            ...conversation
        ];

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 350,
            temperature: 0.7
        });

        const reply = chatResponse.choices[0].message.content;

        // 2. Extract context data (Passive background extraction)
        const updatedConversation = [...conversation, { role: "assistant", content: reply }];
        const leadData = await extractLeadData(updatedConversation);

        // 3. Status determination
        const leadReady = leadData ? isLeadQualified(leadData) : false;

        res.json({
            reply,
            leadReady,
            leadData
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: "Invalid request format." });
        }
        console.error("Internal API Error:", error);
        res.status(500).json({ error: "Communication failed. Try again shortly." });
    }
});

// Route: Send Lead to n8n Webhook
app.post('/api/send-lead', async (req, res) => {
    try {
        const leadData = req.body;
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        
        if (!webhookUrl) {
            console.warn("N8N_WEBHOOK_URL not set.");
            return res.status(500).json({ error: "Webhook not configured" });
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
        });

        if (!response.ok) throw new Error("Webhook failed");

        res.json({ success: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ error: "Erro ao enviar lead." });
    }
});

// SPA Recovery: Route everything else to index.html (React Router)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Start server (Hostinger uses process.env.PORT)
app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
    console.log(`Serving frontend from: ${distPath}`);
});
