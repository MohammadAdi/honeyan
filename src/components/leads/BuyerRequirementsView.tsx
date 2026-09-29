import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  MessageCircle, 
  Sparkles, 
  ArrowRight,
  MapPin,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Lead, Property, PropertyMatchResult } from '../../types';
import { matchPropertiesForLead } from '../../services/storage';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Badge, getLeadTemperatureBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface BuyerRequirementsViewProps {
  leads: Lead[];
  properties: Property[];
  onSelectLead: (lead: Lead) => void;
  onSelectProperty: (property: Property) => void;
  onNavigate: (path: string) => void;
}

export const BuyerRequirementsView: React.FC<BuyerRequirementsViewProps> = ({
  leads,
  properties,
  onSelectLead,
  onSelectProperty,
  onNavigate
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [search, setSearch] = useState('');

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const matchedResults: PropertyMatchResult[] = selectedLead 
    ? matchPropertiesForLead(selectedLead, properties) 
    : [];

  const formatPrice = (val: number) => {
    if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)} M`;
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(0)} Jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800';
    if (score >= 60) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800';
    return 'text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  };

  const handleShareToWhatsApp = (match: PropertyMatchResult) => {
    if (!selectedLead) return;
    const text = `Halo Pak/Bu ${selectedLead.buyerName}, kami dari Honey-an menemukan properti yang sangat cocok dengan kriteria Anda:

🏡 *${match.property.title}*
📍 Lokasi: ${match.property.district}, ${match.property.city}
💰 Harga: Rp ${Number(match.property.askingPrice).toLocaleString('id-ID')}
📐 Spesifikasi: LT ${match.property.landSize}m² | LB ${match.property.buildingSize}m² | ${match.property.bedrooms} KT / ${match.property.bathrooms} KM
📑 Sertifikat: ${match.property.certificateType}

Kecocokan Kriteria:
${match.matchingCriteria.map(c => `✅ ${c}`).join('\n')}

Apakah berkenan kami jadwalkan survei lokasi bersama tim kami minggu ini?`;

    window.open(`https://wa.me/${selectedLead.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName="Buyer Requirements & Deterministic Property Matching"
        parentName="Leads"
        parentPath="/leads"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Buyer Requirements List */}
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47]">
            <h3 className="font-bold text-sm text-[#1C2434] dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#3C50E0]" />
              Qualified Buyers ({leads.length})
            </h3>
            <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">Select to match</span>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {leads.map(lead => {
              const isSelected = lead.id === selectedLeadId;
              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`p-3.5 rounded-sm border cursor-pointer transition-all text-xs ${
                    isSelected
                      ? 'border-[#3C50E0] bg-[#3C50E0]/5 dark:bg-[#3C50E0]/15 shadow-xs'
                      : 'border-[#E2E8F0] dark:border-[#2E3A47] bg-white dark:bg-[#24303F] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[#1C2434] dark:text-white text-sm">
                      {lead.buyerName}
                    </span>
                    {getLeadTemperatureBadge(lead.leadTemperature)}
                  </div>

                  <div className="space-y-1 text-[11px] text-[#64748B] dark:text-[#8A99AD]">
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <strong className="text-[#1C2434] dark:text-white font-mono">
                        {formatPrice(lead.minBudget)} - {formatPrice(lead.maxBudget)}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Target Area:</span>
                      <strong className="text-[#1C2434] dark:text-white">{lead.preferredLocation}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Bedrooms / Size:</span>
                      <strong className="text-[#1C2434] dark:text-white">Min {lead.minBedrooms} KT · {lead.minLandSize}m²</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment & Timeline:</span>
                      <span className="text-[#3C50E0] font-semibold">{lead.paymentMethod} · {lead.purchaseTimeline}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deterministic Match Results */}
        <div className="lg:col-span-2 space-y-4">
          {selectedLead && (
            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#3C50E0] tracking-wider block">
                    Matching Engine Results
                  </span>
                  <h3 className="text-base font-bold text-[#1C2434] dark:text-white">
                    Matched Properties for {selectedLead.buyerName}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#8A99AD] mt-0.5">
                    Deterministic score calculated from price compatibility, location match, bedroom count, land size, and legal financing
                  </p>
                </div>

                <a
                  href={`https://wa.me/${selectedLead.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors self-start sm:self-auto"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WA: +{selectedLead.whatsapp}</span>
                </a>
              </div>

              {/* Matches List */}
              <div className="mt-4 space-y-4">
                {matchedResults.map((match, idx) => {
                  const scoreClass = getScoreColor(match.score);
                  return (
                    <div
                      key={match.property.id}
                      className="rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] bg-[#F8FAFC] dark:bg-[#1A222C] p-4 text-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={match.property.coverImage}
                            alt={match.property.title}
                            className="w-16 h-14 rounded-xs object-cover border border-[#E2E8F0] dark:border-[#2E3A47]"
                          />
                          <div>
                            <span className="font-mono text-[10px] font-bold text-[#3C50E0]">
                              {match.property.code}
                            </span>
                            <h4
                              onClick={() => onSelectProperty(match.property)}
                              className="font-bold text-sm text-[#1C2434] dark:text-white hover:text-[#3C50E0] cursor-pointer"
                            >
                              {match.property.title}
                            </h4>
                            <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">
                              {match.property.district}, {match.property.city} · LT {match.property.landSize}m² · {match.property.bedrooms} KT
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-base font-extrabold text-[#1C2434] dark:text-white block">
                              Rp {Number(match.property.askingPrice).toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-[#94A3B8]">
                              Nego min: Rp {Number(match.property.minimumNegotiablePrice).toLocaleString('id-ID')}
                            </span>
                          </div>

                          <div className={`px-3 py-1.5 rounded-sm border text-center font-bold ${scoreClass}`}>
                            <span className="text-lg leading-none block">{match.score}%</span>
                            <span className="text-[9px] uppercase tracking-wider block">Match</span>
                          </div>
                        </div>
                      </div>

                      {/* Criteria Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0] dark:border-[#2E3A47]">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-emerald-600 block">
                            Matching Criteria ({match.matchingCriteria.length}):
                          </span>
                          {match.matchingCriteria.map((c, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[#1C2434] dark:text-white">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="text-[11px]">{c}</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-amber-600 block">
                            Missing / Gaps ({match.missingCriteria.length}):
                          </span>
                          {match.missingCriteria.length === 0 ? (
                            <span className="text-[11px] text-[#64748B] italic">No criteria missing. Perfect match!</span>
                          ) : (
                            match.missingCriteria.map((m, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[#64748B] dark:text-[#8A99AD]">
                                <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span className="text-[11px]">{m}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Action footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] dark:border-[#2E3A47]">
                        <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">
                          Potential Commission: <strong>Rp {Number(match.property.potentialCommission).toLocaleString('id-ID')}</strong>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectProperty(match.property)}
                            className="rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] px-3 py-1 font-semibold text-[#1C2434] dark:text-white hover:border-[#3C50E0]"
                          >
                            Listing Detail
                          </button>
                          <button
                            onClick={() => handleShareToWhatsApp(match)}
                            className="rounded-sm bg-emerald-600 px-3 py-1 font-semibold text-white hover:bg-emerald-700 flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Propose via WA</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
