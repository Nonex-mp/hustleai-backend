<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/generate', async (req, res) => {
  try {
    const { age, skills, time, budget } = req.body;

    const prompt = `You are a practical Filipino business mentor for students.

Create 3 realistic hustle ideas.

Details:
- Age: ${age}
- Skills: ${skills}
- Time per day: ${time}
- Budget: ${budget}

For each idea, return JSON like this:
{
  "title": "Short catchy title",
  "earning": "Estimated earning per week (PHP)",
  "description": "2-3 sentences description",
  "steps": "Step-by-step guide"
}

Make ideas very realistic for the Philippines.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8
    });

    const text = completion.choices[0].message.content;

    // Return the AI response
    res.json({ ideas: [{ title: "AI Generated Plan", earning: "Calculating...", description: text, steps: "See full response" }] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
=======
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/generate', async (req, res) => {
  try {
    const { age, skills, time, budget } = req.body;

    const prompt = `You are a practical Filipino business mentor for students.

Create 3 realistic hustle ideas.

Details:
- Age: ${age}
- Skills: ${skills}
- Time per day: ${time}
- Budget: ${budget}

For each idea, return JSON like this:
{
  "title": "Short catchy title",
  "earning": "Estimated earning per week (PHP)",
  "description": "2-3 sentences description",
  "steps": "Step-by-step guide"
}

Make ideas very realistic for the Philippines.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8
    });

    const text = completion.choices[0].message.content;

    // Return the AI response
    res.json({ ideas: [{ title: "AI Generated Plan", earning: "Calculating...", description: text, steps: "See full response" }] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
>>>>>>> d43009da15828ea9dd1adcf5cf81d45197232bc1
});