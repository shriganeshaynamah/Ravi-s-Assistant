import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
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
        model: 'gemini-3-flash-preview',
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

  // Server-side Gemini endpoint for AI Ayurvedic Shloka Search
  app.post('/api/gemini/shloka-search', async (req, res) => {
    try {
      const { query, acharya = 'all' } = req.body || {};
      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const ai = getGenAIClient();
      if (!ai) {
        res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
        return;
      }

      const acharyaMapLabels: Record<string, string> = {
        all: 'Classical Ayurvedic Samhitas (Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya, Madhava Nidana, Chakradatta, Sharangadhara Samhita, Bhavaprakasha)',
        charaka: 'Charaka Samhita (Acharya Charaka)',
        sushruta: 'Sushruta Samhita (Acharya Sushruta)',
        vagbhata: 'Ashtanga Hridaya / Ashtanga Sangraha (Acharya Vagbhata)',
        chakradatta: 'Chakradatta (Acharya Chakrapani Datta)',
        sharangadhara: 'Sharangadhara Samhita (Acharya Sharangadhara)',
        madhava: 'Madhava Nidana (Acharya Madhavakara)',
      };

      const targetSamhita = acharyaMapLabels[acharya] || acharyaMapLabels.all;

      const prompt = `You are an authoritative Ayurvedic Samhita Scholar & Clinical Consultant for Dr. Ravi Shankar (BAMS Doctor).
Search and retrieve authentic classical Sanskrit Shlokas for the following medical query:
Query / Disease / Topic: "${query}"
Preferred Samhita / Acharya Authority: ${targetSamhita}

Instructions:
1. Provide authentic Sanskrit verses in Devanagari script, accurate Roman IAST/transliteration, exact Samhita book & Chapter/Verse citation, and clear clinical English translation/meaning.
2. Include the primary Disease / Nidana / Samprapti / Lakshana Shloka AND 3 to 4 Chikitsa Sutra & Therapeutic Shlokas (covering Chikitsa Sutra, Shamana Yoga, and Shodhana/Panchakarma as applicable to "${query}").
3. If the specific Acharya did not name a later disease directly (e.g. Amavata as a separate chapter in Brihattrayi), provide the most relevant classical verse from that Acharya (or Madhava Nidana / Chakradatta) and clearly state the exact reference.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              queryTitle: {
                type: Type.STRING,
                description: 'Recognized Ayurvedic Vyadhi / Concept & Modern correlation title for the search query',
              },
              acharyaAuthority: {
                type: Type.STRING,
                description: 'Name of the Acharya / Samhita authority cited',
              },
              diseaseShloka: {
                type: Type.OBJECT,
                properties: {
                  shlokaSanskrit: { type: Type.STRING, description: 'Full Sanskrit verse in Devanagari script' },
                  shlokaTransliteration: { type: Type.STRING, description: 'Roman script transliteration' },
                  meaning: { type: Type.STRING, description: 'Detailed English translation and clinical meaning' },
                  sourceBook: { type: Type.STRING, description: 'Samhita name e.g. Charaka Samhita, Madhava Nidana, Sushruta Samhita' },
                  chapterAndVerse: { type: Type.STRING, description: 'Exact Sthana, Chapter and Verse number e.g. Chikitsa Sthana 15/42' },
                },
                required: ['shlokaSanskrit', 'shlokaTransliteration', 'meaning', 'sourceBook', 'chapterAndVerse'],
              },
              chikitsaSutra: {
                type: Type.STRING,
                description: 'Key Chikitsa Sutra principle in Sanskrit + English summary',
              },
              chikitsaSutraReference: {
                type: Type.STRING,
                description: 'Samhita and chapter/verse reference for the Chikitsa Sutra',
              },
              chikitsaShlokas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'Title of the Shloka (e.g. 1. Primary Chikitsa Sutra, 2. Classical Kwatha/Vati Yoga, 3. Shodhana Protocol)' },
                    reference: { type: Type.STRING, description: 'Exact Samhita, Sthana, Chapter & Verse citation' },
                    shlokaSanskrit: { type: Type.STRING, description: 'Authentic Sanskrit verse in Devanagari script' },
                    shlokaTransliteration: { type: Type.STRING, description: 'Roman transliteration of the verse' },
                    meaning: { type: Type.STRING, description: 'Complete English clinical translation and indication' },
                  },
                  required: ['title', 'reference', 'shlokaSanskrit', 'shlokaTransliteration', 'meaning'],
                },
              },
            },
            required: ['queryTitle', 'acharyaAuthority', 'diseaseShloka', 'chikitsaSutra', 'chikitsaSutraReference', 'chikitsaShlokas'],
          },
        },
      });

      res.json({ text: response.text || '' });
    } catch (error: any) {
      console.error('Gemini Shloka Search API Error:', error);
      res.status(500).json({
        error: error?.message || 'Failed to search Shlokas with AI',
      });
    }
  });

  // Android TWA Digital Asset Links endpoint (hides Chrome URL bar inside PWABuilder APK)
  const assetLinksPath = path.join(__dirname, 'public', '.well-known', 'assetlinks.json');

  app.get('/.well-known/assetlinks.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
      if (fs.existsSync(assetLinksPath)) {
        const raw = fs.readFileSync(assetLinksPath, 'utf-8');
        res.send(raw);
        return;
      }
    } catch (err) {
      console.error('Error reading assetlinks.json:', err);
    }
    res.json([
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: 'app.vercel.dr_ravi_shankar_lifeos.twa',
          sha256_cert_fingerprints: [
            '00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00',
          ],
        },
      },
    ]);
  });

  app.post('/api/pwa/assetlinks', (req, res) => {
    try {
      const { packageName, sha256Fingerprint, rawJson } = req.body || {};
      let contentToWrite = '';

      if (rawJson && typeof rawJson === 'string') {
        const parsed = JSON.parse(rawJson);
        contentToWrite = JSON.stringify(parsed, null, 2);
      } else if (packageName && sha256Fingerprint) {
        const payload = [
          {
            relation: ['delegate_permission/common.handle_all_urls'],
            target: {
              namespace: 'android_app',
              package_name: String(packageName).trim(),
              sha256_cert_fingerprints: [String(sha256Fingerprint).trim().toUpperCase()],
            },
          },
        ];
        contentToWrite = JSON.stringify(payload, null, 2);
      } else {
        res.status(400).json({ error: 'packageName and sha256Fingerprint are required' });
        return;
      }

      fs.mkdirSync(path.dirname(assetLinksPath), { recursive: true });
      fs.writeFileSync(assetLinksPath, contentToWrite, 'utf-8');
      res.json({ ok: true, assetLinks: JSON.parse(contentToWrite) });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Invalid assetlinks configuration' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, watch: null },
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
