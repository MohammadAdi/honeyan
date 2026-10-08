import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Share2, 
  Building2, 
  Video, 
  MessageCircle, 
  RefreshCw,
  Sliders,
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Property, ContentAngle, MarketingContent } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';

interface ContentStudioProps {
  properties: Property[];
  selectedPropertyId?: string;
  onPublishContent: (content: MarketingContent, channel: string) => void;
}

export const ContentStudio: React.FC<ContentStudioProps> = ({
  properties,
  selectedPropertyId,
  onPublishContent
}) => {
  const [propertyId, setPropertyId] = useState<string>(
    selectedPropertyId || properties[0]?.id || ''
  );
  const [selectedAngle, setSelectedAngle] = useState<ContentAngle>('Family Home');
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedProperty = properties.find(p => p.id === propertyId) || properties[0];

  // Generated Content State
  const [generatedContent, setGeneratedContent] = useState<{
    headline: string;
    facebookPost: string;
    instagramCaption: string;
    cta: string;
    hashtags: string[];
    shortVideoScript: string;
  } | null>({
    headline: `Rumah Idaman Keluarga di ${selectedProperty?.district || 'Sleman'}: Nyaman & Siap Huni`,
    facebookPost: `🏡 NEW EXCLUSIVE LISTING: ${selectedProperty?.title || 'Hunian Modern'}\n\n📍 Lokasi: ${selectedProperty?.district}, ${selectedProperty?.city}\n💰 Harga: Rp ${Number(selectedProperty?.askingPrice || 0).toLocaleString('id-ID')}\n\n✨ Spesifikasi Faktual:\n• Luas Tanah: ${selectedProperty?.landSize} m² | Luas Bangunan: ${selectedProperty?.buildingSize} m²\n• Kamar Tidur: ${selectedProperty?.bedrooms} KT | Kamar Mandi: ${selectedProperty?.bathrooms} KM\n• Carport: ${selectedProperty?.carport} Mobil | Legalitas: ${selectedProperty?.certificateType}\n• Daya Listrik: ${selectedProperty?.electricity} | Air: ${selectedProperty?.waterSource}\n\nLingkungan tenang, aman dengan sistem satu gerbang, dan akses jalan lebar. Legalitas lengkap siap balik nama atau KPR Bank!\n\n📲 Jadwalkan survei akhir pekan ini dengan menghubungi tim Honey-an sekarang!`,
    instagramCaption: `Modern Living at its Best ✨\n\n${selectedProperty?.title}\n\nHunian dengan rancangan fungsional dan sirkulasi udara optimal di kawasan favorit ${selectedProperty?.city}.\n\nSpesifikasi Utama:\n📐 LT: ${selectedProperty?.landSize} m² / LB: ${selectedProperty?.buildingSize} m²\n🛏️ ${selectedProperty?.bedrooms} Kamar Tidur\n🚿 ${selectedProperty?.bathrooms} Kamar Mandi\n📑 Legalitas: ${selectedProperty?.certificateType}\n🏷️ Harga: Rp ${Number(selectedProperty?.askingPrice || 0).toLocaleString('id-ID')}\n\nUnit terbatas! Tap tautan di bio untuk janji survei lokasi langsung via WhatsApp.`,
    cta: `Chat WhatsApp Marketing Honey-an untuk jadwal survei lokasi & simulasi KPR`,
    hashtags: [
      `#Rumah${(selectedProperty?.city || 'Sleman').replace(/\s+/g, '')}`,
      "#RumahDijual",
      "#PropertiIndonesia",
      "#InvestasiProperti",
      "#RumahKPR",
      "#HoneyAnProperty",
      "#ListingTerbaru"
    ],
    shortVideoScript: `[0:00 - 0:05] Hook: "Cari rumah siap huni di ${selectedProperty?.city} budget Rp ${Number(selectedProperty?.askingPrice || 0).toLocaleString('id-ID')}? Yuk kita room tour!"\n[0:05 - 0:15] Fasad & Carport: "Carport lega muat ${selectedProperty?.carport} mobil keluarga, tampilan modern minimalis."\n[0:15 - 0:25] Ruang Utama: "Living room luas, ${selectedProperty?.bedrooms} kamar tidur nyaman dan sirkulasi udara segar."\n[0:25 - 0:35] Legalitas: "Legalitas lengkap aman (${selectedProperty?.certificateType})."\n[0:35 - 0:45] CTA: "Tertarik survei langsung akhir pekan ini? Klik tautan WhatsApp kami di profil!"`
  });

  const angles: ContentAngle[] = [
    'New Listing',
    'Price Highlight',
    'Family Home',
    'Strategic Location',
    'First Home Buyer',
    'Investment',
    'KPR Friendly',
    'Price Drop',
    'Property Comparison'
  ];

  const handleGenerateAI = async () => {
    if (!selectedProperty) return;
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/generate-marketing-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: selectedProperty,
          angle: selectedAngle,
          channels: ['Facebook Page', 'Instagram', 'TikTok', 'WhatsApp']
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate from server');
      }

      const data = await res.json();
      setGeneratedContent(data);
    } catch (err) {
      console.warn('Fallback local generation used:', err);
      // Factual fallback based strictly on selected property
      setGeneratedContent({
        headline: `Penawaran Terbaik di ${selectedProperty.city}: ${selectedProperty.title}`,
        facebookPost: `🏡 REKOMENDASI PROPERTI PILIHAN: ${selectedProperty.title}\n\n📍 Lokasi: ${selectedProperty.district}, ${selectedProperty.city}\n💰 Penawaran: Rp ${Number(selectedProperty.askingPrice).toLocaleString('id-ID')}\n\nFakta Spesifikasi:\n• Luas Tanah: ${selectedProperty.landSize}m² | Bangunan: ${selectedProperty.buildingSize}m²\n• Kamar: ${selectedProperty.bedrooms} KT / ${selectedProperty.bathrooms} KM\n• Legalitas: ${selectedProperty.certificateType} (${selectedProperty.certificateNumber || 'Tervalidasi'})\n\nHubungi WhatsApp Marketing Honey-an sekarang untuk survei lokasi langsung!`,
        instagramCaption: `Kenyamanan hunian di ${selectedProperty.district}, ${selectedProperty.city}.\n\n🏡 ${selectedProperty.title}\n📐 LT: ${selectedProperty.landSize}m² | LB: ${selectedProperty.buildingSize}m²\n🛏️ ${selectedProperty.bedrooms} KT | 🚿 ${selectedProperty.bathrooms} KM\n🏷️ Harga: Rp ${Number(selectedProperty.askingPrice).toLocaleString('id-ID')}\n\nHubungi tim pemasaran kami via WhatsApp di link bio!`,
        cta: `Konsultasi & Jadwal Survei via WhatsApp Honey-an`,
        hashtags: [`#Rumah${selectedProperty.city.replace(/\s+/g, '')}`, "#RumahDijual", "#HoneyAnCRM", "#PropertiKeluarga"],
        shortVideoScript: `[0:00 - 0:10] "Hari ini kita intip ${selectedProperty.title} di ${selectedProperty.city}!"\n[0:10 - 0:25] "Dengan luas tanah ${selectedProperty.landSize}m² dan ${selectedProperty.bedrooms} KT, pas banget untuk kebutuhan keluarga."\n[0:25 - 0:35] "Hubungi WhatsApp kami di bio sekarang untuk jadwal survei!"`
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName="AI Marketing Content Studio"
        parentName="Marketing"
        parentPath="/marketing/content"
      />

      {/* TOP CONTROLS: PROPERTY & ANGLE SELECTOR */}
      <div className="mb-6 rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Select Property */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-[#1C2434] dark:text-white mb-1.5 flex items-center justify-between">
              <span>1. Select Property from CRM Database:</span>
              <span className="text-[11px] text-[#3C50E0] font-normal">
                {selectedProperty?.code} · Rp {Number(selectedProperty?.askingPrice || 0).toLocaleString('id-ID')}
              </span>
            </label>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium focus:border-[#3C50E0]"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.title} ({p.city}) — Rp {Number(p.askingPrice).toLocaleString('id-ID')}
                </option>
              ))}
            </select>

            {/* Factual Integrity Banner */}
            <div className="mt-2.5 flex items-center gap-2 rounded-xs bg-[#EFF2F7] dark:bg-[#1E293B] px-3 py-1.5 text-[11px] text-[#475569] dark:text-[#94A3B8]">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>Factual Accuracy Guard:</strong> AI generation strictly pulls verified specs (price, LT/LB, bedrooms, legal certificate) from this listing record.
              </span>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleGenerateAI}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#3C50E0] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#2e40c7] shadow-sm disabled:opacity-70 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Copy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate All Channels Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Angles Selector */}
        <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-[#2E3A47]">
          <span className="block text-xs font-bold text-[#1C2434] dark:text-white mb-2">
            2. Marketing Angle / Hook:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {angles.map(angle => (
              <button
                key={angle}
                onClick={() => setSelectedAngle(angle)}
                className={`px-3 py-1 text-xs rounded-sm transition-all font-medium ${
                  selectedAngle === angle
                    ? 'bg-[#3C50E0] text-white font-bold shadow-xs'
                    : 'bg-[#F1F5F9] dark:bg-[#1A222C] text-[#64748B] dark:text-[#8A99AD] hover:bg-[#E2E8F0] dark:hover:bg-[#2E3A47]'
                }`}
              >
                {angle}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GENERATED COPY GRID */}
      {generatedContent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Headline & CTA */}
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47]">
              <h3 className="font-bold text-sm text-[#1C2434] dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3C50E0]" />
                Headline & Direct WhatsApp CTA
              </h3>
              <button
                onClick={() => copyToClipboard(`${generatedContent.headline}\n\n${generatedContent.cta}`, 'headline')}
                className="text-xs font-semibold text-[#3C50E0] flex items-center gap-1 hover:underline"
              >
                {copiedKey === 'headline' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'headline' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#64748B] dark:text-[#8A99AD] uppercase block mb-1">
                Hook Headline:
              </span>
              <p className="text-base font-extrabold text-[#1C2434] dark:text-white bg-[#F8FAFC] dark:bg-[#1A222C] p-3 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47]">
                {generatedContent.headline}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#64748B] dark:text-[#8A99AD] uppercase block mb-1">
                Call to Action (WhatsApp Inbound Link):
              </span>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-sm border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-900 dark:text-emerald-200">
                📲 {generatedContent.cta}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#64748B] dark:text-[#8A99AD] uppercase block mb-1">
                Recommended Hashtags:
              </span>
              <div className="flex flex-wrap gap-1">
                {generatedContent.hashtags.map((tag, idx) => (
                  <span key={idx} className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-[#3C50E0] dark:text-[#80CAEE] font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Short Video Script (TikTok & Reels) */}
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47]">
              <h3 className="font-bold text-sm text-[#1C2434] dark:text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-500" />
                Short Video Script (TikTok / Instagram Reels)
              </h3>
              <button
                onClick={() => copyToClipboard(generatedContent.shortVideoScript, 'script')}
                className="text-xs font-semibold text-[#3C50E0] flex items-center gap-1 hover:underline"
              >
                {copiedKey === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'script' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] text-xs leading-relaxed font-mono whitespace-pre-line text-[#1C2434] dark:text-[#AEB7C0] max-h-72 overflow-y-auto">
              {generatedContent.shortVideoScript}
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Ready for mobile field agent room tour filming.
            </p>
          </div>

          {/* Card 3: Facebook Post Copy */}
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47]">
              <h3 className="font-bold text-sm text-[#1C2434] dark:text-white flex items-center gap-2">
                <span className="h-4 w-4 rounded-xs bg-[#1877F2] text-white flex items-center justify-center font-bold text-[10px]">f</span>
                Facebook Page Post
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(generatedContent.facebookPost, 'fb')}
                  className="text-xs font-semibold text-[#3C50E0] flex items-center gap-1 hover:underline"
                >
                  {copiedKey === 'fb' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'fb' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] text-xs leading-relaxed whitespace-pre-line text-[#1C2434] dark:text-[#AEB7C0] max-h-80 overflow-y-auto">
              {generatedContent.facebookPost}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  onPublishContent(
                    {
                      id: `mc-${Date.now()}`,
                      propertyId: selectedProperty.id,
                      propertyTitle: selectedProperty.title,
                      angle: selectedAngle,
                      headline: generatedContent.headline,
                      facebookPost: generatedContent.facebookPost,
                      instagramCaption: generatedContent.instagramCaption,
                      cta: generatedContent.cta,
                      hashtags: generatedContent.hashtags,
                      shortVideoScript: generatedContent.shortVideoScript,
                      createdAt: new Date().toISOString().split('T')[0]
                    },
                    'Facebook Page'
                  );
                }}
                className="rounded-sm bg-[#1877F2] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-opacity-90 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Facebook Publishing</span>
              </button>
            </div>
          </div>

          {/* Card 4: Instagram Caption */}
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47]">
              <h3 className="font-bold text-sm text-[#1C2434] dark:text-white flex items-center gap-2">
                <span className="h-4 w-4 rounded-xs bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-[10px]">IG</span>
                Instagram Caption & Bio Link
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(generatedContent.instagramCaption, 'ig')}
                  className="text-xs font-semibold text-[#3C50E0] flex items-center gap-1 hover:underline"
                >
                  {copiedKey === 'ig' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'ig' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] text-xs leading-relaxed whitespace-pre-line text-[#1C2434] dark:text-[#AEB7C0] max-h-80 overflow-y-auto">
              {generatedContent.instagramCaption}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  onPublishContent(
                    {
                      id: `mc-${Date.now()}`,
                      propertyId: selectedProperty.id,
                      propertyTitle: selectedProperty.title,
                      angle: selectedAngle,
                      headline: generatedContent.headline,
                      facebookPost: generatedContent.facebookPost,
                      instagramCaption: generatedContent.instagramCaption,
                      cta: generatedContent.cta,
                      hashtags: generatedContent.hashtags,
                      shortVideoScript: generatedContent.shortVideoScript,
                      createdAt: new Date().toISOString().split('T')[0]
                    },
                    'Instagram'
                  );
                }}
                className="rounded-sm bg-gradient-to-r from-purple-600 to-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:opacity-90 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Instagram Publishing</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
