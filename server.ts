import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  // Server-side Gemini endpoint for AI Assistant Chat
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, history = [], contextSummary = '' } = req.body || {};
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const ai = getGenAIClient();
      if (!ai) {
        res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
        return;
      }

      const conversationTranscript = Array.isArray(history)
        ? history
            .slice(-10)
            .map((m: { role: string; text: string }) => `${m.role === 'user' ? 'Dr. Ravi Shankar' : 'AI Assistant'}: ${m.text}`)
            .join('\n')
        : '';

      const prompt = `${
        conversationTranscript ? `Previous Conversation:\n${conversationTranscript}\n\n` : ''
      }Dr. Ravi Shankar asks: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: `You are the personal AI Assistant for Dr. Ravi Shankar (BAMS Final Proff Student & Clinician).
You have live access to his LifeOS dashboard metrics (Loans & EMIs, Investments & SIPs, Daily Expenses, Habits & Dinacharya, Keep To-Do Tasks, Academic Roadmap) as well as deep knowledge of Classical Ayurveda (Charaka, Sushruta, Vagbhata, Chakradatta, Sharangadhara Samhita) and Modern Medicine (Harrison's Internal Medicine, Pharmacology).
Keep your answers concise, warm, practical, and directly tailored to Dr. Ravi Shankar. Use bullet points where helpful.

Live LifeOS Context:
${contextSummary}`,
          temperature: 0.4,
        },
      });

      res.json({ reply: response.text || '' });
    } catch (error: any) {
      console.error('Gemini Chat API Error:', error);
      res.status(500).json({
        error: error?.message || 'Failed to generate AI chat response',
      });
    }
  });

  // Server-side Gemini endpoint for Clinical Medical Analysis
  app.post('/api/gemini/medical', async (req, res) => {
    try {
      const { prompt } = req.body || {};
      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      const ai = getGenAIClient();
      if (!ai) {
        res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
        return;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      res.json({ text: response.text || '' });
    } catch (error: any) {
      console.error('Gemini Medical API Error:', error);
      res.status(500).json({
        error: error?.message || 'Failed to generate medical analysis',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
