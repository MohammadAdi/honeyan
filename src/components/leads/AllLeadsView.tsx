import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  MessageCircle, 
  Phone, 
  Flame, 
  ArrowRight, 
  Calendar,
  Building2,
  DollarSign,
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Lead, Property, LeadTemperature, PipelineStage, PaymentMethod, BuyingPurpose, PurchaseTimeline } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Badge, getLeadTemperatureBadge, getPipelineStageBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface AllLeadsViewProps {
  leads: Lead[];
  properties: Property[];
  isMyLeads?: boolean;
  currentSalesName?: string;
  onSelectLead: (lead: Lead) => void;
  onAddLead: (lead: Lead) => void;
  onUpdateLeadStage: (id: string, stage: PipelineStage) => void;
  onNavigate: (path: string) => void;
}

export const AllLeadsView: React.FC<AllLeadsViewProps> = ({
  leads,
  properties,
  isMyLeads = false,
  currentSalesName = 'Dimas Aditya',
  onSelectLead,
  onAddLead,
  onUpdateLeadStage,
  onNavigate
}) => {
  const [search, setSearch] = useState('');
  const [tempFilter, setTempFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Lead state
  const [buyerName, setBuyerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const [source, setSource] = useState<Lead['source']>('Instagram Ads');
  const [campaign, setCampaign] = useState('Sleman Modern Family Home Q3');
  const [temp, setTemp] = useState<LeadTemperature>('Hot');
  const [stage, setStage] = useState<PipelineStage>('New');
  const [assignedSales, setAssignedSales] = useState(currentSalesName);
  const [notes, setNotes] = useState('');

  // Qualification fields
  const [minBudget, setMinBudget] = useState(700000000);
  const [maxBudget, setMaxBudget] = useState(900000000);
  const [preferredLoc, setPreferredLoc] = useState('Sleman');
  const [propType, setPropType] = useState('House');
  const [minBedrooms, setMinBedrooms] = useState(3);
  const [minLandSize, setMinLandSize] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('KPR');
  const [buyingPurpose, setBuyingPurpose] = useState<BuyingPurpose>('Own Stay');
  const [purchaseTimeline, setPurchaseTimeline] = useState<PurchaseTimeline>('< 3 Months');

  const filtered = leads
    .filter(l => {
      if (isMyLeads && l.assignedSales !== currentSalesName) return false;
      if (tempFilter !== 'All' && l.leadTemperature !== tempFilter) return false;
      if (stageFilter !== 'All' && l.pipelineStage !== stageFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          l.buyerName.toLowerCase().includes(q) ||
          l.whatsapp.includes(q) ||
          l.interestedPropertyTitle.toLowerCase().includes(q) ||
          l.preferredLocation.toLowerCase().includes(q) ||
          l.assignedSales.toLowerCase().includes(q)
        );
      }
      return true;
    });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !whatsapp) return;

    const prop = properties.find(p => p.id === selectedPropId) || properties[0];

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      buyerName,
      whatsapp: whatsapp.replace(/[^0-9]/g, ''),
      email,
      interestedPropertyId: prop.id,
      interestedPropertyTitle: prop.title,
      source,
      campaign,
      leadTemperature: temp,
      pipelineStage: stage,
      assignedSales,
      lastActivity: new Date().toISOString().replace('T', ' ').substring(0, 16),
      createdAt: new Date().toISOString().split('T')[0],
      notes,
      minBudget: Number(minBudget),
      maxBudget: Number(maxBudget),
      preferredLocation: preferredLoc,
      propertyType: propType as any,
      minBedrooms: Number(minBedrooms),
      minLandSize: Number(minLandSize),
      paymentMethod,
      buyingPurpose,
      purchaseTimeline
    };

    onAddLead(newLead);
    setIsModalOpen(false);
    // Reset
    setBuyerName('');
    setWhatsapp('');
    setEmail('');
    setNotes('');
  };

  const formatPrice = (val: number) => {
    if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)} M`;
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(0)} Jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName={isMyLeads ? "My Assigned Leads" : "All Property Buyer Leads"}
        parentName="Leads"
        parentPath="/leads"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/leads/pipeline')}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#1C2434] hover:bg-[#F1F5F9] dark:border-[#2E3A47] dark:bg-[#24303F] dark:text-white"
            >
              <span>Kanban Pipeline</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Capture Lead</span>
            </button>
          </div>
        }
      />

      {/* FILTER & SEARCH */}
      <div className="mb-6 rounded-sm border border-[#E2E8F0] bg-white p-4 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#8A99AD]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search buyer name, WhatsApp, property, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div>
            <select
              value={tempFilter}
              onChange={(e) => setTempFilter(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
            >
              <option value="All">All Temperatures</option>
              <option value="Hot">🔥 Hot Leads</option>
              <option value="Warm">⚡ Warm Leads</option>
              <option value="Cold">❄️ Cold Leads</option>
            </select>
          </div>

          <div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
            >
              <option value="All">All Pipeline Stages</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Property Suggested">Property Suggested</option>
              <option value="Site Visit">Site Visit</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Booking">Booking</option>
              <option value="Closed Won">Closed Won</option>
            </select>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E2E8F0] dark:border-[#2E3A47] flex items-center justify-between text-xs text-[#64748B] dark:text-[#8A99AD]">
          <span>Showing <strong className="text-[#1C2434] dark:text-white">{filtered.length}</strong> leads</span>
          <button
            onClick={() => onNavigate('/leads/requirements')}
            className="text-xs font-semibold text-[#3C50E0] hover:underline"
          >
            Open Buyer Requirements Matching Tool →
          </button>
        </div>
      </div>

      {/* LEADS TABLE */}
      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
              <tr>
                <th className="px-5 py-3.5">Buyer</th>
                <th className="px-4 py-3.5">WhatsApp</th>
                <th className="px-4 py-3.5">Interested Property & Budget</th>
                <th className="px-4 py-3.5">Source / Campaign</th>
                <th className="px-3 py-3.5">Temp</th>
                <th className="px-4 py-3.5">Pipeline Stage</th>
                <th className="px-4 py-3.5">Assigned Sales</th>
                <th className="px-4 py-3.5">Last Activity</th>
                <th className="px-4 py-3.5 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#64748B] dark:text-[#8A99AD]">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(lead => (
                  <tr 
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-[#1C2434] dark:text-white">
                        {lead.buyerName}
                      </div>
                      <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">
                        Target: {lead.preferredLocation} ({lead.propertyType})
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-mono text-emerald-600 font-semibold">
                        +{lead.whatsapp}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 max-w-[200px]">
                      <span className="font-medium text-[#1C2434] dark:text-white line-clamp-1 block">
                        {lead.interestedPropertyTitle}
                      </span>
                      <span className="text-[11px] text-[#3C50E0] font-semibold">
                        {formatPrice(lead.minBudget)} - {formatPrice(lead.maxBudget)} · {lead.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-[#1C2434] dark:text-white block">
                        {lead.source}
                      </span>
                      <span className="text-[10px] text-[#94A3B8] line-clamp-1">
                        {lead.campaign}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      {getLeadTemperatureBadge(lead.leadTemperature)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getPipelineStageBadge(lead.pipelineStage)}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#1C2434] dark:text-white whitespace-nowrap">
                      {lead.assignedSales}
                    </td>
                    <td className="px-4 py-3.5 text-[#64748B] dark:text-[#8A99AD] whitespace-nowrap text-[11px]">
                      {lead.lastActivity}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${lead.whatsapp}?text=Halo%20Pak/Bu%20${encodeURIComponent(lead.buyerName)},%20saya%20${encodeURIComponent(lead.assignedSales)}%20dari%20Honey-an%20Property.%20Mengenai%20properti%20${encodeURIComponent(lead.interestedPropertyTitle)}...`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat WA</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CAPTURE LEAD MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Capture & Qualify Property Buyer Lead"
        subtitle="Record inbound inquiry from WhatsApp, Meta Ads, TikTok or marketplace"
        maxWidth="4xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          {/* Buyer Basic */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Buyer Name *
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g. Budi Santoso"
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                WhatsApp Number * (format: 628...)
              </label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="628112233445"
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@example.com"
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
          </div>

          {/* Property Inquired */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Inquired Property *
              </label>
              <select
                value={selectedPropId}
                onChange={(e) => setSelectedPropId(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.title} (Rp {Number(p.askingPrice).toLocaleString('id-ID')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Lead Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              >
                <option value="WhatsApp Inbound">WhatsApp Inbound</option>
                <option value="Instagram Ads">Instagram Ads</option>
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="TikTok Organic">TikTok Organic</option>
                <option value="Marketplace Lead">Marketplace Lead</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          {/* Qualification Parameters Header */}
          <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#2E3A47]">
            <h4 className="font-bold text-xs text-[#3C50E0] mb-2 uppercase tracking-wider">
              Buyer Qualification & Requirements:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Min Budget (Rp)
                </label>
                <input
                  type="number"
                  value={minBudget}
                  onChange={(e) => setMinBudget(Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Max Budget (Rp)
                </label>
                <input
                  type="number"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Preferred Location
                </label>
                <input
                  type="text"
                  value={preferredLoc}
                  onChange={(e) => setPreferredLoc(e.target.value)}
                  placeholder="e.g. Sleman / Bantul"
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Property Type
                </label>
                <select
                  value={propType}
                  onChange={(e) => setPropType(e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                >
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Shophouse">Shophouse</option>
                  <option value="Land">Land</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Min Bedrooms (KT)
                </label>
                <input
                  type="number"
                  value={minBedrooms}
                  onChange={(e) => setMinBedrooms(Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Min Land Size (m²)
                </label>
                <input
                  type="number"
                  value={minLandSize}
                  onChange={(e) => setMinLandSize(Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                >
                  <option value="KPR">KPR</option>
                  <option value="Cash">Cash</option>
                  <option value="Cash + KPR">Cash + KPR</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Purchase Timeline
                </label>
                <select
                  value={purchaseTimeline}
                  onChange={(e) => setPurchaseTimeline(e.target.value as any)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="< 1 Month">&lt; 1 Month</option>
                  <option value="< 3 Months">&lt; 3 Months</option>
                  <option value="3-6 Months">3-6 Months</option>
                  <option value="Exploring">Exploring</option>
                </select>
              </div>
            </div>
          </div>

          {/* CRM Routing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Lead Temperature
              </label>
              <select
                value={temp}
                onChange={(e) => setTemp(e.target.value as any)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              >
                <option value="Hot">🔥 Hot</option>
                <option value="Warm">⚡ Warm</option>
                <option value="Cold">❄️ Cold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Pipeline Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Property Suggested">Property Suggested</option>
                <option value="Site Visit">Site Visit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Assigned Sales Agent
              </label>
              <select
                value={assignedSales}
                onChange={(e) => setAssignedSales(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              >
                <option value="Dimas Aditya">Dimas Aditya</option>
                <option value="Siti Rahma">Siti Rahma</option>
                <option value="Rian Pratama">Rian Pratama</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Initial Notes & Consultation Remarks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan dari percakapan WhatsApp pertama, preferensi jalan, DP siap berapa..."
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0] dark:border-[#2E3A47]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-sm border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] dark:border-[#2E3A47] dark:text-[#8A99AD]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90"
            >
              Save & Qualify Lead
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
