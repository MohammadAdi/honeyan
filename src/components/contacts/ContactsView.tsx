import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  MessageCircle, 
  Phone, 
  FileCheck2, 
  Building2, 
  Calendar,
  ExternalLink,
  Coins,
  Eye,
  Mail
} from 'lucide-react';
import { Contact, Property, Agreement } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface ContactsViewProps {
  type: 'Owner' | 'Agent';
  contacts: Contact[];
  properties: Property[];
  agreements: Agreement[];
  onAddContact: (contact: Contact) => void;
  onNavigate: (path: string) => void;
  onSelectProperty?: (property: Property) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  type,
  contacts,
  properties,
  agreements,
  onAddContact,
  onNavigate,
  onSelectProperty
}) => {
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Contact form state
  const [newName, setNewName] = useState('');
  const [newWA, setNewWA] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredContacts = contacts
    .filter(c => c.type === type)
    .filter(c => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.whatsapp.includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newWA) return;

    const newContact: Contact = {
      id: `cnt-${Date.now()}`,
      type,
      name: newName,
      whatsapp: newWA.replace(/[^0-9]/g, ''),
      phone: newPhone || newWA,
      email: newEmail,
      propertiesCount: 0,
      activeAgreementsCount: 0,
      lastContact: new Date().toISOString().split('T')[0],
      status: 'Active',
      notes: newNotes,
      communicationHistory: [
        {
          id: `ch-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          channel: 'Direct Input',
          summary: `${type} profile created in Honey-an CRM`,
          agent: 'Adhi Development'
        }
      ]
    };

    onAddContact(newContact);
    setIsCreateOpen(false);
    setNewName('');
    setNewWA('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
  };

  // Properties belonging to selected contact
  const contactProperties = selectedContact 
    ? properties.filter(p => p.ownerId === selectedContact.id || p.ownerName.toLowerCase().includes(selectedContact.name.toLowerCase()))
    : [];

  const contactAgreements = selectedContact
    ? agreements.filter(a => a.ownerId === selectedContact.id || a.ownerName.toLowerCase().includes(selectedContact.name.toLowerCase()))
    : [];

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName={type === 'Owner' ? 'Property Owners' : 'Broker & Agent Partners'}
        parentName="Contacts"
        parentPath={type === 'Owner' ? '/contacts/owners' : '/contacts/agents'}
        actions={
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add {type}</span>
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
              placeholder={`Search ${type.toLowerCase()} by name, phone, WA...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>
          <span className="text-xs text-[#64748B] dark:text-[#8A99AD]">
            Total {type}s: <strong className="text-[#1C2434] dark:text-white">{filteredContacts.length}</strong>
          </span>
        </div>
      </div>

      {/* CONTACTS TABLE */}
      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
              <tr>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-4 py-3.5">WhatsApp / Phone</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5 text-center">Properties</th>
                <th className="px-4 py-3.5 text-center">Active Agreements</th>
                <th className="px-4 py-3.5">Last Contact</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#64748B] dark:text-[#8A99AD]">
                    No {type.toLowerCase()} contacts found.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr 
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-[#1C2434] dark:text-white">
                        {contact.name}
                      </div>
                      <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] line-clamp-1 max-w-xs">
                        {contact.notes || `${type} in network`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-emerald-600">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>+{contact.whatsapp}</span>
                      </div>
                      <span className="text-[10px] text-[#94A3B8] block">{contact.phone}</span>
                    </td>
                    <td className="px-4 py-3.5 text-[#64748B] dark:text-[#8A99AD]">
                      {contact.email || '-'}
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-[#3C50E0] dark:text-[#80CAEE]">
                      {contact.propertiesCount}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 px-2 py-0.5 font-semibold text-[11px]">
                        {contact.activeAgreementsCount} active
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#64748B] dark:text-[#8A99AD] whitespace-nowrap">
                      {contact.lastContact}
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge variant={contact.status === 'Active' ? 'success' : 'warning'} size="sm">
                        {contact.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${contact.whatsapp}?text=Halo%20${encodeURIComponent(contact.name)},%20dari%20Honey-an%20Property`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                          title="Chat WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="rounded border border-[#E2E8F0] dark:border-[#2E3A47] px-2.5 py-1 text-[11px] font-semibold text-[#1C2434] dark:text-white hover:border-[#3C50E0] hover:text-[#3C50E0]"
                        >
                          Detail
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

      {/* CONTACT DETAIL MODAL */}
      {selectedContact && (
        <Modal
          isOpen={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          title={`${selectedContact.type} Details: ${selectedContact.name}`}
          subtitle={`Managed by Honey-an CRM · Status: ${selectedContact.status}`}
          maxWidth="4xl"
        >
          <div className="space-y-6 text-xs">
            {/* Top Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F8FAFC] dark:bg-[#1A222C] p-4 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47]">
              <div>
                <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">WhatsApp / Phone</span>
                <a
                  href={`https://wa.me/${selectedContact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-emerald-600 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  +{selectedContact.whatsapp}
                </a>
                <span className="text-[10px] text-[#94A3B8]">{selectedContact.phone}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Email Address</span>
                <span className="font-semibold text-[#1C2434] dark:text-white mt-0.5 block">{selectedContact.email || '-'}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Last Interaction</span>
                <span className="font-semibold text-[#1C2434] dark:text-white mt-0.5 block">{selectedContact.lastContact}</span>
              </div>
              <div className="sm:col-span-3 pt-2 border-t border-[#E2E8F0] dark:border-[#2E3A47]">
                <span className="text-[11px] font-bold text-[#1C2434] dark:text-white block mb-0.5">Notes & Background:</span>
                <p className="text-[#64748B] dark:text-[#8A99AD]">{selectedContact.notes || 'No special notes.'}</p>
              </div>
            </div>

            {/* Properties List */}
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
                <h4 className="font-bold text-sm text-[#1C2434] dark:text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#3C50E0]" />
                  Associated Properties ({contactProperties.length})
                </h4>
                <button
                  onClick={() => {
                    setSelectedContact(null);
                    onNavigate('/properties/create');
                  }}
                  className="text-xs font-semibold text-[#3C50E0] hover:underline"
                >
                  + Add Property for this {type}
                </button>
              </div>

              {contactProperties.length === 0 ? (
                <p className="text-[#64748B] dark:text-[#8A99AD] py-3 text-center">No properties linked to this contact yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {contactProperties.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        setSelectedContact(null);
                        if (onSelectProperty) onSelectProperty(p);
                      }}
                      className="p-3 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] hover:border-[#3C50E0] cursor-pointer bg-white dark:bg-[#24303F] flex gap-3 transition-colors"
                    >
                      <img src={p.coverImage} alt={p.title} className="w-16 h-14 object-cover rounded-xs" />
                      <div className="truncate">
                        <span className="font-mono text-[10px] text-[#3C50E0] font-bold">{p.code}</span>
                        <h5 className="font-bold text-[#1C2434] dark:text-white truncate">{p.title}</h5>
                        <span className="text-[11px] text-emerald-600 font-bold block">Rp {Number(p.askingPrice).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Agreements */}
            <div>
              <h4 className="font-bold text-sm text-[#1C2434] dark:text-white flex items-center gap-1.5 mb-3 border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
                <FileCheck2 className="w-4 h-4 text-[#10B981]" />
                Commission Agreements ({contactAgreements.length})
              </h4>
              {contactAgreements.length === 0 ? (
                <p className="text-[#64748B] dark:text-[#8A99AD] py-3 text-center">No agreements drafted yet.</p>
              ) : (
                <div className="space-y-2">
                  {contactAgreements.map(a => (
                    <div key={a.id} className="p-3 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-[#1C2434] dark:text-white">{a.code}</span>
                        <span className="text-[#64748B] dark:text-[#8A99AD] ml-2">Property: {a.propertyTitle}</span>
                        <span className="text-[11px] text-[#94A3B8] block">Komisi {a.commissionValue}% · Exp: {a.expiryDate}</span>
                      </div>
                      <Badge variant={a.status === 'Active' ? 'success' : 'warning'}>
                        {a.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Communication History */}
            <div>
              <h4 className="font-bold text-sm text-[#1C2434] dark:text-white flex items-center gap-1.5 mb-3 border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
                <Calendar className="w-4 h-4 text-amber-500" />
                Communication History
              </h4>
              <div className="space-y-2">
                {selectedContact.communicationHistory?.map(ch => (
                  <div key={ch.id} className="p-2.5 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-[#1C2434] dark:text-white">[{ch.channel}] {ch.summary}</span>
                      <span className="text-[10px] text-[#94A3B8] block">Logged by {ch.agent}</span>
                    </div>
                    <span className="text-[10px] text-[#94A3B8]">{ch.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* CREATE CONTACT MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={`Add New ${type}`}
        subtitle="Register property owner or co-broking agent to manage agreements"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Ir. Hendra Gunawan"
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                WhatsApp Number * (format: 628...)
              </label>
              <input
                type="text"
                required
                value={newWA}
                onChange={(e) => setNewWA(e.target.value)}
                placeholder="6281234567890"
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="0812-3456-7890"
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="hendra@example.com"
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
              Notes & Preferences
            </label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Catatan mengenai unit yang dimiliki, syarat nego, preferensi komisi..."
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0] dark:border-[#2E3A47]">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="rounded-sm border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] dark:border-[#2E3A47] dark:text-[#8A99AD]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90"
            >
              Save {type}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
