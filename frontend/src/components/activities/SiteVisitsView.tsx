import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  MapPin, 
  User, 
  Building2, 
  CheckCircle2, 
  XCircle,
  MessageSquare,
  Clock
} from 'lucide-react';
import { SiteVisit, Lead, Property } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface SiteVisitsViewProps {
  siteVisits: SiteVisit[];
  leads: Lead[];
  properties: Property[];
  onAddSiteVisit: (visit: SiteVisit) => void;
  onUpdateSiteVisit: (visit: SiteVisit) => void;
  onNavigate: (path: string) => void;
}

export const SiteVisitsView: React.FC<SiteVisitsViewProps> = ({
  siteVisits,
  leads,
  properties,
  onAddSiteVisit,
  onUpdateSiteVisit,
  onNavigate
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackModalVisit, setFeedbackModalVisit] = useState<SiteVisit | null>(null);

  // New Visit State
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const [schedule, setSchedule] = useState('2026-09-29 10:00');
  const [sales, setSales] = useState('Dimas Aditya');
  const [status, setStatus] = useState<SiteVisit['status']>('Scheduled');
  const [notes, setNotes] = useState('Bertemu di lokasi cluster gerbang depan.');

  // Feedback state
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<SiteVisit['status']>('Completed');

  const filtered = siteVisits.filter(v => {
    if (statusFilter !== 'All' && v.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        v.buyerName.toLowerCase().includes(q) ||
        v.propertyTitle.toLowerCase().includes(q) ||
        v.propertyAddress.toLowerCase().includes(q) ||
        v.sales.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find(l => l.id === selectedLeadId);
    const prop = properties.find(p => p.id === selectedPropId);
    if (!lead || !prop) return;

    const newVisit: SiteVisit = {
      id: `sv-${Date.now()}`,
      leadId: lead.id,
      buyerName: lead.buyerName,
      buyerPhone: lead.whatsapp,
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyAddress: prop.address || `${prop.district}, ${prop.city}`,
      schedule,
      sales,
      status,
      notes,
      buyerFeedback: ''
    };

    onAddSiteVisit(newVisit);
    setIsModalOpen(false);
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackModalVisit) return;

    const updated = {
      ...feedbackModalVisit,
      status: feedbackStatus,
      buyerFeedback: feedbackText
    };

    onUpdateSiteVisit(updated);
    setFeedbackModalVisit(null);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName="Property Site Visits"
        parentName="Activities"
        parentPath="/activities/site-visits"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Site Visit</span>
          </button>
        }
      />

      {/* FILTER */}
      <div className="mb-6 rounded-sm border border-[#E2E8F0] bg-white p-4 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#8A99AD]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search buyer, property, address, agent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
            >
              <option value="All">All Visit Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No Show">No Show</option>
            </select>
          </div>
        </div>
      </div>

      {/* VISITS TABLE */}
      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
              <tr>
                <th className="px-5 py-3.5">Buyer</th>
                <th className="px-5 py-3.5">Property Location</th>
                <th className="px-4 py-3.5">Schedule</th>
                <th className="px-4 py-3.5">Escort Sales</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-5 py-3.5">Buyer Feedback</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C] transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-[#1C2434] dark:text-white block">
                      {v.buyerName}
                    </span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">
                      +{v.buyerPhone}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 max-w-xs">
                    <span className="font-semibold text-[#1C2434] dark:text-white line-clamp-1 block">
                      {v.propertyTitle}
                    </span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#94A3B8]" />
                      {v.propertyAddress}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap font-medium text-[#1C2434] dark:text-white">
                    {v.schedule}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {v.sales}
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <Badge variant={v.status === 'Completed' ? 'success' : v.status === 'Confirmed' ? 'primary' : v.status === 'Cancelled' ? 'danger' : 'warning'} size="sm">
                      {v.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 max-w-xs text-[#64748B] dark:text-[#8A99AD]">
                    {v.buyerFeedback ? (
                      <span className="italic line-clamp-2">&quot;{v.buyerFeedback}&quot;</span>
                    ) : (
                      <span className="text-[#94A3B8]">Pending survey visit</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setFeedbackModalVisit(v);
                        setFeedbackText(v.buyerFeedback || '');
                        setFeedbackStatus(v.status);
                      }}
                      className="rounded border border-[#E2E8F0] dark:border-[#2E3A47] px-2.5 py-1 text-[11px] font-semibold text-[#1C2434] dark:text-white hover:border-[#3C50E0]"
                    >
                      Update / Feedback
                    </button>
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
        title="Schedule Property Site Visit"
        subtitle="Book field visit with prospective buyer and assign escort sales agent"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Select Qualified Buyer *
            </label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
            >
              {leads.map(l => (
                <option key={l.id} value={l.id}>
                  {l.buyerName} (WA: +{l.whatsapp})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Select Target Property *
            </label>
            <select
              value={selectedPropId}
              onChange={(e) => setSelectedPropId(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.title} ({p.district}, {p.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Visit Schedule (YYYY-MM-DD HH:mm) *
              </label>
              <input
                type="text"
                required
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="2026-09-29 10:00"
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Escort Sales Agent
              </label>
              <select
                value={sales}
                onChange={(e) => setSales(e.target.value)}
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
              Meeting Point & Logistic Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Titik kumpul di depan pos satpam perumahan, bawa brosur cetak dan formulir minat booking..."
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
              Confirm Site Visit
            </button>
          </div>
        </form>
      </Modal>

      {/* FEEDBACK MODAL */}
      {feedbackModalVisit && (
        <Modal
          isOpen={!!feedbackModalVisit}
          onClose={() => setFeedbackModalVisit(null)}
          title={`Site Visit Outcome: ${feedbackModalVisit.buyerName}`}
          subtitle={`Property: ${feedbackModalVisit.propertyTitle}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveFeedback} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Visit Status
              </label>
              <select
                value={feedbackStatus}
                onChange={(e) => setFeedbackStatus(e.target.value as any)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-bold"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed (Survei Selesai)</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show (Buyer Batal Hadir)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Buyer Feedback & Post-Visit Impressions *
              </label>
              <textarea
                rows={4}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Apa komentar buyer terhadap lingkungan, harga, atau desain? Apakah tertarik lanjut ke tahapan tawar harga / booking UTJ?"
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0] dark:border-[#2E3A47]">
              <button
                type="button"
                onClick={() => setFeedbackModalVisit(null)}
                className="rounded-sm border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] dark:border-[#2E3A47] dark:text-[#8A99AD]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90"
              >
                Save Feedback
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
