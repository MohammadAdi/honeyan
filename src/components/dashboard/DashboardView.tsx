import React from 'react';
import { 
  Building2, 
  CheckCircle, 
  Send, 
  Users, 
  Flame, 
  Calendar, 
  Coins, 
  BadgePercent,
  ArrowRight,
  TrendingUp,
  Eye,
  MessageCircle,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Property, Lead, CommissionRecord, SiteVisit } from '../../types';
import { StatCard } from '../common/StatCard';
import { Breadcrumb } from '../layout/Breadcrumb';
import { getLeadTemperatureBadge, getPipelineStageBadge } from '../common/Badge';

interface DashboardViewProps {
  properties: Property[];
  leads: Lead[];
  commissions: CommissionRecord[];
  siteVisits: SiteVisit[];
  onNavigate: (path: string) => void;
  onSelectLead: (lead: Lead) => void;
  onSelectProperty: (property: Property) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  properties,
  leads,
  commissions,
  siteVisits,
  onNavigate,
  onSelectLead,
  onSelectProperty
}) => {
  // Compute KPI metrics
  const activeProperties = properties.filter(p => p.listingStatus !== 'Inactive' && p.listingStatus !== 'Sold').length;
  const readyToMarket = properties.filter(p => p.listingStatus === 'Ready to Market').length;
  const publishedProperties = properties.filter(p => p.listingStatus === 'Published').length;
  const newLeads = leads.filter(l => l.pipelineStage === 'New').length;
  const hotLeads = leads.filter(l => l.leadTemperature === 'Hot').length;
  const siteVisitsThisMonth = siteVisits.length;

  const potentialCommission = commissions
    .filter(c => c.paymentStatus === 'Potential')
    .reduce((acc, curr) => acc + curr.earnedAmount, 0);

  const earnedCommission = commissions
    .filter(c => c.paymentStatus === 'Earned' || c.paymentStatus === 'Invoiced' || c.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.earnedAmount, 0);

  const paidCommission = commissions
    .filter(c => c.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.earnedAmount, 0);

  const outstandingCommission = commissions
    .filter(c => c.paymentStatus === 'Invoiced' || c.paymentStatus === 'Earned')
    .reduce((acc, curr) => acc + curr.earnedAmount, 0);

  // Pipeline stages count
  const pipelineStages = [
    { key: 'New', label: 'New', color: 'bg-slate-400' },
    { key: 'Contacted', label: 'Contacted', color: 'bg-blue-400' },
    { key: 'Qualified', label: 'Qualified', color: 'bg-indigo-500' },
    { key: 'Property Suggested', label: 'Suggested', color: 'bg-cyan-500' },
    { key: 'Site Visit', label: 'Site Visit', color: 'bg-amber-500' },
    { key: 'Negotiation', label: 'Negotiation', color: 'bg-orange-500' },
    { key: 'Booking', label: 'Booking', color: 'bg-purple-600' },
    { key: 'Closed Won', label: 'Closed Won', color: 'bg-emerald-500' }
  ];

  const stageCounts = pipelineStages.map(st => ({
    ...st,
    count: leads.filter(l => l.pipelineStage === st.key).length
  }));

  // Format currency in Rupiah
  const formatIDR = (num: number) => {
    if (num >= 1000000000) {
      return `Rp ${(num / 1000000000).toFixed(1)} M`;
    }
    if (num >= 1000000) {
      return `Rp ${(num / 1000000).toFixed(0)} Jt`;
    }
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb 
        pageName="Property Marketing & Conversion Dashboard" 
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/marketing/content')}
              className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Content</span>
            </button>
            <button
              onClick={() => onNavigate('/properties/create')}
              className="inline-flex items-center gap-2 rounded-sm border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#1C2434] hover:bg-[#F1F5F9] dark:border-[#2E3A47] dark:bg-[#24303F] dark:text-white dark:hover:bg-[#1A222C] transition-all"
            >
              <Building2 className="w-4 h-4 text-[#3C50E0]" />
              <span>Add Listing</span>
            </button>
          </div>
        }
      />

      {/* 8 KPI CARDS AS SPECIFIED IN BRIEF */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-5 mb-6">
        <StatCard
          title="Active Properties"
          value={activeProperties}
          icon={<Building2 className="w-5 h-5" />}
          growth="+12%"
          color="primary"
          onClick={() => onNavigate('/properties')}
          subtext="Under management in CRM"
        />
        <StatCard
          title="Ready to Market"
          value={readyToMarket}
          icon={<CheckCircle className="w-5 h-5" />}
          growth="+25%"
          color="info"
          onClick={() => onNavigate('/properties?filter=ready')}
          subtext="Verified specs & agreement"
        />
        <StatCard
          title="Published Properties"
          value={publishedProperties}
          icon={<Send className="w-5 h-5" />}
          growth="+8%"
          color="success"
          onClick={() => onNavigate('/properties?filter=published')}
          subtext="Live on social & channels"
        />
        <StatCard
          title="New Leads"
          value={newLeads}
          icon={<Users className="w-5 h-5" />}
          growth="+18%"
          color="primary"
          onClick={() => onNavigate('/leads')}
          subtext="Inbound from WhatsApp & ads"
        />
        <StatCard
          title="Hot Leads"
          value={hotLeads}
          icon={<Flame className="w-5 h-5" />}
          growth="+30%"
          color="danger"
          onClick={() => onNavigate('/leads/pipeline')}
          subtext="High budget & near timeline"
        />
        <StatCard
          title="Site Visits This Month"
          value={siteVisitsThisMonth}
          icon={<Calendar className="w-5 h-5" />}
          growth="+14%"
          color="warning"
          onClick={() => onNavigate('/activities/site-visits')}
          subtext="Scheduled & completed"
        />
        <StatCard
          title="Potential Commission"
          value={formatIDR(potentialCommission)}
          icon={<BadgePercent className="w-5 h-5" />}
          growth="+35%"
          color="warning"
          onClick={() => onNavigate('/transactions/commissions')}
          subtext="Active pipeline deals"
        />
        <StatCard
          title="Earned Commission"
          value={formatIDR(earnedCommission)}
          icon={<Coins className="w-5 h-5" />}
          growth="+42%"
          color="success"
          onClick={() => onNavigate('/transactions/commissions')}
          subtext="Signed deals & booked"
        />
      </div>

      {/* LEAD PIPELINE VISUALIZATION */}
      <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#1C2434] dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#3C50E0]" />
              Lead Conversion Pipeline
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#8A99AD]">
              Prospect journey from initial inbound contact to closed commission deal
            </p>
          </div>
          <button
            onClick={() => onNavigate('/leads/pipeline')}
            className="text-xs font-semibold text-[#3C50E0] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Open Kanban Board <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Funnel pipeline steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {stageCounts.map((stage, idx) => {
            const isLast = idx === stageCounts.length - 1;
            return (
              <div
                key={stage.key}
                onClick={() => onNavigate('/leads/pipeline')}
                className="group relative cursor-pointer rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] p-3 text-center bg-[#F8FAFC] dark:bg-[#1A222C] hover:border-[#3C50E0] transition-colors"
              >
                <div className={`h-1.5 w-full rounded-full mb-2 ${stage.color}`}></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8A99AD] block truncate">
                  {stage.label}
                </span>
                <span className="text-xl font-extrabold text-[#1C2434] dark:text-white mt-1 block">
                  {stage.count}
                </span>
                <span className="text-[10px] text-[#94A3B8]">
                  {leads.length > 0 ? `${Math.round((stage.count / leads.length) * 100)}% total` : '0%'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* TWO COLUMN GRID: RECENT LEADS & COMMISSION SUMMARY */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 mb-6">
        {/* RECENT LEADS TABLE (2 COLUMNS) */}
        <div className="xl:col-span-2 rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4 dark:border-[#2E3A47]">
            <div>
              <h3 className="text-base font-bold text-[#1C2434] dark:text-white">
                Recent Leads
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8A99AD]">
                Inbound buyers qualified through WhatsApp & social campaigns
              </p>
            </div>
            <button
              onClick={() => onNavigate('/leads')}
              className="text-xs font-semibold text-[#3C50E0] hover:underline"
            >
              View All ({leads.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
                <tr>
                  <th className="px-5 py-3">Buyer</th>
                  <th className="px-4 py-3">Interested Property</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-3 py-3">Temp</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Assigned Sales</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
                {leads.slice(0, 5).map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C] transition-colors cursor-pointer"
                    onClick={() => onSelectLead(lead)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-[#1C2434] dark:text-white">
                        {lead.buyerName}
                      </div>
                      <div className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">
                        WA: +{lead.whatsapp}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 max-w-[180px]">
                      <span className="font-medium text-[#1C2434] dark:text-white line-clamp-1">
                        {lead.interestedPropertyTitle}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">
                        Budget: {formatIDR(lead.minBudget)} - {formatIDR(lead.maxBudget)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#64748B] dark:text-[#8A99AD]">
                      {lead.source}
                    </td>
                    <td className="px-3 py-3.5">
                      {getLeadTemperatureBadge(lead.leadTemperature)}
                    </td>
                    <td className="px-4 py-3.5">
                      {getPipelineStageBadge(lead.pipelineStage)}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#1C2434] dark:text-white">
                      {lead.assignedSales}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLead(lead);
                        }}
                        className="rounded bg-[#3C50E0]/10 px-2 py-1 text-[11px] font-semibold text-[#3C50E0] hover:bg-[#3C50E0] hover:text-white transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COMMISSION SUMMARY (1 COLUMN) */}
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47]">
              <h3 className="text-base font-bold text-[#1C2434] dark:text-white">
                Commission Summary
              </h3>
              <Coins className="w-4 h-4 text-[#FFA70B]" />
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] p-3.5 bg-[#F8FAFC] dark:bg-[#1A222C]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B] dark:text-[#8A99AD]">Potential Commission</span>
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">Pipeline</span>
                </div>
                <div className="mt-1 text-xl font-bold text-[#1C2434] dark:text-white">
                  {formatIDR(potentialCommission)}
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Calculated from deals currently in negotiation</p>
              </div>

              <div className="rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] p-3.5 bg-[#F8FAFC] dark:bg-[#1A222C]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B] dark:text-[#8A99AD]">Earned Commission</span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-500">Secured</span>
                </div>
                <div className="mt-1 text-xl font-bold text-[#10B981]">
                  {formatIDR(earnedCommission)}
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Agreements & booking deals locked</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] p-3 bg-white dark:bg-[#24303F]">
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-[#8A99AD] block">Paid</span>
                  <span className="text-sm font-bold text-[#1C2434] dark:text-white">
                    {formatIDR(paidCommission)}
                  </span>
                </div>
                <div className="rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] p-3 bg-white dark:bg-[#24303F]">
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-[#8A99AD] block">Outstanding</span>
                  <span className="text-sm font-bold text-amber-500">
                    {formatIDR(outstandingCommission)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/transactions/commissions')}
            className="mt-4 w-full rounded-sm border border-[#3C50E0] py-2 text-xs font-semibold text-[#3C50E0] hover:bg-[#3C50E0] hover:text-white transition-colors"
          >
            Manage Commission Ledgers
          </button>
        </div>
      </div>

      {/* PROPERTY PERFORMANCE SECTION */}
      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] px-5 py-4 dark:border-[#2E3A47] gap-2">
          <div>
            <h3 className="text-base font-bold text-[#1C2434] dark:text-white">
              Property Marketing Performance
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#8A99AD]">
              Top viewed, inquiries received, site visits scheduled, and conversion rate
            </p>
          </div>
          <button
            onClick={() => onNavigate('/properties')}
            className="text-xs font-semibold text-[#3C50E0] hover:underline"
          >
            All Inventory
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
              <tr>
                <th className="px-5 py-3">Property</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Views / Inquiries</th>
                <th className="px-4 py-3">Leads Generated</th>
                <th className="px-4 py-3">Site Visits</th>
                <th className="px-4 py-3">Conversion Rate</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
              {properties.map((prop) => {
                const convRate = prop.inquiriesCount > 0 
                  ? ((prop.siteVisitCount / prop.inquiriesCount) * 100).toFixed(1)
                  : '0.0';
                return (
                  <tr 
                    key={prop.id}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C] transition-colors cursor-pointer"
                    onClick={() => onSelectProperty(prop)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={prop.coverImage} 
                          alt={prop.title}
                          className="h-10 w-14 rounded-xs object-cover border border-[#E2E8F0] dark:border-[#2E3A47]"
                        />
                        <div>
                          <span className="text-[10px] font-mono text-[#3C50E0] dark:text-[#80CAEE] font-bold">
                            {prop.code}
                          </span>
                          <h4 className="font-semibold text-[#1C2434] dark:text-white line-clamp-1 max-w-xs">
                            {prop.title}
                          </h4>
                          <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">
                            {prop.district}, {prop.city}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#1C2434] dark:text-white">
                      Rp {Number(prop.askingPrice).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 text-[#64748B] dark:text-[#8A99AD]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-[#3C50E0]" />
                          {prop.viewsCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                          {prop.inquiriesCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#1C2434] dark:text-white">
                      {prop.leadCount} leads
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#1C2434] dark:text-white">
                      {prop.siteVisitCount} visits
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#3C50E0] h-full rounded-full" 
                            style={{ width: `${Math.min(Number(convRate) * 3, 100)}%` }}
                          />
                        </div>
                        <span className="font-bold text-[#3C50E0] dark:text-[#80CAEE]">{convRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProperty(prop);
                        }}
                        className="rounded border border-[#E2E8F0] dark:border-[#2E3A47] px-2.5 py-1 text-[11px] font-semibold text-[#1C2434] dark:text-white hover:border-[#3C50E0] hover:text-[#3C50E0] transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
