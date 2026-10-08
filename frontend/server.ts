import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for server-side telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Server-side AI Marketing Content Generator
app.post('/api/gemini/generate-marketing-content', async (req, res) => {
  try {
    const { property, angle, channels } = req.body;

    if (!property) {
      return res.status(400).json({ error: 'Property data is required.' });
    }

    const prompt = `You are a professional real estate copywriter for "Honey-an Property Marketing Platform".
Generate factual, high-converting property marketing copy strictly based on this verified property listing.

CRITICAL RULE: NEVER hallucinate or invent specifications, prices, locations, facilities, legal certificate numbers, or availability. ONLY use the provided facts.

Property Facts:
- Code: ${property.code}
- Title: ${property.title}
- Property Type: ${property.propertyType}
- Asking Price: Rp ${Number(property.askingPrice || 0).toLocaleString('id-ID')}
- Location: ${property.district}, ${property.city}, ${property.province}
- Full Address: ${property.address || 'Contact agent for exact visit'}
- Specifications: Land ${property.landSize}m², Building ${property.buildingSize}m², ${property.bedrooms} Bedrooms, ${property.bathrooms} Bathrooms, ${property.carport || 1} Carport, Floors: ${property.floors || 1}, Electricity: ${property.electricity || '2200'} VA, Water: ${property.waterSource || 'PDAM / Sumur'}
- Legal Certificate: ${property.certificateType} (${property.certificateNumber || 'Verified'}) - PBG/IMB: ${property.pbgStatus ? 'Available' : 'In process'}
- Description: ${property.description || 'Exclusive listing in prime residential area'}

Marketing Focus Angle: "${angle || 'New Listing'}"
Target Channels: ${Array.isArray(channels) ? channels.join(', ') : 'Facebook, Instagram'}

Return a valid JSON object matching this schema:
{
  "headline": "A punchy, attention-grabbing hook headline (under 12 words)",
  "facebookPost": "Complete engaging Facebook post with emojis, key factual highlights (specifications, price, location), financing/KPR note if applicable, and call to action directing to WhatsApp",
  "instagramCaption": "Polished, aesthetic Instagram caption with clean typography, bullet points for factual specs, strong CTA to link in bio / WhatsApp",
  "cta": "Direct WhatsApp action phrase with prompt link text",
  "hashtags": ["list", "of", "8-12", "relevant", "real_estate", "hashtags"],
  "shortVideoScript": "A 30-45 second video script with [Visual Cue] and [Voiceover/Audio] breakdown for TikTok/Reels showcasing the property room by room"
}`;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback deterministic high-quality response if API key is not yet configured
      return res.json({
        headline: `Hunian Idaman di ${property.city}: ${property.title}`,
        facebookPost: `🏡 NEW EXCLUSIVE LISTING: ${property.title}\n\n📍 Lokasi: ${property.district}, ${property.city}\n💰 Harga: Rp ${Number(property.askingPrice).toLocaleString('id-ID')}\n\n✨ Spesifikasi:\n• Luas Tanah: ${property.landSize} m² | Luas Bangunan: ${property.buildingSize} m²\n• Kamar Tidur: ${property.bedrooms} | Kamar Mandi: ${property.bathrooms}\n• Carport: ${property.carport || 1} Mobil | Legalitas: ${property.certificateType}\n\nLokasi sangat strategis dekat fasilitas umum, bebas banjir, dan siap huni. Pembelian bisa Cash maupun KPR dibantu hingga akad!\n\n📲 Jadwalkan survei sekarang via WhatsApp Marketing Honey-an!`,
        instagramCaption: `Modern Living at its Best ✨\n\n${property.title} hadir di kawasan favorit ${property.city}. Menawarkan kenyamanan hunian keluarga dengan pencahayaan alami dan tata ruang maksimal.\n\nDetail Properti:\n📐 LT: ${property.landSize} m² / LB: ${property.buildingSize} m²\n🛏️ ${property.bedrooms} KT / 🚿 ${property.bathrooms} KM\n📑 Sertifikat: ${property.certificateType}\n🏷️ Harga: Rp ${Number(property.askingPrice).toLocaleString('id-ID')}\n\nUnit terbatas! Tap link di bio untuk janji survei lokasi langsung.`,
        cta: "Chat WhatsApp Marketing Honey-an untuk jadwal survei & simulasi KPR",
        hashtags: ["#RumahDijual", `#Rumah${property.city.replace(/\s+/g, '')}`, "#PropertiIndonesia", "#InvestasiProperti", "#RumahImpian", "#HoneyAnProperty", "#RumahKPR", "#ListingTerbaru"],
        shortVideoScript: `[0:00 - 0:05] Hook: "Cari rumah siap huni di ${property.city} dengan harga Rp ${Number(property.askingPrice).toLocaleString('id-ID')}? Yuk kita room tour!"\n[0:05 - 0:15] Fasad & Carport: "Carport lega muat mobil keluarga, tampilan modern minimalis."\n[0:15 - 0:25] Ruang Utama: "Living room luas dengan high ceiling, ${property.bedrooms} kamar tidur nyaman dan sirkulasi udara segar."\n[0:25 - 0:35] Legalitas: "Legalitas lengkap aman (${property.certificateType})."\n[0:35 - 0:45] CTA: "Tertarik survei langsung akhir pekan ini? Klik link di profil untuk WhatsApp kami!"`
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating marketing content:', error);
    // Graceful fallback with factual template so user is never blocked
    const prop = req.body?.property || {};
    return res.json({
      headline: `Pilihan Tepat di ${prop.city || 'Kawasan Strategis'}: ${prop.title || 'Properti Eksklusif'}`,
      facebookPost: `🏡 Info Properti Terpilih: ${prop.title || 'Hunian Nyaman'}\n\n📍 Lokasi: ${prop.district || ''}, ${prop.city || ''}\n💰 Penawaran: Rp ${Number(prop.askingPrice || 0).toLocaleString('id-ID')}\n\nSpesifikasi Faktual:\n• LT/LB: ${prop.landSize || '-'}m² / ${prop.buildingSize || '-'}m²\n• Kamar: ${prop.bedrooms || '-'} KT / ${prop.bathrooms || '-'} KM\n• Legalitas: ${prop.certificateType || 'SHM'}\n\nKonsultasikan kebutuhan Anda & amankan jadwal kunjungan lokasi sekarang!`,
      instagramCaption: `Kenyamanan dan nilai investasi terbaik di ${prop.city || 'lokasi prima'}.\n\n🏡 ${prop.title}\n📍 ${prop.district}, ${prop.city}\n📐 LT: ${prop.landSize}m² | LB: ${prop.buildingSize}m²\n🛏️ ${prop.bedrooms} KT | 🚿 ${prop.bathrooms} KM\n\nHubungi tim pemasaran Honey-an via WhatsApp untuk detail brosur dan janji temu survei.`,
      cta: `Hubungi Konsultan Properti Honey-an via WhatsApp`,
      hashtags: ["#PropertiDijual", "#HoneyAn", "#RumahIdaman", "#InvestasiProperti"],
      shortVideoScript: `[0:00 - 0:10] "Hari ini kita intip ${prop.title || 'rumah cantik'} di ${prop.city}!"\n[0:10 - 0:25] "Dengan luas tanah ${prop.landSize}m² dan ${prop.bedrooms} kamar tidur, cocok banget buat keluarga baru."\n[0:25 - 0:35] "Hubungi WhatsApp kami di bio sekarang untuk jadwal survei!"`
    });
  }
});

// Vite middleware or static files
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
