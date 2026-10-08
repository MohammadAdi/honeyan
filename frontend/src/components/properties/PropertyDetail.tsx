import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  Eye, 
  MessageCircle, 
  Coins, 
  FileCheck2, 
  Sparkles, 
  Share2, 
  Edit3, 
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Phone,
  Clock,
  ShieldAlert,
  Send
} from 'lucide-react';
import { Property, Contact, Agreement, Lead, SiteVisit } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Badge, getListingStatusBadge, getLeadTemperatureBadge, getPipelineStageBadge } from '../common/Badge';

interface PropertyDetailProps {
  property: Property;
  owner?: Contact;
  agreements: Agreement[];
  leads: Lead[];
  siteVisits: SiteVisit[];
  onBack: () => void;
  onEdit: (property: Property) => void;
  onGenerateContent: (property: Property) => void;
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus?: (propertyId: string, status: Property['listingStatus']) => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({
  property,
  owner,
  agreements,
  leads,
  siteVisits,
  onBack,
  onEdit,
  onGenerateContent,
  onSelectLead,
  onUpdateStatus
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'owner' | 'agreement' | 'content' | 'leads' | 'visits' | 'activity'>('overview');

  const propertyAgreement = agreements.find(a => a.propertyId === property.id);
  const propertyLeads = leads.filter(l => l.interestedPropertyId === property.id);
  const propertyVisits = siteVisits.filter(v => v.propertyId === property.id);

  const formatPrice = (num: number) => `Rp ${Number(num).toLocaleString('id-ID')}`;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'owner', label: `Owner (${property.ownerName})` },
    { key: 'agreement', label: 'Agreement' },
    { key: 'content', label: 'Marketing Content' },
    { key: 'leads', label: `Leads (${propertyLeads.length})` },
    { key: 'visits', label: `Site Visits (${propertyVisits.length})` },
    { key: 'activity', label: 'Activity Log' }
  ];

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName={`${property.code} — ${property.title}`}
        parentName="Properties"
        parentPath="/properties"
        onNavigate={onBack}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onGenerateContent(property)}
              className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-opacity-90 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Content Studio</span>
            </button>
            <button
              onClick={() => onEdit(property)}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1C2434] hover:bg-[#F1F5F9] dark:border-[#2E3A47] dark:bg-[#24303F] dark:text-white"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        }
      />

      {/* TOP SUMMARY BANNER */}
      <div className="mb-6 rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={property.coverImage}
              alt={property.title}
              className="h-24 w-32 rounded-sm object-cover border border-[#E2E8F0] dark:border-[#2E3A47] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#3C50E0] dark:text-[#80CAEE]">
                  {property.code}
                </span>
                <span className="text-[#64748B] dark:text-[#8A99AD] text-xs">·</span>
                {getListingStatusBadge(property.listingStatus)}
                <Badge variant={property.agreementStatus === 'Active' ? 'success' : 'warning'} size="sm">
                  {property.agreementStatus} Agreement
                </Badge>
              </div>

              <h2 className="text-xl font-bold text-[#1C2434] dark:text-white">
                {property.title}
              </h2>

              <p className="text-xs text-[#64748B] dark:text-[#8A99AD] mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {property.address || `${property.district}, ${property.city}, ${property.province}`}
                {property.googleMapsUrl && (
                  <a 
                    href={property.googleMapsUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#3C50E0] hover:underline ml-1 inline-flex items-center gap-0.5"
                  >
                    View Map <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 lg:border-l lg:border-[#E2E8F0] lg:dark:border-[#2E3A47] lg:pl-6">
            <div>
              <span className="text-[11px] font-medium text-[#64748B] dark:text-[#8A99AD] uppercase block">
                Asking Price
              </span>
              <span className="text-2xl font-extrabold text-[#1C2434] dark:text-white">
                {formatPrice(property.askingPrice)}
              </span>
              <span className="text-[10px] text-[#94A3B8] block">
                Nego min: {formatPrice(property.minimumNegotiablePrice)}
              </span>
            </div>

            <div className="rounded-sm bg-[#EFF2F7] dark:bg-[#1E293B] p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#8A99AD] block">
                Potential Commission
              </span>
              <span className="text-base font-extrabold text-[#3C50E0] dark:text-[#80CAEE]">
                {formatPrice(property.potentialCommission)}
              </span>
              <span className="text-[10px] text-emerald-500 font-semibold block">2.5% Standard</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="mb-6 flex border-b border-[#E2E8F0] dark:border-[#2E3A47] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-3 px-5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[#3C50E0] text-[#3C50E0] dark:text-[#80CAEE] bg-[#3C50E0]/5'
                : 'border-transparent text-[#64748B] hover:text-[#1C2434] dark:text-[#8A99AD] dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Specifications Card */}
            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
              <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47] mb-4">
                Property Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] p-3 border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Luas Tanah</span>
                  <span className="text-sm font-bold text-[#1C2434] dark:text-white">{property.landSize} m²</span>
                </div>
                <div className="rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] p-3 border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Luas Bangunan</span>
                  <span className="text-sm font-bold text-[#1C2434] dark:text-white">{property.buildingSize} m²</span>
                </div>
                <div className="rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] p-3 border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Kamar Tidur</span>
                  <span className="text-sm font-bold text-[#1C2434] dark:text-white">{property.bedrooms} KT</span>
                </div>
                <div className="rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] p-3 border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Kamar Mandi</span>
                  <span className="text-sm font-bold text-[#1C2434] dark:text-white">{property.bathrooms} KM</span>
                </div>
                <div className="rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] p-3 border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Jumlah Lantai</span>
                  <span className="text-sm font-bold text-[#1C2434] dark:text-white">{property.floors} Lantai</span>
                </div>
                <div className="rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] p-3 border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Carport</span>
                  <span className="text-sm font-bold text-[#1C2434] dark:text-white">{property.carport} Mobil</span>
                </div>
                <div className="rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] p-3 border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Daya Listrik</span>
                  <span className="text-sm font-bold text-[#1C2434] dark:text-white">{property.electricity}</span>
                </div>
                <div className="rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] p-3 border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Sumber Air</span>
                  <span className="text-sm font-bold text-[#1C2434] dark:text-white">{property.waterSource}</span>
                </div>
              </div>
            </div>

            {/* Description & Legal */}
            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
              <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47] mb-3">
                Description & Selling Highlights
              </h3>
              <p className="text-xs text-[#1C2434] dark:text-[#AEB7C0] leading-relaxed whitespace-pre-line mb-4">
                {property.description}
              </p>

              <h4 className="text-xs font-bold text-[#1C2434] dark:text-white mb-2">Legal Verification:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F8FAFC] dark:bg-[#1A222C] p-3 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47]">
                <div>
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Sertifikat</span>
                  <span className="font-bold text-[#1C2434] dark:text-white">{property.certificateType}</span>
                  <span className="text-[10px] text-[#94A3B8] block">{property.certificateNumber || 'Tervalidasi'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">PBG / IMB</span>
                  <span className="font-bold text-emerald-600">{property.pbgStatus ? 'Ada & Lengkap' : 'Proses'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Catatan Hukum</span>
                  <span className="font-medium text-[#1C2434] dark:text-white">{property.legalNotes || 'Clear & Clean'}</span>
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            {property.propertyImages && property.propertyImages.length > 0 && (
              <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
                <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47] mb-3">
                  Photo Gallery ({property.propertyImages.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {property.propertyImages.map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt={`Gallery item ${i + 1}`}
                      className="h-28 w-full rounded-sm object-cover border border-[#E2E8F0] dark:border-[#2E3A47] hover:opacity-95 transition-opacity"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Readiness & Key Metrics */}
          <div className="space-y-6">
            {/* Marketing Readiness Box */}
            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
              <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47] mb-3">
                Marketing Readiness
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[#64748B] dark:text-[#8A99AD]">Agreement Status</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {property.agreementStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[#64748B] dark:text-[#8A99AD]">Legal Cleanliness</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SHM Verified
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[#64748B] dark:text-[#8A99AD]">Photo Assets</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    HD Photos Ready
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[#64748B] dark:text-[#8A99AD]">Commission Locked</span>
                  <span className="font-bold text-[#3C50E0]">
                    2.5% ({formatPrice(property.potentialCommission)})
                  </span>
                </div>
              </div>

              <button
                onClick={() => onGenerateContent(property)}
                className="mt-4 w-full rounded-sm bg-[#3C50E0] py-2 text-xs font-semibold text-white hover:bg-opacity-90 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Launch Marketing Content</span>
              </button>
            </div>

            {/* Performance Counters */}
            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
              <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47] mb-3">
                Lead & Conversion Stats
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Total Inquiries</span>
                  <span className="text-lg font-bold text-[#1C2434] dark:text-white">{property.inquiriesCount}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Captured Leads</span>
                  <span className="text-lg font-bold text-[#3C50E0]">{property.leadCount}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Site Visits</span>
                  <span className="text-lg font-bold text-amber-500">{property.siteVisitCount}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block">Marketplace Source</span>
                  <span className="text-xs font-semibold text-[#1C2434] dark:text-white">{property.marketplace}</span>
                </div>
              </div>
            </div>

            {/* Owner Quick Info Card */}
            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
              <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47] mb-3">
                Listing Owner
              </h3>
              <div className="text-xs space-y-2">
                <div className="font-bold text-sm text-[#1C2434] dark:text-white">
                  {property.ownerName}
                </div>
                {owner && (
                  <>
                    <p className="text-[#64748B] dark:text-[#8A99AD]">{owner.notes}</p>
                    <a
                      href={`https://wa.me/${owner.whatsapp}?text=Halo%20${encodeURIComponent(owner.name)},%20update%20properti%20${property.code}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-sm bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat Owner via WhatsApp</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: OWNER */}
      {activeTab === 'owner' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4 dark:border-[#2E3A47] mb-5">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#64748B] dark:text-[#8A99AD] font-semibold">
                Owner Contact Details
              </span>
              <h3 className="text-xl font-bold text-[#1C2434] dark:text-white">
                {property.ownerName}
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8A99AD] mt-0.5">
                {owner?.email || 'No email registered'} · Type: {owner?.type || 'Owner'}
              </p>
            </div>
            {owner?.whatsapp && (
              <a
                href={`https://wa.me/${owner.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: +{owner.whatsapp}</span>
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs mb-6">
            <div className="p-4 rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] border border-[#E2E8F0] dark:border-[#2E3A47]">
              <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block mb-1">Phone Number</span>
              <span className="text-sm font-bold text-[#1C2434] dark:text-white">{owner?.phone || '-'}</span>
            </div>
            <div className="p-4 rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] border border-[#E2E8F0] dark:border-[#2E3A47]">
              <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block mb-1">Total Properties Managed</span>
              <span className="text-sm font-bold text-[#1C2434] dark:text-white">{owner?.propertiesCount || 1} listings</span>
            </div>
            <div className="p-4 rounded-sm bg-[#F8FAFC] dark:bg-[#1A222C] border border-[#E2E8F0] dark:border-[#2E3A47]">
              <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block mb-1">Active Commission Agreement</span>
              <span className="text-sm font-bold text-emerald-600">{owner?.activeAgreementsCount || 1} active agreements</span>
            </div>
          </div>

          <h4 className="font-bold text-xs text-[#1C2434] dark:text-white mb-3">Owner Communication History:</h4>
          <div className="space-y-2">
            {owner?.communicationHistory && owner.communicationHistory.length > 0 ? (
              owner.communicationHistory.map((ch) => (
                <div key={ch.id} className="p-3 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] flex items-start justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#1C2434] dark:text-white">
                      [{ch.channel}] {ch.summary}
                    </span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block mt-0.5">
                      Handled by sales consultant: {ch.agent}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8] shrink-0">{ch.date}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#64748B] dark:text-[#8A99AD]">No past communication records logged.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: AGREEMENT */}
      {activeTab === 'agreement' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 dark:border-[#2E3A47] mb-5">
            <div>
              <h3 className="text-lg font-bold text-[#1C2434] dark:text-white">
                Marketing & Commission Agreement
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8A99AD]">
                Legal arrangement regarding exclusivity, commission rate, and buyer protection period
              </p>
            </div>
            <Badge variant={propertyAgreement?.status === 'Active' ? 'success' : 'warning'}>
              {propertyAgreement?.status || 'Draft'}
            </Badge>
          </div>

          {propertyAgreement ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[#64748B] dark:text-[#8A99AD] block text-[11px]">Agreement ID</span>
                  <span className="font-bold text-[#1C2434] dark:text-white">{propertyAgreement.code}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[#64748B] dark:text-[#8A99AD] block text-[11px]">Commission Type</span>
                  <span className="font-bold text-[#1C2434] dark:text-white">{propertyAgreement.commissionType} ({propertyAgreement.commissionValue}%)</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[#64748B] dark:text-[#8A99AD] block text-[11px]">Agreement Period</span>
                  <span className="font-bold text-[#1C2434] dark:text-white">{propertyAgreement.agreementDate} to {propertyAgreement.expiryDate}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A222C] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
                  <span className="text-[#64748B] dark:text-[#8A99AD] block text-[11px]">Lead Protection Period</span>
                  <span className="font-bold text-[#3C50E0]">{propertyAgreement.leadProtectionPeriodDays} Days</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#1A222C] rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47]">
                <h4 className="font-bold text-[#1C2434] dark:text-white mb-1">Agreement Terms & Notes:</h4>
                <p className="text-xs text-[#64748B] dark:text-[#8A99AD] leading-relaxed">
                  {propertyAgreement.notes}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[#64748B] dark:text-[#8A99AD]">
              <FileCheck2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              No agreement formally attached yet.
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: CONTENT */}
      {activeTab === 'content' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4 dark:border-[#2E3A47] mb-5">
            <div>
              <h3 className="text-lg font-bold text-[#1C2434] dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                AI Social Marketing Content
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8A99AD]">
                Generate ready-to-publish Facebook posts, Instagram captions, video scripts, and hashtags using factual data only.
              </p>
            </div>
            <button
              onClick={() => onGenerateContent(property)}
              className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 transition-all self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open Content Studio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] bg-[#F8FAFC] dark:bg-[#1A222C]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#1C2434] dark:text-white">Facebook Post Angle: Family Home</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Ready</span>
              </div>
              <p className="text-[#64748B] dark:text-[#8A99AD] leading-relaxed whitespace-pre-line line-clamp-6">
                🏡 NEW EXCLUSIVE LISTING: {property.title}
                {'\n\n'}📍 Lokasi: {property.district}, {property.city}
                {'\n'}💰 Harga: {formatPrice(property.askingPrice)}
                {'\n'}✨ Luas Tanah: {property.landSize}m² | {property.bedrooms} KT / {property.bathrooms} KM
                {'\n\n'}Jadwalkan survei sekarang via WhatsApp Honey-an!
              </p>
            </div>

            <div className="p-4 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] bg-[#F8FAFC] dark:bg-[#1A222C]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#1C2434] dark:text-white">Instagram Aesthetic Caption</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Ready</span>
              </div>
              <p className="text-[#64748B] dark:text-[#8A99AD] leading-relaxed whitespace-pre-line line-clamp-6">
                Modern Living at its Best ✨
                {'\n\n'}{property.title} hadir di kawasan strategis {property.city}.
                {'\n'}📐 LT: {property.landSize} m² / LB: {property.buildingSize} m²
                {'\n'}📑 Sertifikat: {property.certificateType}
                {'\n'}🏷️ Harga: {formatPrice(property.askingPrice)}
                {'\n\n'}Tap link di bio untuk janji survei lokasi langsung.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: LEADS */}
      {activeTab === 'leads' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-[#2E3A47]">
            <h3 className="text-base font-bold text-[#1C2434] dark:text-white">
              Interested Buyers for {property.code}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#8A99AD]">
              Leads that matched or explicitly inquired about this property
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
                <tr>
                  <th className="px-5 py-3">Buyer Name</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Budget Range</th>
                  <th className="px-3 py-3">Temp</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Assigned Sales</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
                {propertyLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#64748B] dark:text-[#8A99AD]">
                      No buyers registered yet for this property.
                    </td>
                  </tr>
                ) : (
                  propertyLeads.map(lead => (
                    <tr 
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C] cursor-pointer"
                    >
                      <td className="px-5 py-3.5 font-bold text-[#1C2434] dark:text-white">
                        {lead.buyerName}
                      </td>
                      <td className="px-4 py-3.5">
                        <a 
                          href={`https://wa.me/${lead.whatsapp}`}
                          target="_blank" 
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-emerald-600 hover:underline font-medium"
                        >
                          +{lead.whatsapp}
                        </a>
                      </td>
                      <td className="px-4 py-3.5">
                        {formatPrice(lead.minBudget)} - {formatPrice(lead.maxBudget)}
                      </td>
                      <td className="px-3 py-3.5">{getLeadTemperatureBadge(lead.leadTemperature)}</td>
                      <td className="px-4 py-3.5">{getPipelineStageBadge(lead.pipelineStage)}</td>
                      <td className="px-4 py-3.5 font-medium">{lead.assignedSales}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLead(lead);
                          }}
                          className="rounded bg-[#3C50E0]/10 px-2 py-1 text-[11px] font-semibold text-[#3C50E0]"
                        >
                          View Lead
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SITE VISITS */}
      {activeTab === 'visits' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
          <h3 className="text-base font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47] mb-4">
            Scheduled & Completed Site Visits
          </h3>
          <div className="space-y-3">
            {propertyVisits.length === 0 ? (
              <p className="text-xs text-[#64748B] dark:text-[#8A99AD] py-6 text-center">
                No site visits scheduled for this property yet.
              </p>
            ) : (
              propertyVisits.map(visit => (
                <div key={visit.id} className="p-4 rounded-sm border border-[#E2E8F0] dark:border-[#2E3A47] bg-[#F8FAFC] dark:bg-[#1A222C] text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-sm text-[#1C2434] dark:text-white">{visit.buyerName}</span>
                      <span className="text-[#64748B] dark:text-[#8A99AD] ml-2">Phone: {visit.buyerPhone}</span>
                    </div>
                    <Badge variant={visit.status === 'Completed' ? 'success' : visit.status === 'Confirmed' ? 'primary' : 'warning'}>
                      {visit.status}
                    </Badge>
                  </div>
                  <p className="text-[#64748B] dark:text-[#8A99AD]">
                    <strong>Schedule:</strong> {visit.schedule} · <strong>Escort Agent:</strong> {visit.sales}
                  </p>
                  {visit.buyerFeedback && (
                    <div className="mt-2 p-2 bg-white dark:bg-[#24303F] rounded border border-[#E2E8F0] dark:border-[#2E3A47]">
                      <span className="font-semibold text-[#1C2434] dark:text-white">Buyer Feedback: </span>
                      <span className="italic">{visit.buyerFeedback}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ACTIVITY LOG */}
      {activeTab === 'activity' && (
        <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
          <h3 className="text-base font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-3 dark:border-[#2E3A47] mb-4">
            Audit & Marketing Activity Timeline
          </h3>
          <div className="space-y-4 border-l-2 border-[#E2E8F0] dark:border-[#2E3A47] pl-4 ml-2 text-xs">
            <div>
              <span className="text-[10px] text-[#94A3B8]">2026-09-26 14:00</span>
              <p className="font-semibold text-[#1C2434] dark:text-white mt-0.5">Survei Terkonfirmasi</p>
              <p className="text-[#64748B] dark:text-[#8A99AD]">Calon buyer Budi Santoso menjadwalkan kunjungan lokasi.</p>
            </div>
            <div>
              <span className="text-[10px] text-[#94A3B8]">2026-09-18 10:15</span>
              <p className="font-semibold text-[#1C2434] dark:text-white mt-0.5">Konten Meta Ads Diterbitkan</p>
              <p className="text-[#64748B] dark:text-[#8A99AD]">Campaign &apos;Sleman Modern Family Home&apos; mulai menayangkan listing ke target keluarga muda.</p>
            </div>
            <div>
              <span className="text-[10px] text-[#94A3B8]">2026-09-02 11:30</span>
              <p className="font-semibold text-[#1C2434] dark:text-white mt-0.5">Perjanjian Pemasangan & Komisi Ditandatangani</p>
              <p className="text-[#64748B] dark:text-[#8A99AD]">Pemilik {property.ownerName} menyetujui komisi 2.5% dan perlindungan lead 90 hari.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
