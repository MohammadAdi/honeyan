import React, { useState } from 'react';
import { 
  Kanban, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Building2, 
  MessageCircle, 
  User, 
  DollarSign,
  MapPin,
  Clock
} from 'lucide-react';
import { Lead, PipelineStage } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Badge, getLeadTemperatureBadge } from '../common/Badge';

interface LeadPipelineKanbanProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateLeadStage: (leadId: string, newStage: PipelineStage) => void;
  onNavigate: (path: string) => void;
}

export const LeadPipelineKanban: React.FC<LeadPipelineKanbanProps> = ({
  leads,
  onSelectLead,
  onUpdateLeadStage,
  onNavigate
}) => {
  const stages: { stage: PipelineStage; label: string; headerColor: string }[] = [
    { stage: 'New', label: 'New Inbound', headerColor: 'border-slate-400 text-slate-700 dark:text-slate-300' },
    { stage: 'Contacted', label: 'Contacted', headerColor: 'border-blue-400 text-blue-600 dark:text-blue-400' },
    { stage: 'Qualified', label: 'Qualified', headerColor: 'border-indigo-500 text-indigo-600 dark:text-indigo-400' },
    { stage: 'Property Suggested', label: 'Property Suggested', headerColor: 'border-cyan-500 text-cyan-600 dark:text-cyan-400' },
    { stage: 'Site Visit', label: 'Site Visit Scheduled', headerColor: 'border-amber-500 text-amber-600 dark:text-amber-400' },
    { stage: 'Negotiation', label: 'Negotiation & Offer', headerColor: 'border-orange-500 text-orange-600 dark:text-orange-400' },
    { stage: 'Booking', label: 'UTJ / Booking', headerColor: 'border-purple-600 text-purple-600 dark:text-purple-400' },
    { stage: 'Closed Won', label: 'Closed Won (Deal)', headerColor: 'border-emerald-500 text-emerald-600 dark:text-emerald-400' },
    { stage: 'Closed Lost', label: 'Closed Lost', headerColor: 'border-rose-400 text-rose-500 dark:text-rose-400' }
  ];

  const formatPrice = (val: number) => {
    if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)} M`;
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(0)} Jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const moveStage = (leadId: string, currentStage: PipelineStage, direction: 'prev' | 'next') => {
    const stageOrder: PipelineStage[] = [
      'New',
      'Contacted',
      'Qualified',
      'Property Suggested',
      'Site Visit',
      'Negotiation',
      'Booking',
      'Closed Won',
      'Closed Lost'
    ];
    const currentIndex = stageOrder.indexOf(currentStage);
    if (direction === 'prev' && currentIndex > 0) {
      onUpdateLeadStage(leadId, stageOrder[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < stageOrder.length - 1) {
      onUpdateLeadStage(leadId, stageOrder[currentIndex + 1]);
    }
  };

  return (
    <div className="mx-auto max-w-full p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName="Lead Pipeline Kanban"
        parentName="Leads"
        parentPath="/leads"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/leads/requirements')}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#E2E8F0] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1C2434] hover:bg-[#F1F5F9] dark:border-[#2E3A47] dark:bg-[#24303F] dark:text-white"
            >
              <span>Buyer Requirements</span>
            </button>
            <button
              onClick={() => onNavigate('/leads')}
              className="inline-flex items-center gap-1.5 rounded-sm bg-[#3C50E0] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-opacity-90"
            >
              <span>Table View</span>
            </button>
          </div>
        }
      />

      {/* KANBAN HORIZONTAL BOARD */}
      <div className="flex gap-4 overflow-x-auto pb-6 items-start min-h-[calc(100vh-220px)]">
        {stages.map(({ stage, label, headerColor }) => {
          const stageLeads = leads.filter(l => l.pipelineStage === stage);

          return (
            <div
              key={stage}
              className="w-72 shrink-0 rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] dark:border-[#2E3A47] dark:bg-[#1A222C] flex flex-col max-h-[85vh] shadow-xs"
            >
              {/* Column Header */}
              <div className={`p-3 border-b-2 bg-white dark:bg-[#24303F] flex items-center justify-between ${headerColor}`}>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs">{label}</span>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {stageLeads.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-2 space-y-2.5 overflow-y-auto grow">
                {stageLeads.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-[#94A3B8]">
                    No leads in this stage
                  </div>
                ) : (
                  stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="group cursor-pointer rounded-sm border border-[#E2E8F0] bg-white p-3.5 shadow-xs hover:border-[#3C50E0] dark:border-[#2E3A47] dark:bg-[#24303F] transition-all text-xs"
                    >
                      {/* Top Bar: Temp & Sales */}
                      <div className="flex items-center justify-between mb-2">
                        {getLeadTemperatureBadge(lead.leadTemperature)}
                        <span className="text-[10px] text-[#64748B] dark:text-[#8A99AD] font-medium">
                          {lead.assignedSales}
                        </span>
                      </div>

                      {/* Buyer Name & WhatsApp */}
                      <h4 className="font-bold text-sm text-[#1C2434] dark:text-white group-hover:text-[#3C50E0] transition-colors">
                        {lead.buyerName}
                      </h4>

                      {/* Budget */}
                      <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#3C50E0] dark:text-[#80CAEE]">
                        <span>Budget: {formatPrice(lead.minBudget)} - {formatPrice(lead.maxBudget)}</span>
                      </div>

                      {/* Area & Property */}
                      <div className="mt-1.5 text-[11px] text-[#64748B] dark:text-[#8A99AD] space-y-0.5">
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 shrink-0 text-[#94A3B8]" />
                          <span>Pref: {lead.preferredLocation} ({lead.propertyType})</span>
                        </div>
                        <div className="flex items-center gap-1 truncate">
                          <Building2 className="w-3 h-3 shrink-0 text-[#94A3B8]" />
                          <span className="truncate">{lead.interestedPropertyTitle}</span>
                        </div>
                      </div>

                      {/* Footer Actions: Move Prev/Next */}
                      <div className="mt-3 pt-2 border-t border-[#E2E8F0] dark:border-[#2E3A47] flex items-center justify-between" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => moveStage(lead.id, lead.pipelineStage, 'prev')}
                          title="Move to previous stage"
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[#64748B] hover:text-[#1C2434]"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <a
                          href={`https://wa.me/${lead.whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:underline"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WA</span>
                        </a>

                        <button
                          onClick={() => moveStage(lead.id, lead.pipelineStage, 'next')}
                          title="Move to next stage"
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[#64748B] hover:text-[#3C50E0]"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
