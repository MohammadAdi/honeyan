import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Users, 
  ShieldCheck, 
  Share2, 
  Sparkles, 
  Save, 
  CheckCircle2,
  RefreshCw,
  Key
} from 'lucide-react';
import { Breadcrumb } from '../layout/Breadcrumb';

interface SettingsViewProps {
  initialTab?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ initialTab = 'org' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [saveMessage, setSaveMessage] = useState(false);

  // Org state
  const [agencyName, setAgencyName] = useState('Honey-an Property Marketing & Lead Conversion');
  const [officeAddress, setOfficeAddress] = useState('Jl. Kaliurang KM 5.8 No. 22, Caturtunggal, Depok, Sleman, D.I. Yogyakarta 55281');
  const [contactEmail, setContactEmail] = useState('marketing@honeyan.id');
  const [officialWA, setOfficialWA] = useState('6281234567890');

  // AI configuration state
  const [strictFactual, setStrictFactual] = useState(true);
  const [aiModel, setAiModel] = useState('gemini-3.8-flash');
  const [defaultAngle, setDefaultAngle] = useState('Family Home');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 2500);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName="System & Organization Settings"
        parentName="Settings"
        parentPath="/settings"
      />

      {/* TABS */}
      <div className="mb-6 flex border-b border-[#E2E8F0] dark:border-[#2E3A47] overflow-x-auto">
        <button
          onClick={() => setActiveTab('org')}
          className={`py-3 px-5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
            activeTab === 'org'
              ? 'border-[#3C50E0] text-[#3C50E0] dark:text-[#80CAEE] bg-[#3C50E0]/5'
              : 'border-transparent text-[#64748B] hover:text-[#1C2434] dark:text-[#8A99AD] dark:hover:text-white'
          }`}
        >
          Organization
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-[#3C50E0] text-[#3C50E0] dark:text-[#80CAEE] bg-[#3C50E0]/5'
              : 'border-transparent text-[#64748B] hover:text-[#1C2434] dark:text-[#8A99AD] dark:hover:text-white'
          }`}
        >
          Users & Sales Agents
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`py-3 px-5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
            activeTab === 'roles'
              ? 'border-[#3C50E0] text-[#3C50E0] dark:text-[#80CAEE] bg-[#3C50E0]/5'
              : 'border-transparent text-[#64748B] hover:text-[#1C2434] dark:text-[#8A99AD] dark:hover:text-white'
          }`}
        >
          Roles & Permissions
        </button>
        <button
          onClick={() => setActiveTab('publishing')}
          className={`py-3 px-5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
            activeTab === 'publishing'
              ? 'border-[#3C50E0] text-[#3C50E0] dark:text-[#80CAEE] bg-[#3C50E0]/5'
              : 'border-transparent text-[#64748B] hover:text-[#1C2434] dark:text-[#8A99AD] dark:hover:text-white'
          }`}
        >
          Publishing Channels
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`py-3 px-5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
            activeTab === 'ai'
              ? 'border-[#3C50E0] text-[#3C50E0] dark:text-[#80CAEE] bg-[#3C50E0]/5'
              : 'border-transparent text-[#64748B] hover:text-[#1C2434] dark:text-[#8A99AD] dark:hover:text-white'
          }`}
        >
          AI Configuration
        </button>
      </div>

      {saveMessage && (
        <div className="mb-4 p-3 rounded-sm bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Configuration preferences updated successfully.</span>
        </div>
      )}

      {/* TAB: ORGANIZATION */}
      {activeTab === 'org' && (
        <form onSubmit={handleSave} className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
            Agency & Corporate Information
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Agency Name
            </label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Official Agency WhatsApp
              </label>
              <input
                type="text"
                value={officialWA}
                onChange={(e) => setOfficialWA(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Support / Inbound Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Headquarters Office Address
            </label>
            <textarea
              rows={2}
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Organization Details</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB: USERS */}
      {activeTab === 'users' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-[#2E3A47]">
            <h3 className="font-bold text-sm text-[#1C2434] dark:text-white">Internal Team & Sales Agents</h3>
            <p className="text-xs text-[#64748B] dark:text-[#8A99AD]">Users with access to the Honey-an CRM platform</p>
          </div>
          <table className="w-full table-auto text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
              <tr>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Assigned Leads</th>
                <th className="px-3 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
              <tr className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C]">
                <td className="px-5 py-3.5 font-bold text-[#1C2434] dark:text-white">Adhi Development</td>
                <td className="px-4 py-3.5">adhi.development@gmail.com</td>
                <td className="px-4 py-3.5 font-semibold text-[#3C50E0]">Marketing Director</td>
                <td className="px-4 py-3.5">All</td>
                <td className="px-3 py-3.5"><span className="text-emerald-600 font-bold">Active</span></td>
              </tr>
              <tr className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C]">
                <td className="px-5 py-3.5 font-bold text-[#1C2434] dark:text-white">Dimas Aditya</td>
                <td className="px-4 py-3.5">dimas.aditya@honeyan.id</td>
                <td className="px-4 py-3.5">Senior Sales Agent</td>
                <td className="px-4 py-3.5">3 Leads</td>
                <td className="px-3 py-3.5"><span className="text-emerald-600 font-bold">Active</span></td>
              </tr>
              <tr className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C]">
                <td className="px-5 py-3.5 font-bold text-[#1C2434] dark:text-white">Siti Rahma</td>
                <td className="px-4 py-3.5">siti.rahma@honeyan.id</td>
                <td className="px-4 py-3.5">Property Consultant</td>
                <td className="px-4 py-3.5">2 Leads</td>
                <td className="px-3 py-3.5"><span className="text-emerald-600 font-bold">Active</span></td>
              </tr>
              <tr className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C]">
                <td className="px-5 py-3.5 font-bold text-[#1C2434] dark:text-white">Rian Pratama</td>
                <td className="px-4 py-3.5">rian.pratama@honeyan.id</td>
                <td className="px-4 py-3.5">Field Escort Agent</td>
                <td className="px-4 py-3.5">2 Leads</td>
                <td className="px-3 py-3.5"><span className="text-emerald-600 font-bold">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: ROLES */}
      {activeTab === 'roles' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
            RBAC Access Controls
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded border border-[#E2E8F0] dark:border-[#2E3A47] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1C2434] dark:text-white">Marketing Director (Super Admin)</span>
                <span className="text-[#64748B] dark:text-[#8A99AD] block mt-0.5">Full access to agreements, commission payouts, and AI prompt configuration.</span>
              </div>
              <span className="rounded bg-indigo-50 text-indigo-700 px-2 py-1 font-mono text-[10px]">ALL_PERMISSIONS</span>
            </div>
            <div className="p-3 rounded border border-[#E2E8F0] dark:border-[#2E3A47] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1C2434] dark:text-white">Sales Consultant</span>
                <span className="text-[#64748B] dark:text-[#8A99AD] block mt-0.5">Manage leads, schedule site visits, move pipeline stages, and propose matching properties.</span>
              </div>
              <span className="rounded bg-blue-50 text-blue-700 px-2 py-1 font-mono text-[10px]">LEAD_SALES_READ_WRITE</span>
            </div>
            <div className="p-3 rounded border border-[#E2E8F0] dark:border-[#2E3A47] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1C2434] dark:text-white">Content Creator / Social Media</span>
                <span className="text-[#64748B] dark:text-[#8A99AD] block mt-0.5">Access Content Studio, generate AI copy, and publish to Facebook/Instagram.</span>
              </div>
              <span className="rounded bg-amber-50 text-amber-700 px-2 py-1 font-mono text-[10px]">MARKETING_PUBLISH</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PUBLISHING CHANNELS */}
      {activeTab === 'publishing' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
            Connected Channels & API Integrations
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded border border-[#E2E8F0] dark:border-[#2E3A47] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1C2434] dark:text-white">Meta for Developers (Facebook Page & Instagram)</span>
                <span className="text-[#64748B] dark:text-[#8A99AD] block mt-0.5">Page: @HoneyAnProperty (Connected and live for publishing)</span>
              </div>
              <span className="text-emerald-600 font-bold">Connected</span>
            </div>
            <div className="p-3 rounded border border-[#E2E8F0] dark:border-[#2E3A47] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1C2434] dark:text-white">WhatsApp Business Cloud API</span>
                <span className="text-[#64748B] dark:text-[#8A99AD] block mt-0.5">Instant WhatsApp click-to-chat links with prefilled property details</span>
              </div>
              <span className="text-emerald-600 font-bold">Enabled</span>
            </div>
            <div className="p-3 rounded border border-[#E2E8F0] dark:border-[#2E3A47] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1C2434] dark:text-white">TikTok Content Posting API</span>
                <span className="text-[#64748B] dark:text-[#8A99AD] block mt-0.5">Export short video scripts to TikTok video builder</span>
              </div>
              <span className="text-emerald-600 font-bold">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AI CONFIGURATION */}
      {activeTab === 'ai' && (
        <form onSubmit={handleSave} className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4 text-xs">
          <div className="border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
            <h3 className="font-bold text-sm text-[#1C2434] dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Copywriting Engine Configuration
            </h3>
            <p className="text-[11px] text-[#64748B] dark:text-[#8A99AD] mt-0.5">
              Powered by Google Gemini 3.8 Flash SDK on server-side
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Model Engine
              </label>
              <input
                type="text"
                disabled
                value="gemini-3.8-flash (Standard Text & Creative Copy)"
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F1F5F9] py-2 px-3 text-xs text-[#64748B] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-[#8A99AD]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Default Copywriting Angle
              </label>
              <select
                value={defaultAngle}
                onChange={(e) => setDefaultAngle(e.target.value)}
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              >
                <option value="Family Home">Family Home</option>
                <option value="Strategic Location">Strategic Location</option>
                <option value="First Home Buyer">First Home Buyer</option>
                <option value="Investment">Investment</option>
                <option value="Price Highlight">Price Highlight</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 rounded-sm border border-amber-200 dark:border-amber-900/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Strict Factual Integrity Invariant</span>
            </div>
            <p className="text-[#64748B] dark:text-[#8A99AD] leading-relaxed">
              In accordance with Honey-an core principles: The AI generator is hard-coded with a system prompt that enforces strict adherence to database facts. Under no circumstances will the system hallucinate prices, fake legal certificates, or non-existent facilities.
            </p>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save AI Settings</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
