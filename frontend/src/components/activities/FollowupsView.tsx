import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  MessageCircle, 
  Phone, 
  Handshake, 
  Calendar
} from 'lucide-react';
import { FollowupActivity, Lead } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface FollowupsViewProps {
  followups: FollowupActivity[];
  leads: Lead[];
  onAddFollowup: (activity: FollowupActivity) => void;
  onUpdateStatus: (id: string, status: FollowupActivity['status']) => void;
  onNavigate: (path: string) => void;
}

export const FollowupsView: React.FC<FollowupsViewProps> = ({
  followups,
  leads,
  onAddFollowup,
  onUpdateStatus,
  onNavigate
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Followup state
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [activityType, setActivityType] = useState<FollowupActivity['activityType']>('WhatsApp');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().replace('T', ' ').substring(0, 16));
  const [assignedSales, setAssignedSales] = useState('Dimas Aditya');
  const [notes, setNotes] = useState('');

  const filtered = followups.filter(f => {
    if (typeFilter !== 'All' && f.activityType !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return f.leadName.toLowerCase().includes(q) || f.notes.toLowerCase().includes(q) || f.assignedSales.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) return;

    const newFl: FollowupActivity = {
      id: `fl-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.buyerName,
      assignedSales,
      activityType,
      scheduledDate,
      status: 'Pending',
      notes
    };

    onAddFollowup(newFl);
    setIsModalOpen(false);
    setNotes('');
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName="Sales Follow-up Activities"
        parentName="Activities"
        parentPath="/activities/followups"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Follow-up</span>
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
              placeholder="Search lead name, notes, sales agent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
            >
              <option value="All">All Types</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Call">Phone Call</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Negotiation">Negotiation</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
              <tr>
                <th className="px-5 py-3.5">Lead Buyer</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-5 py-3.5">Activity Notes</th>
                <th className="px-4 py-3.5">Assigned Sales</th>
                <th className="px-4 py-3.5">Scheduled Date</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
              {filtered.map(fl => (
                <tr key={fl.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C] transition-colors">
                  <td className="px-5 py-3.5 font-bold text-[#1C2434] dark:text-white">
                    {fl.leadName}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-semibold text-[#3C50E0]">{fl.activityType}</span>
                  </td>
                  <td className="px-5 py-3.5 max-w-sm text-[#1C2434] dark:text-[#AEB7C0]">
                    {fl.notes}
                  </td>
                  <td className="px-4 py-3.5 font-medium whitespace-nowrap">
                    {fl.assignedSales}
                  </td>
                  <td className="px-4 py-3.5 text-[#64748B] dark:text-[#8A99AD] whitespace-nowrap">
                    {fl.scheduledDate}
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <Badge variant={fl.status === 'Completed' ? 'success' : 'warning'} size="sm">
                      {fl.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    {fl.status !== 'Completed' && (
                      <button
                        onClick={() => onUpdateStatus(fl.id, 'Completed')}
                        className="rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 px-2.5 py-1 text-[11px] font-semibold hover:bg-emerald-100"
                      >
                        Mark Done
                      </button>
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
        title="Schedule Follow-up Activity"
        subtitle="Log scheduled WhatsApp outreach, phone call, or price negotiation"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Select Lead *
            </label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
            >
              {leads.map(l => (
                <option key={l.id} value={l.id}>
                  {l.buyerName} — {l.interestedPropertyTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Activity Type
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as any)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Call">Call</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Negotiation">Negotiation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Assigned Sales
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
              Scheduled Date & Time
            </label>
            <input
              type="text"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              placeholder="2026-09-28 14:00"
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Follow-up Agenda / Notes *
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Rincian yang akan dibahas (misal: simulasi KPR, ketersediaan jadwal survei, respon tawar harga)..."
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
              Save Activity
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
