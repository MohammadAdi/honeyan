import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileCheck2, 
  Share2, 
  UserCheck, 
  CalendarClock, 
  CircleDollarSign, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  Plus, 
  CheckCircle, 
  Send, 
  Sparkles, 
  Target, 
  Compass, 
  Kanban,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  currentPath,
  onNavigate
}) => {
  // Submenu open states
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    properties: currentPath.startsWith('/properties'),
    contacts: currentPath.startsWith('/contacts'),
    marketing: currentPath.startsWith('/marketing'),
    leads: currentPath.startsWith('/leads'),
    activities: currentPath.startsWith('/activities'),
    transactions: currentPath.startsWith('/transactions'),
    settings: currentPath.startsWith('/settings')
  });

  const toggleMenu = (key: string) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isLinkActive = (path: string) => {
    if (path === '/dashboard' && (currentPath === '/' || currentPath === '/dashboard')) return true;
    return currentPath === path;
  };

  return (
    <aside
      className={`absolute left-0 top-0 z-50 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#1C2434] duration-300 ease-linear dark:bg-[#1C2434] lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 border-b border-[#2E3A47]">
        <div 
          onClick={() => onNavigate('/dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#3C50E0] text-white shadow-md">
            <Building2 className="w-6 h-6 group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Honey-an
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#3C50E0]/30 text-[#80CAEE] border border-[#3C50E0]/50">
                CRM
              </span>
            </h1>
            <p className="text-[10px] font-medium text-[#8A99AD] tracking-wider uppercase">
              Property Marketing Platform
            </p>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          className="block lg:hidden text-[#8A99AD] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-4 px-4 py-2 lg:px-5">
          {/* Section: Main */}
          <div>
            <h3 className="mb-2 ml-3 text-[11px] font-bold uppercase text-[#8A99AD] tracking-wider">
              Overview
            </h3>
            <ul className="mb-4 flex flex-col gap-1">
              <li>
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className={`group relative flex w-full items-center gap-3 rounded-sm py-2 px-3.5 text-xs font-semibold text-[#DEE4EE] duration-200 ease-in-out hover:bg-[#333A48] ${
                    isLinkActive('/dashboard') ? 'bg-[#333A48] text-white !font-bold' : ''
                  }`}
                >
                  <LayoutDashboard className={`w-4 h-4 ${isLinkActive('/dashboard') ? 'text-[#3C50E0]' : 'text-[#8A99AD]'}`} />
                  <span>Dashboard</span>
                  {isLinkActive('/dashboard') && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#3C50E0]"></span>
                  )}
                </button>
              </li>
            </ul>
          </div>

          {/* Section: Real Estate Marketing Management */}
          <div>
            <h3 className="mb-2 ml-3 text-[11px] font-bold uppercase text-[#8A99AD] tracking-wider">
              Inventory & Marketing
            </h3>
            <ul className="mb-4 flex flex-col gap-1">
              {/* Properties Menu */}
              <li>
                <button
                  onClick={() => toggleMenu('properties')}
                  className={`group relative flex w-full items-center justify-between rounded-sm py-2 px-3.5 text-xs font-semibold text-[#DEE4EE] duration-200 ease-in-out hover:bg-[#333A48] ${
                    currentPath.startsWith('/properties') ? 'bg-[#333A48]/60 text-white' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-[#8A99AD]" />
                    <span>Properties</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8A99AD] transition-transform duration-200 ${openMenus.properties ? 'rotate-180' : ''}`} />
                </button>
                {openMenus.properties && (
                  <ul className="mt-1 flex flex-col gap-1 pl-7">
                    <li>
                      <button
                        onClick={() => onNavigate('/properties')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/properties' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>All Properties</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/properties/create')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/properties/create' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <Plus className="w-3 h-3 text-[#3C50E0]" />
                        <span>Add Property</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/properties?filter=ready')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/properties?filter=ready' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>Ready to Market</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/properties?filter=published')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/properties?filter=published' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <Send className="w-3 h-3 text-sky-400" />
                        <span>Published</span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              {/* Contacts Menu */}
              <li>
                <button
                  onClick={() => toggleMenu('contacts')}
                  className={`group relative flex w-full items-center justify-between rounded-sm py-2 px-3.5 text-xs font-semibold text-[#DEE4EE] duration-200 ease-in-out hover:bg-[#333A48] ${
                    currentPath.startsWith('/contacts') ? 'bg-[#333A48]/60 text-white' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-[#8A99AD]" />
                    <span>Contacts</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8A99AD] transition-transform duration-200 ${openMenus.contacts ? 'rotate-180' : ''}`} />
                </button>
                {openMenus.contacts && (
                  <ul className="mt-1 flex flex-col gap-1 pl-7">
                    <li>
                      <button
                        onClick={() => onNavigate('/contacts/owners')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/contacts/owners' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>Owners</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/contacts/agents')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/contacts/agents' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>Agents</span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              {/* Agreements Menu */}
              <li>
                <button
                  onClick={() => onNavigate('/agreements')}
                  className={`group relative flex w-full items-center gap-3 rounded-sm py-2 px-3.5 text-xs font-semibold text-[#DEE4EE] duration-200 ease-in-out hover:bg-[#333A48] ${
                    isLinkActive('/agreements') ? 'bg-[#333A48] text-white !font-bold' : ''
                  }`}
                >
                  <FileCheck2 className={`w-4 h-4 ${isLinkActive('/agreements') ? 'text-[#3C50E0]' : 'text-[#8A99AD]'}`} />
                  <span>Agreements</span>
                </button>
              </li>

              {/* Marketing Menu */}
              <li>
                <button
                  onClick={() => toggleMenu('marketing')}
                  className={`group relative flex w-full items-center justify-between rounded-sm py-2 px-3.5 text-xs font-semibold text-[#DEE4EE] duration-200 ease-in-out hover:bg-[#333A48] ${
                    currentPath.startsWith('/marketing') ? 'bg-[#333A48]/60 text-white' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Share2 className="w-4 h-4 text-[#8A99AD]" />
                    <span>Marketing</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8A99AD] transition-transform duration-200 ${openMenus.marketing ? 'rotate-180' : ''}`} />
                </button>
                {openMenus.marketing && (
                  <ul className="mt-1 flex flex-col gap-1 pl-7">
                    <li>
                      <button
                        onClick={() => onNavigate('/marketing/content')}
                        className={`flex w-full items-center justify-between rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/marketing/content' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          Content Studio
                        </span>
                        <span className="text-[10px] bg-[#3C50E0]/20 text-[#80CAEE] px-1 py-0.5 rounded">AI</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/marketing/publishing')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/marketing/publishing' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>Publishing</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/marketing/campaigns')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/marketing/campaigns' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>Campaigns</span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>

          {/* Section: Leads & Conversion */}
          <div>
            <h3 className="mb-2 ml-3 text-[11px] font-bold uppercase text-[#8A99AD] tracking-wider">
              Lead Conversion
            </h3>
            <ul className="mb-4 flex flex-col gap-1">
              {/* Leads Menu */}
              <li>
                <button
                  onClick={() => toggleMenu('leads')}
                  className={`group relative flex w-full items-center justify-between rounded-sm py-2 px-3.5 text-xs font-semibold text-[#DEE4EE] duration-200 ease-in-out hover:bg-[#333A48] ${
                    currentPath.startsWith('/leads') ? 'bg-[#333A48]/60 text-white' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-[#8A99AD]" />
                    <span>Leads</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8A99AD] transition-transform duration-200 ${openMenus.leads ? 'rotate-180' : ''}`} />
                </button>
                {openMenus.leads && (
                  <ul className="mt-1 flex flex-col gap-1 pl-7">
                    <li>
                      <button
                        onClick={() => onNavigate('/leads')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/leads' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>All Leads</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/leads/my')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/leads/my' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>My Leads</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/leads/pipeline')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/leads/pipeline' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <Kanban className="w-3 h-3 text-[#3C50E0]" />
                        <span>Pipeline Kanban</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/leads/requirements')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/leads/requirements' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <Compass className="w-3 h-3 text-emerald-400" />
                        <span>Buyer Requirements</span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              {/* Activities Menu */}
              <li>
                <button
                  onClick={() => toggleMenu('activities')}
                  className={`group relative flex w-full items-center justify-between rounded-sm py-2 px-3.5 text-xs font-semibold text-[#DEE4EE] duration-200 ease-in-out hover:bg-[#333A48] ${
                    currentPath.startsWith('/activities') ? 'bg-[#333A48]/60 text-white' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CalendarClock className="w-4 h-4 text-[#8A99AD]" />
                    <span>Activities</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8A99AD] transition-transform duration-200 ${openMenus.activities ? 'rotate-180' : ''}`} />
                </button>
                {openMenus.activities && (
                  <ul className="mt-1 flex flex-col gap-1 pl-7">
                    <li>
                      <button
                        onClick={() => onNavigate('/activities/followups')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/activities/followups' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>Follow-ups</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/activities/site-visits')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/activities/site-visits' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>Site Visits</span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              {/* Transactions Menu */}
              <li>
                <button
                  onClick={() => toggleMenu('transactions')}
                  className={`group relative flex w-full items-center justify-between rounded-sm py-2 px-3.5 text-xs font-semibold text-[#DEE4EE] duration-200 ease-in-out hover:bg-[#333A48] ${
                    currentPath.startsWith('/transactions') ? 'bg-[#333A48]/60 text-white' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CircleDollarSign className="w-4 h-4 text-[#8A99AD]" />
                    <span>Transactions</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8A99AD] transition-transform duration-200 ${openMenus.transactions ? 'rotate-180' : ''}`} />
                </button>
                {openMenus.transactions && (
                  <ul className="mt-1 flex flex-col gap-1 pl-7">
                    <li>
                      <button
                        onClick={() => onNavigate('/transactions/bookings')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/transactions/bookings' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>Bookings</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/transactions/closings')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/transactions/closings' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>Closings</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/transactions/commissions')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/transactions/commissions' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>Commissions</span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>

          {/* Section: Intelligence & System */}
          <div>
            <h3 className="mb-2 ml-3 text-[11px] font-bold uppercase text-[#8A99AD] tracking-wider">
              Management
            </h3>
            <ul className="mb-6 flex flex-col gap-1">
              <li>
                <button
                  onClick={() => onNavigate('/analytics')}
                  className={`group relative flex w-full items-center gap-3 rounded-sm py-2 px-3.5 text-xs font-semibold text-[#DEE4EE] duration-200 ease-in-out hover:bg-[#333A48] ${
                    isLinkActive('/analytics') ? 'bg-[#333A48] text-white !font-bold' : ''
                  }`}
                >
                  <BarChart3 className={`w-4 h-4 ${isLinkActive('/analytics') ? 'text-[#3C50E0]' : 'text-[#8A99AD]'}`} />
                  <span>Analytics</span>
                </button>
              </li>

              {/* Settings Menu */}
              <li>
                <button
                  onClick={() => toggleMenu('settings')}
                  className={`group relative flex w-full items-center justify-between rounded-sm py-2 px-3.5 text-xs font-semibold text-[#DEE4EE] duration-200 ease-in-out hover:bg-[#333A48] ${
                    currentPath.startsWith('/settings') ? 'bg-[#333A48]/60 text-white' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-[#8A99AD]" />
                    <span>Settings</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8A99AD] transition-transform duration-200 ${openMenus.settings ? 'rotate-180' : ''}`} />
                </button>
                {openMenus.settings && (
                  <ul className="mt-1 flex flex-col gap-1 pl-7">
                    <li>
                      <button
                        onClick={() => onNavigate('/settings?tab=org')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/settings?tab=org' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>Organization</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/settings?tab=users')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/settings?tab=users' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>Users & Roles</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/settings?tab=publishing')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/settings?tab=publishing' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>Publishing Channels</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onNavigate('/settings?tab=ai')}
                        className={`flex w-full items-center gap-2 rounded-sm py-1.5 px-3 text-xs text-[#8A99AD] hover:text-white transition-colors ${
                          currentPath === '/settings?tab=ai' ? 'text-[#3C50E0] font-bold' : ''
                        }`}
                      >
                        <span>AI Configuration</span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </nav>

        {/* Bottom Agent Info Banner */}
        <div className="mt-auto p-4 border-t border-[#2E3A47]">
          <div className="rounded-sm bg-[#24303F] p-3 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Internal System</span>
            </div>
            <p className="text-[11px] text-[#8A99AD] mt-1 leading-snug">
              Honey-an CRM is an internal marketing tool. Confidential data.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
