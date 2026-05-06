const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- GROQ CONFIGURATION ---
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// --- BASE ROUTE (For HetrixTools Pings) ---
app.get('/', (req, res) => {
  res.status(200).send('HustleAI Backend is Awake');
});

// --- HUSTLE GENERATION ROUTE ---
app.post('/generate', async (req, res) => {
  try {
    const { age, skills, time, budget } = req.body;

    const prompt = `You are a practical Filipino business mentor for students.
Create 3 realistic hustle ideas for a student in the Philippines based on:
Age: ${age}, Skills: ${skills}, Time: ${time}, Budget: ${budget}.
Return ONLY a JSON object with a key "ideas" containing an array of 3 objects (title, earning, description, steps).`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // UPDATED: llama3-8b-8192 is decommissioned
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    console.error("Groq AI Error:", error);
    res.status(500).json({ error: "AI Error: Check logs" });
  }
});

// --- PAYMONGO CHECKOUT ROUTE ---
app.post('/create-checkout', async (req, res) => {
  try {
    const secretKey = Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64');

    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${secretKey}`
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            line_items: [
              {
                currency: 'PHP',
                amount: 9900, 
                description: 'HustleAI Premium Plan',
                name: '30-Day Detailed Strategy',
                quantity: 1
              }
            ],
            payment_method_types: ['gcash', 'paymaya', 'card'],
            description: 'Unlock full scripts and 30-day guide'
          }
        }
      })
    });

    const session = await response.json();
    
    if (session.errors) {
      return res.status(400).json({ error: session.errors[0].detail });
    }

    res.json({ checkout_url: session.data.attributes.checkout_url });

  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server live on port ${PORT}`);
});