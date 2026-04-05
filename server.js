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
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
    console.error("❌ CRITICAL ERROR: OPENAI_API_KEY is missing from environment variables!");
}

const getSystemPrompt = (lang) => {
    const langNames = { fr: "Francês", en: "Inglês", pt: "Português (Europeu)", es: "Espanhol" };
    const targetLang = langNames[lang] || "Português (Europeu)";
    return `És um consultor especializado em automação, workflows e soluções com IA para o portfólio de Eliezer Perez. Fala em ${targetLang}.`;
};

const EXTRACTION_SYSTEM_PROMPT = `You are a data extraction assistant.`;

async function extractLeadData(conversation) {
    try {
        if (!process.env.OPENAI_API_KEY) return null;
        const formatted = conversation.map(c => `${c.role}: ${c.content}`).join('\n');
        const res = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: EXTRACTION_SYSTEM_PROMPT }, { role: "user", content: formatted }],
            response_format: { type: "json_object" }
        });
        return JSON.parse(res.choices[0].message.content);
    } catch (e) { return null; }
}

const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet());

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
app.use(express.json());

const getDistPath = () => {
    const paths = [
        path.join(__dirname, "../Eliezer_perezfolio/frontend/dist"),
        path.join(__dirname, "../public_html"),
        path.join(__dirname, "public"),
    ];
    for (const p of paths) { if (fs.existsSync(p)) return p; }
    return paths[0];
};
const distPath = getDistPath();
app.use(express.static(distPath));

const chatRequestSchema = z.object({
  conversation: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
  language: z.enum(["pt", "en", "fr", "es"])
});

app.post('/api/chat', rateLimit({ windowMs: 60000, max: 20 }), async (req, res) => {
    try {
        const { conversation, language } = chatRequestSchema.parse(req.body);
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: getSystemPrompt(language) }, ...conversation],
        });
        const reply = chatResponse.choices[0].message.content;
        extractLeadData([...conversation, { role: "assistant", content: reply }]).catch(() => {});
        res.json({ reply, leadReady: false });
    } catch (error) {
        console.error("🔥 Error:", error.message);
        res.status(500).json({ error: "Erro na IA." });
    }
});

const contactSchema = z.object({
    name: z.string().min(2), email: z.string().email(),
    subject: z.string(), message: z.string(), hp: z.string().max(0).optional(),
});

app.post("/api/contact", rateLimit({ windowMs: 3600000, max: 5 }), async (req, res) => {
    try {
        const validated = contactSchema.parse(req.body);
        if (validated.hp) return res.status(400).send("Bot");
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, port: parseInt(process.env.SMTP_PORT || "465"),
            secure: true, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
        await transporter.sendMail({
            from: process.env.SMTP_USER, to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            subject: `[Contact] ${validated.subject}`, text: `From: ${validated.name}\nEmail: ${validated.email}\n\n${validated.message}`
        });
        res.status(200).json({ message: "Sent!" });
    } catch (e) { res.status(500).json({ error: "Failed" }); }
});

app.get("*", (req, res) => {
    const index = path.join(distPath, "index.html");
    if (fs.existsSync(index)) res.sendFile(index);
    else res.status(404).send("Not Found");
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
