import React, { useState } from 'react';
import { 
  FileCheck2, 
  Plus, 
  Search, 
  Calendar, 
  Building2, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Filter
} from 'lucide-react';
import { Agreement, Property, Contact, AgreementStatus } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface AgreementsViewProps {
  agreements: Agreement[];
  properties: Property[];
  owners: Contact[];
  onAddAgreement: (agreement: Agreement) => void;
  onUpdateAgreementStatus: (id: string, status: AgreementStatus) => void;
  onSelectProperty?: (property: Property) => void;
}

export const AgreementsView: React.FC<AgreementsViewProps> = ({
  agreements,
  properties,
  owners,
  onAddAgreement,
  onUpdateAgreementStatus,
  onSelectProperty
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);

  // New Agreement Form state
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const [commType, setCommType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [commValue, setCommValue] = useState(2.5);
  const [agrDate, setAgrDate] = useState(new Date().toISOString().split('T')[0]);
  const [expDate, setExpDate] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [leadProtDays, setLeadProtDays] = useState(90);
  const [notes, setNotes] = useState('Perjanjian pemasaran eksklusif 3 bulan. Komisi dibayarkan saat akad tanda jadi/PPJB.');

  const filtered = agreements.filter(agr => {
    if (statusFilter !== 'All' && agr.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        agr.code.toLowerCase().includes(q) ||
        agr.propertyTitle.toLowerCase().includes(q) ||
        agr.ownerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === selectedPropId);
    if (!prop) return;

    const newAgreement: Agreement = {
      id: `agr-${Date.now()}`,
      code: `AGR-${new Date().getFullYear()}-${String(agreements.length + 1).padStart(3, '0')}`,
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyCode: prop.code,
      ownerId: prop.ownerId,
      ownerName: prop.ownerName,
      agreementDate: agrDate,
      expiryDate: expDate,
      commissionType: commType,
      commissionValue: Number(commValue),
      leadProtectionPeriodDays: Number(leadProtDays),
      notes,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddAgreement(newAgreement);
    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName="Marketing & Commission Agreements"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Agreement</span>
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
              placeholder="Search agreement code, property, owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Waiting Approval">Waiting Approval</option>
              <option value="Draft">Draft</option>
              <option value="Expired">Expired</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* AGREEMENTS TABLE */}
      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
              <tr>
                <th className="px-5 py-3.5">Agreement ID</th>
                <th className="px-4 py-3.5">Property</th>
                <th className="px-4 py-3.5">Owner</th>
                <th className="px-4 py-3.5">Agreement Date</th>
                <th className="px-4 py-3.5">Expiry Date</th>
                <th className="px-4 py-3.5">Commission</th>
                <th className="px-4 py-3.5">Lead Protection</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#64748B] dark:text-[#8A99AD]">
                    No agreements found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((agr) => (
                  <tr 
                    key={agr.id}
                    onClick={() => setSelectedAgreement(agr)}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-[#3C50E0] dark:text-[#80CAEE] whitespace-nowrap">
                      {agr.code}
                    </td>
                    <td className="px-4 py-3.5 max-w-[220px]">
                      <span className="font-semibold text-[#1C2434] dark:text-white line-clamp-1 block">
                        {agr.propertyTitle}
                      </span>
                      <span className="text-[10px] font-mono text-[#94A3B8]">
                        {agr.propertyCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-[#1C2434] dark:text-white">
                      {agr.ownerName}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-[#64748B] dark:text-[#8A99AD]">
                      {agr.agreementDate}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-[#64748B] dark:text-[#8A99AD]">
                      {agr.expiryDate}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-bold text-[#1C2434] dark:text-white">
                      {agr.commissionType === 'Percentage' ? `${agr.commissionValue}%` : `Rp ${Number(agr.commissionValue).toLocaleString('id-ID')}`}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-[#3C50E0]">
                      {agr.leadProtectionPeriodDays} Days
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <Badge variant={agr.status === 'Active' ? 'success' : agr.status === 'Waiting Approval' ? 'warning' : 'neutral'} size="sm">
                        {agr.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {agr.status === 'Waiting Approval' && (
                          <button
                            onClick={() => onUpdateAgreementStatus(agr.id, 'Active')}
                            className="rounded bg-emerald-50 text-emerald-600 px-2 py-1 text-[11px] font-semibold hover:bg-emerald-100"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedAgreement(agr)}
                          className="rounded border border-[#E2E8F0] dark:border-[#2E3A47] px-2.5 py-1 text-[11px] font-semibold text-[#1C2434] dark:text-white hover:border-[#3C50E0]"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedAgreement && (
        <Modal
          isOpen={!!selectedAgreement}
          onClose={() => setSelectedAgreement(null)}
          title={`Agreement: ${selectedAgreement.code}`}
          subtitle={`Property: ${selectedAgreement.propertyTitle}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8FAFC] dark:bg-[#1A222C] p-4 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47]">
              <div>
                <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Owner</span>
                <span className="font-bold text-[#1C2434] dark:text-white">{selectedAgreement.ownerName}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Commission</span>
                <span className="font-bold text-[#3C50E0]">{selectedAgreement.commissionValue}%</span>
              </div>
              <div>
                <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Valid Through</span>
                <span className="font-bold text-[#1C2434] dark:text-white">{selectedAgreement.expiryDate}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Status</span>
                <Badge variant={selectedAgreement.status === 'Active' ? 'success' : 'warning'}>
                  {selectedAgreement.status}
                </Badge>
              </div>
            </div>

            <div className="p-4 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] space-y-2">
              <h4 className="font-bold text-[#1C2434] dark:text-white">Contract Terms & Lead Protection:</h4>
              <p className="text-[#64748B] dark:text-[#8A99AD] leading-relaxed">
                {selectedAgreement.notes}
              </p>
              <div className="pt-2 text-[11px] text-[#94A3B8]">
                <strong>Lead Protection Clause:</strong> {selectedAgreement.leadProtectionPeriodDays} days after agreement termination or expiry.
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-[#2E3A47]">
              <span className="text-[11px] text-[#64748B]">Digital Record verified by Honey-an Compliance</span>
              <button
                onClick={() => setSelectedAgreement(null)}
                className="rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Marketing & Commission Agreement"
        subtitle="Lock commission terms, lead protection period, and marketing exclusivity"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Select Target Property *
            </label>
            <select
              required
              value={selectedPropId}
              onChange={(e) => setSelectedPropId(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.title} (Owner: {p.ownerName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Commission Type
              </label>
              <select
                value={commType}
                onChange={(e) => setCommType(e.target.value as any)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed">Fixed Amount (Rp)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Commission Value *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={commValue}
                onChange={(e) => setCommValue(Number(e.target.value))}
                placeholder={commType === 'Percentage' ? '2.5' : '50000000'}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Lead Protection (Days)
              </label>
              <input
                type="number"
                value={leadProtDays}
                onChange={(e) => setLeadProtDays(Number(e.target.value))}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Agreement Start Date
              </label>
              <input
                type="date"
                required
                value={agrDate}
                onChange={(e) => setAgrDate(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Expiry Date
              </label>
              <input
                type="date"
                required
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Special Terms & Exclusivity Clauses
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              Sign & Save Agreement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
