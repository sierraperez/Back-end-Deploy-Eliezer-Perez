// backend/server.js (Pure API Server for Hostinger)
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log("--- API Server Startup ---");
console.log("Node version:", process.version);
console.log("Port:", PORT);
console.log("--------------------------");

// CORS (allow your portfolio + optional API subdomain)
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
    : [
        "https://eliezerperez.com",
        "https://www.eliezerperez.com",
        "https://api.eliezerperez.com",
        "http://localhost:5173",
    ];

// Security headers
app.use(helmet());

// CORS
app.use(
    cors({
        origin: (origin, cb) => {
            // allow server-to-server / curl / postman (no origin)
            if (!origin) return cb(null, true);
            if (allowedOrigins.includes(origin)) return cb(null, true);
            return cb(new Error("Not allowed by CORS"));
        },
        methods: ["POST", "GET", "OPTIONS"],
        allowedHeaders: ["Content-Type"],
    })
);

// Rate limit
app.use(
    rateLimit({
        windowMs: 60 * 1000,
        max: 5,
        message: { error: "Too many requests, try again later." },
    })
);

app.use(express.json());

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
app.post("/api/contact", async (req, res) => {
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

// 404 for any other route
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start server (Hostinger uses process.env.PORT)
app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
});
