/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HoneyStorage } from './services/storage';
import { 
  Property, 
  Contact, 
  Agreement, 
  Lead, 
  FollowupActivity, 
  SiteVisit, 
  Booking, 
  Closing, 
  CommissionRecord, 
  PublishingRecord, 
  Campaign,
  MarketingContent,
  PipelineStage,
  LeadTemperature,
  AgreementStatus
} from './types';

// Layout components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { PropertyList } from './components/properties/PropertyList';
import { PropertyForm } from './components/properties/PropertyForm';
import { PropertyDetail } from './components/properties/PropertyDetail';
import { ContactsView } from './components/contacts/ContactsView';
import { AgreementsView } from './components/agreements/AgreementsView';
import { ContentStudio } from './components/marketing/ContentStudio';
import { PublishingView } from './components/marketing/PublishingView';
import { CampaignsView } from './components/marketing/CampaignsView';
import { AllLeadsView } from './components/leads/AllLeadsView';
import { LeadPipelineKanban } from './components/leads/LeadPipelineKanban';
import { BuyerRequirementsView } from './components/leads/BuyerRequirementsView';
import { LeadDetail } from './components/leads/LeadDetail';
import { FollowupsView } from './components/activities/FollowupsView';
import { SiteVisitsView } from './components/activities/SiteVisitsView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { Modal } from './components/common/Modal';

