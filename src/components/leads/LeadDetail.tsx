import React, { useState } from 'react';
import { 
  User, 
  MessageCircle, 
  Phone, 
  Mail, 
  Building2, 
  Calendar, 
  Compass, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  ArrowLeft,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { Lead, Property, PipelineStage, LeadTemperature, FollowupActivity, SiteVisit } from '../../types';
import { matchPropertiesForLead } from '../../services/storage';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Badge, getLeadTemperatureBadge, getPipelineStageBadge } from '../common/Badge';

interface LeadDetailProps {
  lead: Lead;
  properties: Property[];
  followups: FollowupActivity[];
  siteVisits: SiteVisit[];
  onBack: () => void;
  onUpdateStage: (leadId: string, stage: PipelineStage) => void;
  onUpdateTemp: (leadId: string, temp: LeadTemperature) => void;
  onSelectProperty: (property: Property) => void;
  onScheduleVisit: (lead: Lead) => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({
  lead,
  properties,
  followups,
  siteVisits,
  onBack,
  onUpdateStage,
  onUpdateTemp,
  onSelectProperty,
  onScheduleVisit
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'matches' | 'activities' | 'visits' | 'notes'>('overview');

  const leadFollowups = followups.filter(f => f.leadId === lead.id || f.leadName === lead.buyerName);
  const leadVisits = siteVisits.filter(v => v.leadId === lead.id || v.buyerName === lead.buyerName);
  const matches = matchPropertiesForLead(lead, properties);

  const formatPrice = (val: number) => {
    if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)} M`;
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(0)} Jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'requirements', label: 'Buyer Qualification' },
    { key: 'matches', label: `Matching Properties (${matches.length})` },
    { key: 'activities', label: `Activities (${leadFollowups.length})` },
    { key: 'visits', label: `Site Visits (${leadVisits.length})` },
    { key: 'notes', label: 'Notes' }
  ];

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName={`Lead Profile: ${lead.buyerName}`}
        parentName="Leads"
        parentPath="/leads"
        onNavigate={onBack}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onScheduleVisit(lead)}
              className="inline-flex items-center gap-1.5 rounded-sm bg-[#3C50E0] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-opacity-90 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Site Visit</span>
            </button>
            <a
              href={`https://wa.me/${lead.whatsapp}?text=Halo%20Pak/Bu%20${encodeURIComponent(lead.buyerName)},%20dari%20Honey-an%20Property...`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-sm bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat WhatsApp</span>
            </a>
          </div>
        }
      />

      {/* LEAD HEADER BANNER */}
      <div className="mb-6 rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {getLeadTemperatureBadge(lead.leadTemperature)}
              {getPipelineStageBadge(lead.pipelineStage)}
              <span className="text-xs text-[#64748B] dark:text-[#8A99AD]">·</span>
              <span className="text-xs text-[#64748B] dark:text-[#8A99AD]">
                Source: <strong>{lead.source}</strong>
              </span>
            </div>

            <h2 className="text-2xl font-bold text-[#1C2434] dark:text-white">
              {lead.buyerName}
            </h2>

