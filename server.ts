import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

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
        model: 'gemini-3.8-flash',
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

  // Server-side Gemini endpoint for LifeOS Solver AI Pattern Analysis
  app.post('/api/gemini/lifeos-solver', async (req, res) => {
    try {
      const { expenses = [], loans = [], investments = [] } = req.body || {};

      const ai = getGenAIClient();
      if (!ai) {
        res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
        return;
      }

      const prompt = `You are a sharp, realistic financial advisor analyzing live data for Dr. Ravi Shankar.
Analyze his actual Income, Expenses, Net Cash Flow, and Active Loans below, and return a VERY CONCISE, practical plan.

1. EXPENSES & INCOME TRANSACTIONS:
${JSON.stringify(expenses)}

2. ACTIVE LOANS & REPAYMENTS:
${JSON.stringify(loans)}

3. CURRENT INVESTMENTS:
${JSON.stringify(investments)}

Strict Instructions:
- Keep every point short, direct, and numbers-based (max 15 words per tip/reason). No fluff.
- 1. Expense Reduction: Watch his actual spending categories & transaction descriptions to show where to cut costs and how much he can save per month.
- 2. Loan Clearance: Rank his active unpaid loans in the smartest payoff order based on his actual cash flow.
- 3. Best Investment Plan (From His Budget & Loans POV): Do NOT blindly list all investment types like bonds/gold if they don't fit his current budget and loan burden. Calculate his real monthly surplus (Income minus Expenses + potential savings), decide how much must go to Loan Repayment first, and suggest only the 2 or 3 best, realistic investment vehicles for his remaining budget right now (plus what to scale up after loans are cleared).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              patternSummary: {
                type: Type.STRING,
                description: 'One short sentence summarizing income, outflow, net monthly surplus, and active debt.',
              },
              monthlyPotentialSavings: {
                type: Type.NUMBER,
                description: 'Estimated total monthly rupees that can be saved by cutting non-essential expenses.',
              },
              expenseReduction: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    spentAmount: { type: Type.NUMBER },
                    saveTarget: { type: Type.NUMBER },
                    patternObserved: { type: Type.STRING, description: 'Short 6-10 word observation from actual transactions' },
                    actionTip: { type: Type.STRING, description: 'Concise 10-15 word tip to reduce this expense' },
                  },
                  required: ['category', 'spentAmount', 'saveTarget', 'patternObserved', 'actionTip'],
                },
              },
              loanClearance: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    priorityRank: { type: Type.NUMBER },
                    loanTitle: { type: Type.STRING },
                    lender: { type: Type.STRING },
                    remainingAmount: { type: Type.NUMBER },
                    payoffTimeline: { type: Type.STRING, description: 'e.g. Month 1, Months 2-3, Quarterly Tranches' },
                    clearStrategy: { type: Type.STRING, description: 'Concise 12-18 word step to clear this loan' },
                  },
                  required: ['priorityRank', 'loanTitle', 'lender', 'remainingAmount', 'payoffTimeline', 'clearStrategy'],
                },
              },
              investmentPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    instrumentName: { type: Type.STRING, description: 'Specific recommended action/vehicle tailored to his budget and loan status' },
                    returnRate: { type: Type.STRING, description: 'Expected return or debt-free ROI' },
                    allocationPercent: { type: Type.NUMBER },
                    suggestedMonthlyRs: { type: Type.NUMBER },
                    riskTag: { type: Type.STRING, description: 'Short priority or risk tag' },
                    shortReason: { type: Type.STRING, description: 'Concise 10-15 word reason why this fits his budget and loans POV' },
                  },
                  required: ['instrumentName', 'returnRate', 'allocationPercent', 'suggestedMonthlyRs', 'riskTag', 'shortReason'],
                },
              },
            },
            required: ['patternSummary', 'monthlyPotentialSavings', 'expenseReduction', 'loanClearance', 'investmentPlan'],
          },
        },
      });

      res.json({ text: response.text || '' });
    } catch (error: any) {
      console.error('Gemini LifeOS Solver API Error:', error);
      res.status(500).json({
        error: error?.message || 'Failed to generate AI LifeOS analysis',
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
        model: 'gemini-3.8-flash',
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
