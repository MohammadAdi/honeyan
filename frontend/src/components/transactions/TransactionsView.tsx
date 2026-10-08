import React, { useState } from 'react';
import { 
  CircleDollarSign, 
  Plus, 
  Search, 
  Building2, 
  User, 
  Calendar, 
  Coins, 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  Receipt,
  Download
} from 'lucide-react';
import { Booking, Closing, CommissionRecord, Property, Lead } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface TransactionsViewProps {
  viewType: 'bookings' | 'closings' | 'commissions';
  bookings: Booking[];
  closings: Closing[];
  commissions: CommissionRecord[];
  properties: Property[];
  leads: Lead[];
  onAddBooking: (b: Booking) => void;
  onAddClosing: (c: Closing) => void;
  onUpdateCommissionStatus: (id: string, status: CommissionRecord['paymentStatus']) => void;
  onNavigate: (path: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  viewType,
  bookings,
  closings,
  commissions,
  properties,
  leads,
  onAddBooking,
  onAddClosing,
  onUpdateCommissionStatus,
  onNavigate
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Booking State
  const [bookingBuyerName, setBookingBuyerName] = useState(leads[0]?.buyerName || '');
  const [bookingPropId, setBookingPropId] = useState(properties[0]?.id || '');
  const [bookingAmount, setBookingAmount] = useState(25000000);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);

  // New Closing State
  const [closingPropId, setClosingPropId] = useState(properties[0]?.id || '');
  const [closingBuyerName, setClosingBuyerName] = useState(leads[0]?.buyerName || '');
  const [finalPrice, setFinalPrice] = useState(properties[0]?.askingPrice || 850000000);
  const [closingDate, setClosingDate] = useState(new Date().toISOString().split('T')[0]);
  const [closingStatus, setClosingStatus] = useState<Closing['status']>('PPJB Signed');

  const formatPrice = (val: number) => `Rp ${Number(val).toLocaleString('id-ID')}`;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === bookingPropId);
    if (!prop) return;

    const newBk: Booking = {
      id: `bk-${Date.now()}`,
      leadId: `lead-${Date.now()}`,
      buyerName: bookingBuyerName,
      propertyId: prop.id,
      propertyTitle: prop.title,
      bookingDate,
      bookingAmount: Number(bookingAmount),
      status: 'Active',
      receiptNumber: `RCP-HN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    };

    onAddBooking(newBk);
    setIsModalOpen(false);
  };

  const handleClosingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === closingPropId);
    if (!prop) return;

    const comm = Math.round(Number(finalPrice) * 0.025);

    const newCls: Closing = {
      id: `cls-${Date.now()}`,
      propertyId: prop.id,
      propertyTitle: prop.title,
      leadId: `lead-${Date.now()}`,
      buyerName: closingBuyerName,
      askingPrice: prop.askingPrice,
      finalSellingPrice: Number(finalPrice),
      closingDate,
      commission: comm,
      status: closingStatus
    };

    onAddClosing(newCls);
    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName={
          viewType === 'bookings' 
            ? "Property Bookings (UTJ)" 
            : viewType === 'closings' 
            ? "Closings & Notary Deals" 
            : "Commission Tracking & Ledgers"
        }
        parentName="Transactions"
        parentPath={`/transactions/${viewType}`}
        actions={
          viewType !== 'commissions' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{viewType === 'bookings' ? 'Record Booking (UTJ)' : 'Record Closing'}</span>
            </button>
          )
        }
      />

      {/* QUICK SUBMENU TABS */}
      <div className="mb-6 flex border-b border-[#E2E8F0] dark:border-[#2E3A47]">
        <button
          onClick={() => onNavigate('/transactions/bookings')}
          className={`py-3 px-5 text-xs font-semibold border-b-2 transition-colors ${
            viewType === 'bookings'
              ? 'border-[#3C50E0] text-[#3C50E0] dark:text-[#80CAEE] bg-[#3C50E0]/5'
              : 'border-transparent text-[#64748B] hover:text-[#1C2434] dark:text-[#8A99AD] dark:hover:text-white'
          }`}
        >
          Bookings (UTJ)
        </button>
        <button
          onClick={() => onNavigate('/transactions/closings')}
          className={`py-3 px-5 text-xs font-semibold border-b-2 transition-colors ${
            viewType === 'closings'
              ? 'border-[#3C50E0] text-[#3C50E0] dark:text-[#80CAEE] bg-[#3C50E0]/5'
              : 'border-transparent text-[#64748B] hover:text-[#1C2434] dark:text-[#8A99AD] dark:hover:text-white'
          }`}
        >
          Closings & Notary
        </button>
        <button
          onClick={() => onNavigate('/transactions/commissions')}
          className={`py-3 px-5 text-xs font-semibold border-b-2 transition-colors ${
            viewType === 'commissions'
              ? 'border-[#3C50E0] text-[#3C50E0] dark:text-[#80CAEE] bg-[#3C50E0]/5'
              : 'border-transparent text-[#64748B] hover:text-[#1C2434] dark:text-[#8A99AD] dark:hover:text-white'
          }`}
        >
          Commissions Ledger
        </button>
      </div>

      {/* VIEW: BOOKINGS */}
      {viewType === 'bookings' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
                <tr>
                  <th className="px-5 py-3.5">Receipt #</th>
                  <th className="px-4 py-3.5">Buyer</th>
                  <th className="px-5 py-3.5">Booked Property</th>
                  <th className="px-4 py-3.5">Booking Date</th>
                  <th className="px-4 py-3.5">UTJ Amount</th>
                  <th className="px-3 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C]">
                    <td className="px-5 py-3.5 font-mono font-bold text-[#3C50E0]">
                      {b.receiptNumber}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#1C2434] dark:text-white">
                      {b.buyerName}
                    </td>
                    <td className="px-5 py-3.5 max-w-xs font-semibold text-[#1C2434] dark:text-white truncate">
                      {b.propertyTitle}
                    </td>
                    <td className="px-4 py-3.5 text-[#64748B] dark:text-[#8A99AD]">
                      {b.bookingDate}
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-emerald-600">
                      {formatPrice(b.bookingAmount)}
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge variant="success" size="sm">{b.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: CLOSINGS */}
      {viewType === 'closings' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
                <tr>
                  <th className="px-5 py-3.5">Property</th>
                  <th className="px-4 py-3.5">Buyer</th>
                  <th className="px-4 py-3.5">Asking Price</th>
                  <th className="px-4 py-3.5">Final Selling Price</th>
                  <th className="px-4 py-3.5">Closing Date</th>
                  <th className="px-4 py-3.5">Commission Earned</th>
                  <th className="px-3 py-3.5">Legal Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
                {closings.map(c => (
                  <tr key={c.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C]">
                    <td className="px-5 py-3.5 font-bold text-[#1C2434] dark:text-white max-w-xs truncate">
                      {c.propertyTitle}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#1C2434] dark:text-white">
                      {c.buyerName}
                    </td>
                    <td className="px-4 py-3.5 text-[#64748B] dark:text-[#8A99AD]">
                      {formatPrice(c.askingPrice)}
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-[#1C2434] dark:text-white">
                      {formatPrice(c.finalSellingPrice)}
                    </td>
                    <td className="px-4 py-3.5 text-[#64748B] dark:text-[#8A99AD]">
                      {c.closingDate}
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-[#3C50E0] dark:text-[#80CAEE]">
                      {formatPrice(c.commission)}
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge variant="primary" size="sm">{c.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: COMMISSIONS */}
      {viewType === 'commissions' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
                <tr>
                  <th className="px-5 py-3.5">Property</th>
                  <th className="px-4 py-3.5">Owner</th>
                  <th className="px-4 py-3.5">Buyer</th>
                  <th className="px-4 py-3.5">Selling Price</th>
                  <th className="px-3 py-3.5">Type & Rate</th>
                  <th className="px-4 py-3.5">Commission Value</th>
                  <th className="px-4 py-3.5">Earned Date</th>
                  <th className="px-3 py-3.5">Payment Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
                {commissions.map(com => (
                  <tr key={com.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C]">
                    <td className="px-5 py-3.5 font-bold text-[#1C2434] dark:text-white max-w-xs truncate">
                      {com.propertyTitle}
                      {com.invoiceNumber && (
                        <span className="block text-[10px] font-mono text-[#94A3B8]">
                          {com.invoiceNumber}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-[#64748B] dark:text-[#8A99AD]">
                      {com.ownerName}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#1C2434] dark:text-white">
                      {com.buyerName}
                    </td>
                    <td className="px-4 py-3.5 font-bold">
                      {formatPrice(com.sellingPrice)}
                    </td>
                    <td className="px-3 py-3.5">
                      {com.commissionType} ({com.commissionValue}%)
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-[#3C50E0] dark:text-[#80CAEE]">
                      {formatPrice(com.earnedAmount)}
                    </td>
                    <td className="px-4 py-3.5 text-[#64748B] dark:text-[#8A99AD]">
                      {com.earnedDate}
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge 
                        variant={com.paymentStatus === 'Paid' ? 'success' : com.paymentStatus === 'Invoiced' ? 'warning' : com.paymentStatus === 'Earned' ? 'primary' : 'neutral'}
                        size="sm"
                      >
                        {com.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {com.paymentStatus !== 'Paid' && (
                        <button
                          onClick={() => onUpdateCommissionStatus(com.id, 'Paid')}
                          className="rounded bg-emerald-50 text-emerald-600 px-2.5 py-1 text-[11px] font-semibold hover:bg-emerald-100"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE BOOKING MODAL */}
      {viewType === 'bookings' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Record Buyer UTJ (Uang Tanda Jadi) Booking"
          subtitle="Lock property from other buyers and record down payment receipt"
          maxWidth="md"
        >
          <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Buyer Name *
              </label>
              <input
                type="text"
                required
                value={bookingBuyerName}
                onChange={(e) => setBookingBuyerName(e.target.value)}
                placeholder="e.g. H. Surya Pratama"
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Target Property *
              </label>
              <select
                value={bookingPropId}
                onChange={(e) => setBookingPropId(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
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
                  UTJ Booking Amount (Rp) *
                </label>
                <input
                  type="number"
                  required
                  value={bookingAmount}
                  onChange={(e) => setBookingAmount(Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Booking Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>
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
                Confirm Booking
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CREATE CLOSING MODAL */}
      {viewType === 'closings' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Record Deal Closing & Notary PPJB / AJB"
          subtitle="Record final negotiated deal price and lock Honey-an broker commission"
          maxWidth="md"
        >
          <form onSubmit={handleClosingSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Target Property *
              </label>
              <select
                value={closingPropId}
                onChange={(e) => setClosingPropId(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.title} (Asking: Rp {Number(p.askingPrice).toLocaleString('id-ID')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Buyer Name *
              </label>
              <input
                type="text"
                required
                value={closingBuyerName}
                onChange={(e) => setClosingBuyerName(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Final Deal Price (Rp) *
                </label>
                <input
                  type="number"
                  required
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Closing Date
                </label>
                <input
                  type="date"
                  required
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Legal Status
              </label>
              <select
                value={closingStatus}
                onChange={(e) => setClosingStatus(e.target.value as any)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              >
                <option value="PPJB Signed">PPJB Signed (Pengikatan Jual Beli)</option>
                <option value="Pending Notary">Pending Notary Review</option>
                <option value="AJB Signed">AJB Signed (Akta Jual Beli)</option>
                <option value="Closed Won">Closed Won (Deal Complete)</option>
              </select>
            </div>

            <div className="p-3 bg-[#EFF2F7] dark:bg-[#1E293B] rounded text-xs flex justify-between items-center">
              <span>Calculated 2.5% Commission:</span>
              <strong className="text-base text-[#3C50E0]">
                {formatPrice(Math.round(Number(finalPrice) * 0.025))}
              </strong>
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
                Lock Closing
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
