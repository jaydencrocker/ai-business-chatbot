require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Middleware
app.use(cors()); // Allow requests from any origin (GitHub Pages, etc.)
app.use(express.json());

// Optional static serving (for local testing or docs)
app.use(express.static('public'));

// Health check route for uptime monitoring
app.get('/', (req, res) => {
  res.json({ status: '✅ AI Business Chatbot server is running' });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: '❌ Missing message input' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0]?.message?.content || '⚠️ No response from OpenAI';
    res.json({ reply });
  } catch (err) {
    console.error('❌ Chat error:', err.response?.data || err.message);
    res.status(500).json({ reply: 'Error: Failed to connect to OpenAI' });
  }
});

// Optional: Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});