            <div className="flex items-center gap-4 text-xs text-[#64748B] dark:text-[#8A99AD] mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <MessageCircle className="w-3.5 h-3.5" />
                +{lead.whatsapp}
              </span>
              {lead.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {lead.email}
                </span>
              )}
              <span>Assigned Sales: <strong>{lead.assignedSales}</strong></span>
              <span>Last Activity: {lead.lastActivity}</span>
            </div>
          </div>

          {/* Quick Stage Mover */}
          <div className="flex items-center gap-3 bg-[#F8FAFC] dark:bg-[#1A222C] p-3 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#8A99AD] block">
                Update Pipeline Stage:
              </span>
              <select
                value={lead.pipelineStage}
                onChange={(e) => onUpdateStage(lead.id, e.target.value as PipelineStage)}
                className="mt-1 rounded-sm border border-[#E2E8F0] bg-white py-1 px-2.5 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#24303F] dark:text-white font-bold"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Property Suggested">Property Suggested</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Booking">Booking</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#8A99AD] block">
                Temperature:
              </span>
              <select
                value={lead.leadTemperature}
                onChange={(e) => onUpdateTemp(lead.id, e.target.value as LeadTemperature)}
                className="mt-1 rounded-sm border border-[#E2E8F0] bg-white py-1 px-2.5 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#24303F] dark:text-white font-bold"
              >
                <option value="Hot">🔥 Hot</option>
                <option value="Warm">⚡ Warm</option>
                <option value="Cold">❄️ Cold</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TABS HEADER */}
      <div className="mb-6 flex border-b border-[#E2E8F0] dark:border-[#2E3A47] overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-3 px-5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[#3C50E0] text-[#3C50E0] dark:text-[#80CAEE] bg-[#3C50E0]/5'
                : 'border-transparent text-[#64748B] hover:text-[#1C2434] dark:text-[#8A99AD] dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Qualification Summary Card */}
            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
              <h3 className="font-bold text-sm text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47] mb-4">
                Buyer Qualification Summary
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Budget Range</span>
                  <span className="text-sm font-bold text-[#3C50E0]">
                    {formatPrice(lead.minBudget)} - {formatPrice(lead.maxBudget)}
                  </span>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Preferred Area</span>
                  <span className="text-sm font-bold text-[#1C2434] dark:text-white">
                    {lead.preferredLocation}
                  </span>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Property Type</span>
                  <span className="text-sm font-bold text-[#1C2434] dark:text-white">
                    {lead.propertyType} (Min {lead.minBedrooms} KT)
                  </span>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Payment Method</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {lead.paymentMethod}
                  </span>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Buying Purpose</span>
                  <span className="text-sm font-bold text-[#1C2434] dark:text-white">
                    {lead.buyingPurpose}
                  </span>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Purchase Timeline</span>
                  <span className="text-sm font-bold text-amber-500">
                    {lead.purchaseTimeline}
                  </span>
                </div>
              </div>
            </div>

            {/* Inquired Listing Card */}
            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
              <h3 className="font-bold text-sm text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47] mb-3">
                Original Inquired Listing
              </h3>
              <p className="text-xs font-semibold text-[#1C2434] dark:text-white">
                {lead.interestedPropertyTitle}
              </p>
              <p className="text-xs text-[#64748B] dark:text-[#8A99AD] mt-1">
                Campaign: {lead.campaign}
              </p>
            </div>
          </div>

          {/* Right Column: Next Steps */}
          <div className="space-y-6">
            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] text-xs space-y-3">
              <h3 className="font-bold text-sm text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
                Quick Sales Actions
              </h3>
              <button
                onClick={() => onScheduleVisit(lead)}
                className="w-full flex items-center justify-center gap-1.5 rounded-sm bg-[#3C50E0] py-2 text-white font-semibold hover:bg-opacity-90 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Site Visit Appointment</span>
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className="w-full flex items-center justify-center gap-1.5 rounded-sm border border-[#3C50E0] text-[#3C50E0] py-2 font-semibold hover:bg-[#3C50E0]/10 transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View Matching Properties ({matches.length})</span>
              </button>
            </div>

            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] text-xs">
              <h3 className="font-bold text-sm text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47] mb-2">
                Consultant Notes
              </h3>
              <p className="text-[#64748B] dark:text-[#8A99AD] leading-relaxed">
                {lead.notes || 'No detailed consultation notes added yet.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REQUIREMENTS */}
      {activeTab === 'requirements' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] text-xs space-y-4">
          <h3 className="font-bold text-base text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47]">
            Full Buyer Requirements Specification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47] space-y-2">
              <span className="font-bold text-sm text-[#1C2434] dark:text-white block">Financial Criteria:</span>
              <div className="flex justify-between"><span>Minimum Budget:</span> <strong>{formatPrice(lead.minBudget)}</strong></div>
              <div className="flex justify-between"><span>Maximum Budget:</span> <strong>{formatPrice(lead.maxBudget)}</strong></div>
              <div className="flex justify-between"><span>Payment Scheme:</span> <strong className="text-emerald-600">{lead.paymentMethod}</strong></div>
              <div className="flex justify-between"><span>Purchase Timeline:</span> <strong className="text-amber-500">{lead.purchaseTimeline}</strong></div>
            </div>
            <div className="p-4 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47] space-y-2">
              <span className="font-bold text-sm text-[#1C2434] dark:text-white block">Physical Criteria:</span>
              <div className="flex justify-between"><span>Target Location:</span> <strong>{lead.preferredLocation}</strong></div>
              <div className="flex justify-between"><span>Property Type:</span> <strong>{lead.propertyType}</strong></div>
              <div className="flex justify-between"><span>Minimum Bedrooms:</span> <strong>{lead.minBedrooms} KT</strong></div>
              <div className="flex justify-between"><span>Minimum Land Size:</span> <strong>{lead.minLandSize} m²</strong></div>
              <div className="flex justify-between"><span>Buying Purpose:</span> <strong>{lead.buyingPurpose}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MATCHES */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
            <h3 className="font-bold text-base text-[#1C2434] dark:text-white mb-1">
              Top Matched Inventory for {lead.buyerName}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#8A99AD] mb-4">
              Scored using deterministic matching against budget, location, bedrooms, and land requirements
            </p>

            <div className="space-y-3">
              {matches.map(m => (
                <div key={m.property.id} className="p-4 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] bg-[#F8FAFC] dark:bg-[#1A222C] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={m.property.coverImage} alt={m.property.title} className="w-16 h-14 object-cover rounded-xs" />
                    <div>
                      <span className="font-mono text-[10px] text-[#3C50E0] font-bold">{m.property.code}</span>
                      <h4 
                        onClick={() => onSelectProperty(m.property)}
                        className="font-bold text-sm text-[#1C2434] dark:text-white hover:text-[#3C50E0] cursor-pointer"
                      >
                        {m.property.title}
                      </h4>
                      <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">
                        {m.property.district}, {m.property.city} · Rp {Number(m.property.askingPrice).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-emerald-600">{m.score}%</span>
                      <span className="text-[10px] text-[#94A3B8] block">Match Score</span>
                    </div>
                    <button
                      onClick={() => onSelectProperty(m.property)}
                      className="rounded bg-[#3C50E0] px-3 py-1.5 text-white font-semibold hover:bg-opacity-90"
                    >
                      View Listing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ACTIVITIES */}
      {activeTab === 'activities' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] text-xs">
          <h3 className="font-bold text-base text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47] mb-4">
            Follow-up Activities & Timeline
          </h3>
          <div className="space-y-3">
            {leadFollowups.length === 0 ? (
              <p className="text-center text-[#64748B] dark:text-[#8A99AD] py-6">No specific follow-up activity recorded.</p>
            ) : (
              leadFollowups.map(fl => (
                <div key={fl.id} className="p-3.5 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] bg-[#F8FAFC] dark:bg-[#1A222C] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1C2434] dark:text-white">[{fl.activityType}] {fl.notes}</span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block mt-0.5">
                      Assigned: {fl.assignedSales} · Schedule: {fl.scheduledDate}
                    </span>
                  </div>
                  <Badge variant={fl.status === 'Completed' ? 'success' : 'warning'}>{fl.status}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SITE VISITS */}
      {activeTab === 'visits' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] text-xs">
          <h3 className="font-bold text-base text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47] mb-4">
            Site Visits with this Buyer
          </h3>
          <div className="space-y-3">
            {leadVisits.length === 0 ? (
              <p className="text-center text-[#64748B] dark:text-[#8A99AD] py-6">No site visits scheduled for this buyer yet.</p>
            ) : (
              leadVisits.map(v => (
                <div key={v.id} className="p-3.5 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] bg-[#F8FAFC] dark:bg-[#1A222C] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#1C2434] dark:text-white">{v.propertyTitle}</span>
                      <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">{v.propertyAddress}</span>
                    </div>
                    <Badge variant={v.status === 'Completed' ? 'success' : 'warning'}>{v.status}</Badge>
                  </div>
                  <p className="text-[#64748B] dark:text-[#8A99AD]">
                    Schedule: <strong>{v.schedule}</strong> · Agent: <strong>{v.sales}</strong>
                  </p>
                  {v.buyerFeedback && (
                    <div className="p-2 bg-white dark:bg-[#24303F] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
                      <strong>Feedback: </strong> {v.buyerFeedback}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: NOTES */}
      {activeTab === 'notes' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] text-xs">
          <h3 className="font-bold text-base text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47] mb-4">
            Consultation Notes & Communication
          </h3>
          <div className="p-4 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
            <p className="text-[#1C2434] dark:text-[#AEB7C0] leading-relaxed whitespace-pre-line">
              {lead.notes || 'Belum ada catatan detail dari sales.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