export default function App() {
  // Navigation & Routing state
  const [currentPath, setCurrentPath] = useState<string>('/dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return HoneyStorage.getTheme() === 'dark';
  });

  // Global search query
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent CRM Data State
  const [properties, setProperties] = useState<Property[]>(() => HoneyStorage.getProperties());
  const [contacts, setContacts] = useState<Contact[]>(() => HoneyStorage.getContacts());
  const [agreements, setAgreements] = useState<Agreement[]>(() => HoneyStorage.getAgreements());
  const [leads, setLeads] = useState<Lead[]>(() => HoneyStorage.getLeads());
  const [followups, setFollowups] = useState<FollowupActivity[]>(() => HoneyStorage.getFollowups());
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(() => HoneyStorage.getSiteVisits());
  const [bookings, setBookings] = useState<Booking[]>(() => HoneyStorage.getBookings());
  const [closings, setClosings] = useState<Closing[]>(() => HoneyStorage.getClosings());
  const [commissions, setCommissions] = useState<CommissionRecord[]>(() => HoneyStorage.getCommissions());
  const [publishing, setPublishing] = useState<PublishingRecord[]>(() => HoneyStorage.getPublishing());
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => HoneyStorage.getCampaigns());

  // Active selected entities for detail views
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Quick Schedule Visit Modal for Leads
  const [visitScheduleLead, setVisitScheduleLead] = useState<Lead | null>(null);
  const [quickVisitDate, setQuickVisitDate] = useState('2026-09-30 10:00');
  const [quickVisitPropId, setQuickVisitPropId] = useState('');

  // Sync dark mode class with DOM and storage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      HoneyStorage.saveTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      HoneyStorage.saveTheme('light');
    }
  }, [darkMode]);

  // Sync data updates to storage
  useEffect(() => {
    HoneyStorage.saveProperties(properties);
  }, [properties]);

  useEffect(() => {
    HoneyStorage.saveContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    HoneyStorage.saveAgreements(agreements);
  }, [agreements]);

  useEffect(() => {
    HoneyStorage.saveLeads(leads);
  }, [leads]);

  useEffect(() => {
    HoneyStorage.saveFollowups(followups);
  }, [followups]);

  useEffect(() => {
    HoneyStorage.saveSiteVisits(siteVisits);
  }, [siteVisits]);

  useEffect(() => {
    HoneyStorage.saveBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    HoneyStorage.saveClosings(closings);
  }, [closings]);

  useEffect(() => {
    HoneyStorage.saveCommissions(commissions);
  }, [commissions]);

  useEffect(() => {
    HoneyStorage.savePublishing(publishing);
  }, [publishing]);

  useEffect(() => {
    HoneyStorage.saveCampaigns(campaigns);
  }, [campaigns]);

  // Navigation handler
  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSidebarOpen(false);
  };

  // Property Handlers
  const handleSaveProperty = (prop: Property) => {
    setProperties(prev => {
      const idx = prev.findIndex(p => p.id === prop.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = prop;
        return copy;
      }
      return [prop, ...prev];
    });
    setSelectedProperty(prop);
    setEditingProperty(null);
    navigateTo(`/properties/${prop.id}`);
  };

  // Lead Handlers
  const handleAddLead = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
  };

  const handleUpdateLeadStage = (leadId: string, newStage: PipelineStage) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, pipelineStage: newStage } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, pipelineStage: newStage } : null);
    }
  };

  const handleUpdateLeadTemp = (leadId: string, newTemp: LeadTemperature) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, leadTemperature: newTemp } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, leadTemperature: newTemp } : null);
    }
  };

  // Agreement Handlers
  const handleAddAgreement = (newAgr: Agreement) => {
    setAgreements(prev => [newAgr, ...prev]);
    // Also update property agreement status
    setProperties(prev => prev.map(p => p.id === newAgr.propertyId ? { ...p, agreementStatus: 'Active' } : p));
  };

  const handleUpdateAgreementStatus = (id: string, status: AgreementStatus) => {
    setAgreements(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  // Content Publishing
  const handlePublishContent = (content: MarketingContent, channel: string) => {
    const newRecord: PublishingRecord = {
      id: `pub-${Date.now()}`,
      propertyId: content.propertyId,
      propertyTitle: content.propertyTitle,
      channel: channel as any,
      campaignName: 'Social Content Push',
      publishDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Published',
      leadsGenerated: 0,
      contentSnippet: content.headline
    };
    setPublishing(prev => [newRecord, ...prev]);
    // Also mark property status as Published
    setProperties(prev => prev.map(p => p.id === content.propertyId ? { ...p, listingStatus: 'Published' } : p));
    navigateTo('/marketing/publishing');
  };

  // Quick Site Visit Booker
  const handleQuickVisitConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitScheduleLead) return;
    const prop = properties.find(p => p.id === (quickVisitPropId || visitScheduleLead.interestedPropertyId)) || properties[0];

    const newVisit: SiteVisit = {
      id: `sv-${Date.now()}`,
      leadId: visitScheduleLead.id,
      buyerName: visitScheduleLead.buyerName,
      buyerPhone: visitScheduleLead.whatsapp,
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyAddress: prop.address || `${prop.district}, ${prop.city}`,
      schedule: quickVisitDate,
      sales: visitScheduleLead.assignedSales || 'Dimas Aditya',
      status: 'Confirmed',
      notes: 'Scheduled directly from Honey-an Lead Manager',
      buyerFeedback: ''
    };

    setSiteVisits(prev => [newVisit, ...prev]);
    // update lead pipeline stage to 'Site Visit'
    handleUpdateLeadStage(visitScheduleLead.id, 'Site Visit');
    setVisitScheduleLead(null);
  };

  // Render view router
  const renderCurrentView = () => {
    // 1. Dashboard
    if (currentPath === '/' || currentPath === '/dashboard') {
      return (
        <DashboardView
          properties={properties}
          leads={leads}
          commissions={commissions}
          siteVisits={siteVisits}
          onNavigate={navigateTo}
          onSelectLead={(l) => {
            setSelectedLead(l);
            navigateTo(`/leads/${l.id}`);
          }}
          onSelectProperty={(p) => {
            setSelectedProperty(p);
            navigateTo(`/properties/${p.id}`);
          }}
        />
      );
    }

    // 2. Properties
    if (currentPath === '/properties/create') {
      return (
        <PropertyForm
          initialData={editingProperty}
          owners={contacts.filter(c => c.type === 'Owner')}
          onSave={handleSaveProperty}
          onCancel={() => {
            setEditingProperty(null);
            navigateTo('/properties');
          }}
        />
      );
    }

    if (currentPath.startsWith('/properties/') && selectedProperty) {
      return (
        <PropertyDetail
          property={selectedProperty}
          owner={contacts.find(c => c.id === selectedProperty.ownerId)}
          agreements={agreements}
          leads={leads}
          siteVisits={siteVisits}
          onBack={() => navigateTo('/properties')}
          onEdit={(p) => {
            setEditingProperty(p);
            navigateTo('/properties/create');
          }}
          onGenerateContent={(p) => {
            setSelectedProperty(p);
            navigateTo(`/marketing/content?propertyId=${p.id}`);
          }}
          onSelectLead={(l) => {
            setSelectedLead(l);
            navigateTo(`/leads/${l.id}`);
          }}
        />
      );
    }

    if (currentPath.startsWith('/properties')) {
      const filter = currentPath.includes('filter=ready') ? 'ready' : currentPath.includes('filter=published') ? 'published' : undefined;
      return (
        <PropertyList
          properties={properties}
          initialFilter={filter}
          onSelectProperty={(p) => {
            setSelectedProperty(p);
            navigateTo(`/properties/${p.id}`);
          }}
          onNavigate={navigateTo}
        />
      );
    }

    // 3. Contacts
    if (currentPath === '/contacts/owners') {
      return (
        <ContactsView
          type="Owner"
          contacts={contacts}
          properties={properties}
          agreements={agreements}
          onAddContact={(c) => setContacts(prev => [c, ...prev])}
          onNavigate={navigateTo}
          onSelectProperty={(p) => {
            setSelectedProperty(p);
            navigateTo(`/properties/${p.id}`);
          }}
        />
      );
    }

    if (currentPath === '/contacts/agents') {
      return (
        <ContactsView
          type="Agent"
          contacts={contacts}
          properties={properties}
          agreements={agreements}
          onAddContact={(c) => setContacts(prev => [c, ...prev])}
          onNavigate={navigateTo}
          onSelectProperty={(p) => {
            setSelectedProperty(p);
            navigateTo(`/properties/${p.id}`);
          }}
        />
      );
    }

    // 4. Agreements
    if (currentPath === '/agreements') {
      return (
        <AgreementsView
          agreements={agreements}
          properties={properties}
          owners={contacts.filter(c => c.type === 'Owner')}
          onAddAgreement={handleAddAgreement}
          onUpdateAgreementStatus={handleUpdateAgreementStatus}
        />
      );
    }

    // 5. Marketing
    if (currentPath.startsWith('/marketing/content')) {
      return (
        <ContentStudio
          properties={properties}
          selectedPropertyId={selectedProperty?.id}
          onPublishContent={handlePublishContent}
        />
      );
    }

    if (currentPath === '/marketing/publishing') {
      return (
        <PublishingView
          records={publishing}
          properties={properties}
          onAddRecord={(r) => setPublishing(prev => [r, ...prev])}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath === '/marketing/campaigns') {
      return (
        <CampaignsView
          campaigns={campaigns}
          properties={properties}
          onAddCampaign={(c) => setCampaigns(prev => [c, ...prev])}
          onNavigate={navigateTo}
        />
      );
    }

    // 6. Leads
    if (currentPath.startsWith('/leads/') && selectedLead && currentPath !== '/leads/pipeline' && currentPath !== '/leads/requirements' && currentPath !== '/leads/my') {
      return (
        <LeadDetail
          lead={selectedLead}
          properties={properties}
          followups={followups}
          siteVisits={siteVisits}
          onBack={() => navigateTo('/leads')}
          onUpdateStage={handleUpdateLeadStage}
          onUpdateTemp={handleUpdateLeadTemp}
          onSelectProperty={(p) => {
            setSelectedProperty(p);
            navigateTo(`/properties/${p.id}`);
          }}
          onScheduleVisit={(l) => {
            setVisitScheduleLead(l);
            setQuickVisitPropId(l.interestedPropertyId);
          }}
        />
      );
    }

    if (currentPath === '/leads/pipeline') {
      return (
        <LeadPipelineKanban
          leads={leads}
          onSelectLead={(l) => {
            setSelectedLead(l);
            navigateTo(`/leads/${l.id}`);
          }}
          onUpdateLeadStage={handleUpdateLeadStage}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath === '/leads/requirements') {
      return (
        <BuyerRequirementsView
          leads={leads}
          properties={properties}
          onSelectLead={(l) => {
            setSelectedLead(l);
            navigateTo(`/leads/${l.id}`);
          }}
          onSelectProperty={(p) => {
            setSelectedProperty(p);
            navigateTo(`/properties/${p.id}`);
          }}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath === '/leads/my') {
      return (
        <AllLeadsView
          leads={leads}
          properties={properties}
          isMyLeads={true}
          currentSalesName="Dimas Aditya"
          onSelectLead={(l) => {
            setSelectedLead(l);
            navigateTo(`/leads/${l.id}`);
          }}
          onAddLead={handleAddLead}
          onUpdateLeadStage={handleUpdateLeadStage}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath === '/leads') {
      return (
        <AllLeadsView
          leads={leads}
          properties={properties}
          isMyLeads={false}
          onSelectLead={(l) => {
            setSelectedLead(l);
            navigateTo(`/leads/${l.id}`);
          }}
          onAddLead={handleAddLead}
          onUpdateLeadStage={handleUpdateLeadStage}
          onNavigate={navigateTo}
        />
      );
    }

    // 7. Activities
    if (currentPath === '/activities/followups') {
      return (
        <FollowupsView
          followups={followups}
          leads={leads}
          onAddFollowup={(fl) => setFollowups(prev => [fl, ...prev])}
          onUpdateStatus={(id, st) => setFollowups(prev => prev.map(f => f.id === id ? { ...f, status: st } : f))}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath === '/activities/site-visits') {
      return (
        <SiteVisitsView
          siteVisits={siteVisits}
          leads={leads}
          properties={properties}
          onAddSiteVisit={(v) => setSiteVisits(prev => [v, ...prev])}
          onUpdateSiteVisit={(v) => setSiteVisits(prev => prev.map(item => item.id === v.id ? v : item))}
          onNavigate={navigateTo}
        />
      );
    }

    // 8. Transactions
    if (currentPath === '/transactions/bookings') {
      return (
        <TransactionsView
          viewType="bookings"
          bookings={bookings}
          closings={closings}
          commissions={commissions}
          properties={properties}
          leads={leads}
          onAddBooking={(b) => setBookings(prev => [b, ...prev])}
          onAddClosing={(c) => setClosings(prev => [c, ...prev])}
          onUpdateCommissionStatus={(id, st) => setCommissions(prev => prev.map(c => c.id === id ? { ...c, paymentStatus: st } : c))}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath === '/transactions/closings') {
      return (
        <TransactionsView
          viewType="closings"
          bookings={bookings}
          closings={closings}
          commissions={commissions}
          properties={properties}
          leads={leads}
          onAddBooking={(b) => setBookings(prev => [b, ...prev])}
          onAddClosing={(c) => {
            setClosings(prev => [c, ...prev]);
            // Also generate commission record
            const newComm: CommissionRecord = {
              id: `com-${Date.now()}`,
              propertyId: c.propertyId,
              propertyTitle: c.propertyTitle,
              ownerName: 'Owner',
              buyerName: c.buyerName,
              sellingPrice: c.finalSellingPrice,
              commissionType: 'Percentage',
              commissionValue: 2.5,
              earnedAmount: c.commission,
              earnedDate: c.closingDate,
              paymentStatus: 'Earned'
            };
            setCommissions(prev => [newComm, ...prev]);
          }}
          onUpdateCommissionStatus={(id, st) => setCommissions(prev => prev.map(c => c.id === id ? { ...c, paymentStatus: st } : c))}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath === '/transactions/commissions') {
      return (
        <TransactionsView
          viewType="commissions"
          bookings={bookings}
          closings={closings}
          commissions={commissions}
          properties={properties}
          leads={leads}
          onAddBooking={(b) => setBookings(prev => [b, ...prev])}
          onAddClosing={(c) => setClosings(prev => [c, ...prev])}
          onUpdateCommissionStatus={(id, st) => setCommissions(prev => prev.map(c => c.id === id ? { ...c, paymentStatus: st } : c))}
          onNavigate={navigateTo}
        />
      );
    }

    // 9. Analytics
    if (currentPath === '/analytics') {
      return (
        <AnalyticsView
          properties={properties}
          leads={leads}
          commissions={commissions}
          campaigns={campaigns}
          siteVisits={siteVisits}
          bookings={bookings}
          closings={closings}
        />
      );
    }

    // 10. Settings
    if (currentPath.startsWith('/settings')) {
      const tab = currentPath.includes('tab=users') ? 'users' : currentPath.includes('tab=roles') ? 'roles' : currentPath.includes('tab=publishing') ? 'publishing' : currentPath.includes('tab=ai') ? 'ai' : 'org';
      return <SettingsView initialTab={tab} />;
    }

    // Default: Dashboard
    return (
      <DashboardView
        properties={properties}
        leads={leads}
        commissions={commissions}
        siteVisits={siteVisits}
        onNavigate={navigateTo}
        onSelectLead={(l) => {
          setSelectedLead(l);
          navigateTo(`/leads/${l.id}`);
        }}
        onSelectProperty={(p) => {
          setSelectedProperty(p);
          navigateTo(`/properties/${p.id}`);
        }}
      />
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9] dark:bg-[#1A222C]">
      {/* TailAdmin Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPath={currentPath}
        onNavigate={navigateTo}
      />

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* TailAdmin Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onNavigate={navigateTo}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic Page Views */}
        <main className="grow">
          {renderCurrentView()}
        </main>
      </div>

      {/* QUICK SITE VISIT MODAL (ACCESSIBLE ACROSS LEAD PAGES) */}
      {visitScheduleLead && (
        <Modal
          isOpen={!!visitScheduleLead}
          onClose={() => setVisitScheduleLead(null)}
          title={`Schedule Site Visit for ${visitScheduleLead.buyerName}`}
          subtitle={`WhatsApp: +${visitScheduleLead.whatsapp}`}
          maxWidth="md"
        >
          <form onSubmit={handleQuickVisitConfirm} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Target Property
              </label>
              <select
                value={quickVisitPropId || visitScheduleLead.interestedPropertyId}
                onChange={(e) => setQuickVisitPropId(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Visit Schedule Date & Time *
              </label>
              <input
                type="text"
                required
                value={quickVisitDate}
                onChange={(e) => setQuickVisitDate(e.target.value)}
                placeholder="2026-09-30 10:00"
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0] dark:border-[#2E3A47]">
              <button
                type="button"
                onClick={() => setVisitScheduleLead(null)}
                className="rounded-sm border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] dark:border-[#2E3A47] dark:text-[#8A99AD]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90"
              >
                Confirm & Advance to Site Visit
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
