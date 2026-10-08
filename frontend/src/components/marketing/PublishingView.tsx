import React, { useState } from 'react';
import { 
  Share2, 
  Plus, 
  Search, 
  ExternalLink, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Building2,
  Users
} from 'lucide-react';
import { PublishingRecord, Property } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface PublishingViewProps {
  records: PublishingRecord[];
  properties: Property[];
  onAddRecord: (record: PublishingRecord) => void;
  onNavigate: (path: string) => void;
}

export const PublishingView: React.FC<PublishingViewProps> = ({
  records,
  properties,
  onAddRecord,
  onNavigate
}) => {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Record state
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const [channel, setChannel] = useState<PublishingRecord['channel']>('Instagram');
  const [campaignName, setCampaignName] = useState('Organic Listing Blast');
  const [contentSnippet, setContentSnippet] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  const filtered = records.filter(rec => {
    if (channelFilter !== 'All' && rec.channel !== channelFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        rec.propertyTitle.toLowerCase().includes(q) ||
        rec.campaignName.toLowerCase().includes(q) ||
        rec.contentSnippet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === selectedPropId);
    if (!prop) return;

    const newRecord: PublishingRecord = {
      id: `pub-${Date.now()}`,
      propertyId: prop.id,
      propertyTitle: prop.title,
      channel,
      campaignName,
      publishDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Published',
      leadsGenerated: 0,
      contentSnippet: contentSnippet || prop.title,
      externalPostUrl: externalUrl || undefined
    };

    onAddRecord(newRecord);
    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName="Social Media & Channel Publishing"
        parentName="Marketing"
        parentPath="/marketing/publishing"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Post</span>
          </button>
        }
      />

      {/* FILTER & SEARCH */}
      <div className="mb-6 rounded-sm border border-[#E2E8F0] bg-white p-4 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#8A99AD]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search published content, property, campaign..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
            >
              <option value="All">All Channels</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook Page">Facebook Page</option>
              <option value="TikTok">TikTok</option>
              <option value="WhatsApp Channel">WhatsApp Channel</option>
              <option value="Website">Website</option>
            </select>
          </div>
        </div>
      </div>

      {/* PUBLISHING TABLE */}
      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
              <tr>
                <th className="px-5 py-3.5">Property</th>
                <th className="px-4 py-3.5">Channel</th>
                <th className="px-5 py-3.5">Content Preview</th>
                <th className="px-4 py-3.5">Campaign</th>
                <th className="px-4 py-3.5">Publish Date</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Leads Generated</th>
                <th className="px-4 py-3.5 text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
              {filtered.map(rec => (
                <tr key={rec.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C] transition-colors">
                  <td className="px-5 py-3.5 font-bold text-[#1C2434] dark:text-white max-w-[180px] truncate">
                    {rec.propertyTitle}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-semibold text-[#3C50E0] dark:text-[#80CAEE]">
                      {rec.channel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 max-w-xs text-[#64748B] dark:text-[#8A99AD]">
                    <span className="line-clamp-2">{rec.contentSnippet}</span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-[#1C2434] dark:text-white">
                    {rec.campaignName}
                  </td>
                  <td className="px-4 py-3.5 text-[#64748B] dark:text-[#8A99AD] whitespace-nowrap">
                    {rec.publishDate}
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge variant={rec.status === 'Published' ? 'success' : rec.status === 'Scheduled' ? 'warning' : 'neutral'} size="sm">
                      {rec.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-emerald-600">
                    {rec.leadsGenerated} leads
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    {rec.externalPostUrl ? (
                      <a
                        href={rec.externalPostUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#3C50E0] hover:underline"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[#94A3B8]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Live Property Post"
        subtitle="Track external social media publication and incoming lead origin"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Select Property *
            </label>
            <select
              value={selectedPropId}
              onChange={(e) => setSelectedPropId(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.title}
                </option>
              ))}
            </select>
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
                <option value="Instagram">Instagram</option>
                <option value="Facebook Page">Facebook Page</option>
                <option value="TikTok">TikTok</option>
                <option value="WhatsApp Channel">WhatsApp Channel</option>
                <option value="Website">Website</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Content Snippet
            </label>
            <textarea
              rows={3}
              value={contentSnippet}
              onChange={(e) => setContentSnippet(e.target.value)}
              placeholder="Paste copy or headline..."
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Live Post URL (optional)
            </label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://instagram.com/p/..."
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
              Record Publication
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
