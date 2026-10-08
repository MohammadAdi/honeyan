import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign, 
  CheckCircle,
  Building2
} from 'lucide-react';
import { Campaign, Property } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Modal } from '../common/Modal';

interface CampaignsViewProps {
  campaigns: Campaign[];
  properties: Property[];
  onAddCampaign: (campaign: Campaign) => void;
  onNavigate: (path: string) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  properties,
  onAddCampaign,
  onNavigate
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Campaign state
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<Campaign['channel']>('Meta Ads (FB/IG)');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [angle, setAngle] = useState('Family Home');
  const [budget, setBudget] = useState(3000000);
  const [selectedProps, setSelectedProps] = useState<string[]>([properties[0]?.id || '']);

  const filtered = campaigns.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.channel.toLowerCase().includes(q) || c.contentAngle.toLowerCase().includes(q);
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newCampaign: Campaign = {
      id: `cmp-${Date.now()}`,
      name,
      channel,
      startDate,
      endDate,
      properties: selectedProps,
      contentAngle: angle,
      leadCount: 0,
      siteVisitCount: 0,
      closedDeals: 0,
      budget: Number(budget)
    };

    onAddCampaign(newCampaign);
    setIsModalOpen(false);
    setName('');
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName="Marketing Campaigns"
        parentName="Marketing"
        parentPath="/marketing/campaigns"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
          </button>
        }
      />

      {/* FILTER & SEARCH */}
      <div className="mb-6 rounded-sm border border-[#E2E8F0] bg-white p-4 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#8A99AD]">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search campaigns by name, channel, angle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
          />
        </div>
      </div>

      {/* CAMPAIGNS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(cmp => (
          <div key={cmp.id} className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] text-xs">
            <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47] mb-3">
              <div>
                <span className="text-[10px] font-bold text-[#3C50E0] uppercase tracking-wider block">
                  {cmp.channel}
                </span>
                <h3 className="text-base font-bold text-[#1C2434] dark:text-white mt-0.5">
                  {cmp.name}
                </h3>
                <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">
                  Angle: <strong>{cmp.contentAngle}</strong> · {cmp.startDate} to {cmp.endDate}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Budget</span>
                <span className="font-bold text-sm text-[#1C2434] dark:text-white">
                  Rp {Number(cmp.budget).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-2 text-center bg-[#F8FAFC] dark:bg-[#1A222C] p-3 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47]">
              <div>
                <span className="text-[10px] text-[#64748B] dark:text-[#8A99AD] block">Leads Generated</span>
                <span className="text-lg font-extrabold text-[#3C50E0]">{cmp.leadCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] dark:text-[#8A99AD] block">Site Visits</span>
                <span className="text-lg font-extrabold text-amber-500">{cmp.siteVisitCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] dark:text-[#8A99AD] block">Closed Deals</span>
                <span className="text-lg font-extrabold text-emerald-600">{cmp.closedDeals}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Marketing Campaign"
        subtitle="Organize multi-property paid and organic lead generation campaigns"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Campaign Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sleman Cluster Modern Family Home Q4"
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              >
                <option value="Meta Ads (FB/IG)">Meta Ads (FB/IG)</option>
                <option value="Organic Social">Organic Social</option>
                <option value="Google Search">Google Search</option>
                <option value="WhatsApp Blast">WhatsApp Blast</option>
                <option value="Agent Referral">Agent Referral</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Content Angle
              </label>
              <input
                type="text"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                placeholder="e.g. Family Home / Strategic Location"
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Budget Allocated (Rp)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
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
              Save Campaign
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
