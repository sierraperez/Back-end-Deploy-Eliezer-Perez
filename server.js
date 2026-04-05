import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 pedidos por IP
  message: { error: "Demasiados pedidos. Tenta novamente mais tarde." }
});

app.use('/api/', limiter);


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve the frontend

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System Prompts
const CHAT_SYSTEM_PROMPT = `És um consultor especializado em automação, workflows e soluções com IA.

O teu objetivo é qualificar leads, perceber problemas reais de negócio e recolher informação suficiente para uma proposta.

Fala em português europeu, de forma clara, profissional e natural.
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
    const leadData = JSON.parse(leadDataJson);

    // Ensure summary is populated if empty but conversation has content
    if (!leadData.conversation_summary && conversation.length > 2) {
      leadData.conversation_summary = "Interaction with portfolio AI agent.";
    }

    return leadData;
  } catch (error) {
    console.error("Extraction error:", error);
    // Return empty fallback structure if JSON parsing or extraction fails
    return {
      name: "", email: "", company: "", company_domain: "", interest: "",
      pain_point: "", goal: "", budget: "", urgency: "", tools_used: "",
      conversation_summary: "Error extracting summary", source: "portfolio_ai_agent"
    };
  }
}

// Route: Handle Chat Messages
app.post('/api/chat', async (req, res) => {
  try {
    const { conversation } = req.body; // array of {role, content}

    if (!conversation || !Array.isArray(conversation)) {
      return res.status(400).json({ error: "Invalid conversation format" });
    }

    // 1. Get Reply from AI Consultant
    // Add system prompt at the beginning
    const messages = [
      { role: "system", content: CHAT_SYSTEM_PROMPT },
      ...conversation
    ];

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 250,
      temperature: 0.7
    });

    const reply = chatResponse.choices[0].message.content;

    // We add the new reply to the conversation for extraction
    const updatedConversation = [...conversation, { role: "assistant", content: reply }];

    // 2. Extract Data using our second call
    const leadData = await extractLeadData(updatedConversation);

    // 3. Check if Lead is Qualified
    const leadReady = isLeadQualified(leadData);

    res.json({
      reply,
      leadReady,
      leadData
    });

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "An error occurred with the AI integration." });
  }
});

// Route: Send Lead to n8n Webhook
app.post('/api/send-lead', async (req, res) => {
  try {
    const leadData = req.body;

    if (!leadData) {
      return res.status(400).json({ error: "No lead data provided" });
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn("N8N_WEBHOOK_URL is not set. Data was not sent to n8n.");
      return res.status(500).json({ error: "Webhook URL not configured" });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status ${response.status}`);
    }

    res.json({ success: true, message: "Lead sent successfully." });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).json({ error: "Failed to send lead to webhook." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`AI Agent Server running on http://localhost:${PORT}`);
});
