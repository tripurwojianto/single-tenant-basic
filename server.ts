import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI client lazily with optional custom API key from user
  const getAiClient = (userApiKey?: string) => {
    const apiKey = userApiKey?.trim() || process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Route for Amina AI Assistant
  app.post('/api/amina/generate', async (req, res) => {
    try {
      const { prompt, mode, contextData, userApiKey } = req.body;

      if (!prompt && !contextData) {
        return res.status(400).json({ error: 'Prompt atau data masukan diperlukan' });
      }

      const ai = getAiClient(userApiKey);
      const systemInstruction = `Anda adalah Amina, asisten AI yang membantu pengurus DKM (Dewan Kemakmuran Masjid) merapikan bahasa laporan dan menyusun draf pengumuman. Gunakan bahasa yang sopan, hangat, islami, dan sesuai konteks komunikasi masjid ke jamaah. Anda membantu menyusun draf, bukan mengambil keputusan atas nama pengurus.`;

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not set
        return res.json({
          text: `[DRAF - Mode Offline/Fallback]\n\n${prompt || 'Laporan/Pengumuman Masjid'}\n\nAssalamu'alaikum Warahmatullahi Wabarakatuh.\n\nDemikian draf teks yang disusun secara terstruktur. Silakan tinjau dan lengkapi rincian acara/laporan sebelum dipublikasikan ke jamaah masjid.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`,
          isFallback: true
        });
      }

      let fullPrompt = prompt || 'Buatkan draf teks administrasi masjid.';
      if (contextData) {
        fullPrompt = `${fullPrompt}\n\nData Konteks Tambahan:\n${JSON.stringify(contextData, null, 2)}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const generatedText = response.text || 'Tidak dapat menghasilkan teks. Silakan coba lagi.';
      return res.json({ text: generatedText, isFallback: false });
    } catch (err: any) {
      console.error('Error in /api/amina/generate:', err);
      return res.status(500).json({
        error: err.message || 'Gagal memproses permintaan Amina AI',
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', amina: 'ready' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server KasMasjid running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
