import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  MessageSquare, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  Building,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  darkMode: boolean;
  setDarkMode: (arg: boolean) => void;
  onNavigate: (path: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  onNavigate,
  searchQuery,
  setSearchQuery
}) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex w-full bg-white drop-shadow-xs dark:bg-[#24303F] dark:drop-shadow-none border-b border-[#E2E8F0] dark:border-[#2E3A47]">
      <div className="flex grow items-center justify-between px-4 py-3 md:px-6 2xl:px-8">
        {/* Left: Sidebar Toggle & Search */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="z-50 block rounded-sm border border-[#E2E8F0] bg-white p-1.5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] lg:hidden text-[#1C2434] dark:text-white"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search */}
          <div className="relative hidden sm:block w-64 md:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#8A99AD]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search properties, leads, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-1.5 pl-9 pr-3 text-xs font-medium text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white dark:focus:border-[#3C50E0]"
            />
          </div>
        </div>

        {/* Right: Actions & User Info */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Content AI shortcut */}
          <button
            onClick={() => onNavigate('/marketing/content')}
            className="hidden md:flex items-center gap-1.5 rounded-sm bg-[#3C50E0]/10 hover:bg-[#3C50E0]/20 text-[#3C50E0] dark:bg-[#3C50E0]/25 dark:text-[#80CAEE] px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Content Studio</span>
          </button>

          {/* Dark Mode Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#F1F5F9] hover:text-[#3C50E0] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white transition-colors"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#64748B]" />
            )}
          </button>

          {/* Notification Menu */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B] hover:text-[#3C50E0] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-[#8A99AD] transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#10B981] ring-2 ring-white dark:ring-[#24303F]"></span>
            </button>

            {notifOpen && (
              <div 
                className="absolute right-0 mt-2 w-75 rounded-sm border border-[#E2E8F0] bg-white p-3 shadow-lg dark:border-[#2E3A47] dark:bg-[#24303F] z-50 text-left"
                onMouseLeave={() => setNotifOpen(false)}
              >
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
                  <span className="text-xs font-bold text-[#1C2434] dark:text-white">Recent Activity</span>
                  <span className="text-[10px] text-[#3C50E0] font-semibold cursor-pointer">Mark all read</span>
                </div>
                <div className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47] text-xs">
                  <div className="py-2.5 flex items-start gap-2.5 cursor-pointer hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C] p-1.5 rounded">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1C2434] dark:text-white">New Booking Received</p>
                      <p className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">Pak Surya booking Guesthouse Malioboro Rp 25M</p>
                      <span className="text-[9px] text-[#94A3B8]">15 mins ago</span>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-start gap-2.5 cursor-pointer hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C] p-1.5 rounded">
                    <Calendar className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1C2434] dark:text-white">Site Visit Reminder</p>
                      <p className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">Survei Budi Santoso besok jam 10:00 WIB</p>
                      <span className="text-[9px] text-[#94A3B8]">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 text-left pl-2"
            >
              <div className="h-9 w-9 rounded-full bg-[#3C50E0] text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-[#E2E8F0] dark:ring-[#2E3A47]">
                {user?.displayName.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'HA'}
              </div>
              <div className="hidden text-right lg:block">
                <span className="block text-xs font-bold text-[#1C2434] dark:text-white leading-tight">
                  {user?.displayName}
                </span>
                <span className="block text-[11px] text-[#64748B] dark:text-[#8A99AD]">
                  {user?.roles.join(', ')}
                </span>
              </div>
              <ChevronDown className="hidden sm:block w-4 h-4 text-[#64748B] dark:text-[#8A99AD]" />
            </button>

            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-sm border border-[#E2E8F0] bg-white p-2 shadow-lg dark:border-[#2E3A47] dark:bg-[#24303F] z-50 text-left"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-[#E2E8F0] dark:border-[#2E3A47]">
                  <p className="text-xs font-semibold text-[#1C2434] dark:text-white">{user?.displayName}</p>
                  <p className="text-[11px] text-[#64748B] dark:text-[#8A99AD] truncate">{user?.email}</p>
                </div>
                <div className="py-1 text-xs text-[#1C2434] dark:text-[#AEB7C0]">
                  <button 
                    onClick={() => { setDropdownOpen(false); onNavigate('/settings'); }}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded hover:bg-[#F1F5F9] dark:hover:bg-[#1A222C] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>CRM Settings</span>
                  </button>
                  <button 
                    onClick={() => { setDropdownOpen(false); onNavigate('/contacts/owners'); }}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded hover:bg-[#F1F5F9] dark:hover:bg-[#1A222C] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>My Network</span>
                  </button>
                  <div className="my-1 border-t border-[#E2E8F0] dark:border-[#2E3A47]"></div>
                  <button 
                    onClick={() => { setDropdownOpen(false); void logout(); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
