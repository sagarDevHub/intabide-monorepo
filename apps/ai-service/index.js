const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'AI Service is running!' });
});

// Match your frontend's format
app.post('/chat', (req, res) => {
  const { messages, userId } = req.body;

  // Extract the last user message
  const lastMessage = messages?.[messages.length - 1]?.content || 'Hello';

  // For now, just echo back
  res.json({
    response: `AI says: You said "${lastMessage}"`,
    cached: false,
    remaining: 99,
  });
});

app.listen(PORT, () => {
  console.log(`🤖 AI Service running on http://localhost:${PORT}`);
});
