import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Target, 
  Coins, 
  Users, 
  Building2, 
  ArrowUpRight 
} from 'lucide-react';
import { Property, Lead, CommissionRecord, Campaign, SiteVisit, Booking, Closing } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';

interface AnalyticsViewProps {
  properties: Property[];
  leads: Lead[];
  commissions: CommissionRecord[];
  campaigns: Campaign[];
  siteVisits: SiteVisit[];
  bookings: Booking[];
  closings: Closing[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  properties,
  leads,
  commissions,
  campaigns,
  siteVisits,
  bookings,
  closings
}) => {
  const formatPrice = (val: number) => {
    if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)} M`;
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(0)} Jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  // Channel breakdown
  const channelCounts: { [ch: string]: number } = {};
  leads.forEach(l => {
    channelCounts[l.source] = (channelCounts[l.source] || 0) + 1;
  });

  // Location demand breakdown
  const locationCounts: { [loc: string]: number } = {};
  leads.forEach(l => {
    const loc = l.preferredLocation || 'Other';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  // Funnel calculations
  const totalLeads = leads.length || 1;
  const totalVisits = siteVisits.length;
  const totalBookings = bookings.length;
  const totalClosings = closings.length;

  const leadToVisitRate = ((totalVisits / totalLeads) * 100).toFixed(1);
  const visitToBookingRate = totalVisits > 0 ? ((totalBookings / totalVisits) * 100).toFixed(1) : '0.0';
  const bookingToClosingRate = totalBookings > 0 ? ((totalClosings / totalBookings) * 100).toFixed(1) : '0.0';

  const potentialComm = commissions.filter(c => c.paymentStatus === 'Potential').reduce((a, b) => a + b.earnedAmount, 0);
  const earnedComm = commissions.filter(c => c.paymentStatus !== 'Potential').reduce((a, b) => a + b.earnedAmount, 0);
  const paidComm = commissions.filter(c => c.paymentStatus === 'Paid').reduce((a, b) => a + b.earnedAmount, 0);

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName="Property Marketing & Sales Analytics"
        parentName="Analytics"
        parentPath="/analytics"
      />

      {/* TOP SUMMARY ROW: COMMISSIONS & SALES FUNNEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
          <span className="text-xs uppercase font-bold text-[#64748B] dark:text-[#8A99AD] block mb-1">
            Potential Commission Pipeline
          </span>
          <h3 className="text-2xl font-extrabold text-[#1C2434] dark:text-white">
            {formatPrice(potentialComm)}
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-1">Pending closing and PPJB sign-offs</p>
        </div>

        <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
          <span className="text-xs uppercase font-bold text-[#64748B] dark:text-[#8A99AD] block mb-1">
            Earned Commission
          </span>
          <h3 className="text-2xl font-extrabold text-[#3C50E0] dark:text-[#80CAEE]">
            {formatPrice(earnedComm)}
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-1">Total locked commission agreements</p>
        </div>

        <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
          <span className="text-xs uppercase font-bold text-[#64748B] dark:text-[#8A99AD] block mb-1">
            Disbursed / Paid Commission
          </span>
          <h3 className="text-2xl font-extrabold text-[#10B981]">
            {formatPrice(paidComm)}
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-1">Bank transfer received from owners</p>
        </div>
      </div>

      {/* SALES CONVERSION FUNNEL METRICS */}
      <div className="mb-6 rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
        <h3 className="font-bold text-sm text-[#1C2434] dark:text-white mb-1">
          End-to-End Sales Conversion Funnel
        </h3>
        <p className="text-xs text-[#64748B] dark:text-[#8A99AD] mb-4">
          Tracking conversion performance from inbound buyer lead to finalized closing
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] border border-[#E2E8F0] dark:border-[#2E3A47]">
            <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">1. Total Inbound Leads</span>
            <span className="text-2xl font-extrabold text-[#1C2434] dark:text-white mt-1 block">{totalLeads}</span>
            <span className="text-[10px] text-[#94A3B8]">100% Top of Funnel</span>
          </div>

          <div className="p-4 rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] border border-[#E2E8F0] dark:border-[#2E3A47]">
            <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">2. Site Visits Scheduled</span>
            <span className="text-2xl font-extrabold text-[#3C50E0] mt-1 block">{totalVisits}</span>
            <span className="text-[10px] font-bold text-[#3C50E0]">{leadToVisitRate}% Lead to Visit</span>
          </div>

          <div className="p-4 rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] border border-[#E2E8F0] dark:border-[#2E3A47]">
            <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">3. UTJ Bookings</span>
            <span className="text-2xl font-extrabold text-amber-500 mt-1 block">{totalBookings}</span>
            <span className="text-[10px] font-bold text-amber-500">{visitToBookingRate}% Visit to Booking</span>
          </div>

          <div className="p-4 rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] border border-[#E2E8F0] dark:border-[#2E3A47]">
            <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">4. Final Closings</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{totalClosings}</span>
            <span className="text-[10px] font-bold text-emerald-600">{bookingToClosingRate}% Booking to Close</span>
          </div>
        </div>
      </div>

      {/* MARKETING CHANNEL & DEMAND INSIGHTS (2 COLUMNS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leads per Inbound Channel */}
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
          <h3 className="font-bold text-sm text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47] mb-3">
            Leads per Marketing Channel
          </h3>
          <div className="space-y-3 text-xs">
            {Object.entries(channelCounts).map(([ch, count]) => {
              const pct = Math.round((count / leads.length) * 100);
              return (
                <div key={ch}>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-[#1C2434] dark:text-white">{ch}</span>
                    <span className="font-bold text-[#3C50E0]">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#3C50E0] h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Requested Buyer Locations */}
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
          <h3 className="font-bold text-sm text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47] mb-3">
            Buyer Demand: Preferred Locations
          </h3>
          <div className="space-y-3 text-xs">
            {Object.entries(locationCounts).map(([loc, count]) => {
              const pct = Math.round((count / leads.length) * 100);
              return (
                <div key={loc}>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-[#1C2434] dark:text-white">{loc}</span>
                    <span className="font-bold text-emerald-600">{count} buyers ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
