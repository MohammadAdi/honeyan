import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  FileText, 
  Layers, 
  Link, 
  Image, 
  User, 
  Save, 
  ArrowLeft,
  Plus,
  Check
} from 'lucide-react';
import { Property, Contact, PropertyType, ListingStatus, AgreementStatus } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';

interface PropertyFormProps {
  initialData?: Property | null;
  owners: Contact[];
  onSave: (property: Property) => void;
  onCancel: () => void;
  onAddNewOwner?: (owner: Partial<Contact>) => Contact;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  owners,
  onSave,
  onCancel
}) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState<Partial<Property>>(
    initialData || {
      code: `HN-SLM-${String(Math.floor(100 + Math.random() * 900))}`,
      title: '',
      propertyType: 'House',
      description: '',
      province: 'D.I. Yogyakarta',
      city: 'Sleman',
      district: 'Depok',
      subdistrict: '',
      address: '',
      googleMapsUrl: '',
      askingPrice: 850000000,
      minimumNegotiablePrice: 800000000,
      pricePerSqm: 7000000,
      landSize: 120,
      buildingSize: 90,
      bedrooms: 3,
      bathrooms: 2,
      floors: 1,
      carport: 1,
      electricity: '2200 VA',
      waterSource: 'PDAM',
      certificateType: 'SHM',
      certificateNumber: '',
      pbgStatus: true,
      legalNotes: 'Sertifikat aman dan bebas sengketa.',
      marketplace: 'Rumah123',
      originalListingUrl: '',
      originalListingId: '',
      dateCollected: new Date().toISOString().split('T')[0],
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      propertyImages: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
      ],
      ownerId: owners[0]?.id || '',
      ownerName: owners[0]?.name || '',
      listingStatus: 'Ready to Market',
      agreementStatus: 'Draft',
      leadCount: 0,
      siteVisitCount: 0,
      viewsCount: 0,
      inquiriesCount: 0,
      potentialCommission: 21250000
    }
  );

  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'pricing' | 'specs' | 'legal' | 'source' | 'media' | 'owner'>('basic');

  const updateField = (field: keyof Property, val: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: val };
      // auto calculate price per sqm if askingPrice or landSize changes
      if (field === 'askingPrice' || field === 'landSize') {
        const price = Number(field === 'askingPrice' ? val : updated.askingPrice) || 0;
        const land = Number(field === 'landSize' ? val : updated.landSize) || 1;
        updated.pricePerSqm = Math.round(price / land);
        updated.potentialCommission = Math.round(price * 0.025);
      }
      return updated;
    });
  };

  const handleOwnerSelect = (ownerId: string) => {
    const owner = owners.find(o => o.id === ownerId);
    if (owner) {
      setFormData(prev => ({
        ...prev,
        ownerId: owner.id,
        ownerName: owner.name
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.askingPrice) {
      alert('Please fill out the Property Title and Asking Price.');
      return;
    }

    const completeProperty: Property = {
      id: initialData?.id || `prop-${Date.now()}`,
      code: formData.code || 'HN-001',
      title: formData.title,
      propertyType: (formData.propertyType as PropertyType) || 'House',
      description: formData.description || '',
      province: formData.province || 'D.I. Yogyakarta',
      city: formData.city || 'Sleman',
      district: formData.district || '',
      subdistrict: formData.subdistrict || '',
      address: formData.address || '',
      googleMapsUrl: formData.googleMapsUrl || '',
      askingPrice: Number(formData.askingPrice) || 0,
      minimumNegotiablePrice: Number(formData.minimumNegotiablePrice) || 0,
      pricePerSqm: Number(formData.pricePerSqm) || 0,
      landSize: Number(formData.landSize) || 0,
      buildingSize: Number(formData.buildingSize) || 0,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      floors: Number(formData.floors) || 1,
      carport: Number(formData.carport) || 1,
      electricity: formData.electricity || '2200 VA',
      waterSource: formData.waterSource || 'PDAM',
      certificateType: formData.certificateType || 'SHM',
      certificateNumber: formData.certificateNumber || '',
      pbgStatus: formData.pbgStatus ?? true,
      legalNotes: formData.legalNotes || '',
      marketplace: formData.marketplace || 'Direct Owner',
      originalListingUrl: formData.originalListingUrl || '',
      originalListingId: formData.originalListingId || '',
      dateCollected: formData.dateCollected || new Date().toISOString().split('T')[0],
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      propertyImages: formData.propertyImages || [],
      ownerId: formData.ownerId || (owners[0]?.id || 'cnt-1'),
      ownerName: formData.ownerName || (owners[0]?.name || 'Owner'),
      listingStatus: (formData.listingStatus as ListingStatus) || 'Prospect',
      agreementStatus: (formData.agreementStatus as AgreementStatus) || 'Draft',
      leadCount: formData.leadCount || 0,
      siteVisitCount: formData.siteVisitCount || 0,
      viewsCount: formData.viewsCount || 0,
      inquiriesCount: formData.inquiriesCount || 0,
      potentialCommission: formData.potentialCommission || Math.round((Number(formData.askingPrice) || 0) * 0.025),
      createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0]
    };

    onSave(completeProperty);
  };

  const navSections = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'location', label: 'Location' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'specs', label: 'Specification' },
    { key: 'legal', label: 'Legal' },
    { key: 'source', label: 'Marketplace Source' },
    { key: 'media', label: 'Media & Photos' },
    { key: 'owner', label: 'Owner & Agreement' }
  ];

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 2xl:p-8">
      <Breadcrumb
        pageName={isEdit ? `Edit Property (${formData.code})` : "Add Property"}
        parentName="Properties"
        parentPath="/properties"
        onNavigate={onCancel}
        actions={
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 rounded-sm border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] dark:border-[#2E3A47] dark:bg-[#24303F] dark:text-[#8A99AD]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Navigation tabs for form sections */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-[#E2E8F0] dark:border-[#2E3A47] pb-1">
          {navSections.map(sec => (
            <button
              type="button"
              key={sec.key}
              onClick={() => setActiveTab(sec.key as any)}
              className={`px-3 py-2 text-xs font-semibold whitespace-nowrap rounded-t-sm transition-colors border-b-2 ${
                activeTab === sec.key 
                  ? 'border-[#3C50E0] text-[#3C50E0] dark:text-[#80CAEE] bg-[#3C50E0]/5' 
                  : 'border-transparent text-[#64748B] hover:text-[#1C2434] dark:text-[#8A99AD] dark:hover:text-white'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* SECTION: BASIC INFO */}
        {activeTab === 'basic' && (
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4">
            <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
              1. Basic Property Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Property Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => updateField('code', e.target.value)}
                  placeholder="e.g. HN-SLM-008"
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g. Rumah Modern Minimalis Dekat Kampus UGM"
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Property Type
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => updateField('propertyType', e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                >
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Shophouse">Shophouse</option>
                  <option value="Land">Land</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Listing Status
                </label>
                <select
                  value={formData.listingStatus}
                  onChange={(e) => updateField('listingStatus', e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                >
                  <option value="Prospect">Prospect</option>
                  <option value="Owner Contacted">Owner Contacted</option>
                  <option value="Agreement Pending">Agreement Pending</option>
                  <option value="Ready to Market">Ready to Market</option>
                  <option value="Published">Published</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Agreement Status
                </label>
                <select
                  value={formData.agreementStatus}
                  onChange={(e) => updateField('agreementStatus', e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                >
                  <option value="Draft">Draft</option>
                  <option value="Waiting Approval">Waiting Approval</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Description & Key Selling Points
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Deskripsikan fitur istimewa properti, akses jalan, lingkungan, dan potensi investasi..."
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: LOCATION */}
        {activeTab === 'location' && (
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4">
            <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
              2. Location Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Province
                </label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => updateField('province', e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  City / Regency *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="e.g. Sleman"
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  District (Kecamatan)
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  placeholder="e.g. Depok / Ngaglik"
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Subdistrict (Kelurahan)
                </label>
                <input
                  type="text"
                  value={formData.subdistrict}
                  onChange={(e) => updateField('subdistrict', e.target.value)}
                  placeholder="e.g. Condongcatur"
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Full Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Jl. Kaliurang KM 6.5, Gang Pandega Marta No. 12"
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Google Maps URL / Coordinates
                </label>
                <input
                  type="url"
                  value={formData.googleMapsUrl}
                  onChange={(e) => updateField('googleMapsUrl', e.target.value)}
                  placeholder="https://maps.google.com/?q=-7.7554,110.3789"
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: PRICING */}
        {activeTab === 'pricing' && (
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4">
            <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
              3. Pricing & Commission
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Asking Price (Rp) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.askingPrice}
                  onChange={(e) => updateField('askingPrice', Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] font-bold dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
                <span className="text-[10px] text-[#64748B] dark:text-[#8A99AD] mt-1 block">
                  Rp {Number(formData.askingPrice || 0).toLocaleString('id-ID')}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Minimum Negotiable Price (Rp)
                </label>
                <input
                  type="number"
                  value={formData.minimumNegotiablePrice}
                  onChange={(e) => updateField('minimumNegotiablePrice', Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
                <span className="text-[10px] text-[#64748B] dark:text-[#8A99AD] mt-1 block">
                  Rp {Number(formData.minimumNegotiablePrice || 0).toLocaleString('id-ID')}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Price per m² (Rp)
                </label>
                <input
                  type="number"
                  value={formData.pricePerSqm}
                  onChange={(e) => updateField('pricePerSqm', Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
                <span className="text-[10px] text-[#64748B] dark:text-[#8A99AD] mt-1 block">
                  Auto-calculated from Asking Price / Land Size
                </span>
              </div>

              <div className="md:col-span-3 rounded-sm bg-[#EFF2F7] dark:bg-[#1E293B] p-3 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1C2434] dark:text-white">Estimated Honey-an Commission (2.5%):</span>
                  <p className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">Standard agreed brokerage fee upon successful closing</p>
                </div>
                <div className="text-base font-extrabold text-[#3C50E0] dark:text-[#80CAEE]">
                  Rp {Number(formData.potentialCommission || 0).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: SPECIFICATIONS */}
        {activeTab === 'specs' && (
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4">
            <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
              4. Property Specifications
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Land Size (m²) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.landSize}
                  onChange={(e) => updateField('landSize', Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Building Size (m²)
                </label>
                <input
                  type="number"
                  value={formData.buildingSize}
                  onChange={(e) => updateField('buildingSize', Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Bedrooms (KT)
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => updateField('bedrooms', Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Bathrooms (KM)
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => updateField('bathrooms', Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Floors
                </label>
                <input
                  type="number"
                  value={formData.floors}
                  onChange={(e) => updateField('floors', Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Carport (Cars)
                </label>
                <input
                  type="number"
                  value={formData.carport}
                  onChange={(e) => updateField('carport', Number(e.target.value))}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Electricity
                </label>
                <input
                  type="text"
                  value={formData.electricity}
                  onChange={(e) => updateField('electricity', e.target.value)}
                  placeholder="e.g. 2200 VA"
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Water Source
                </label>
                <input
                  type="text"
                  value={formData.waterSource}
                  onChange={(e) => updateField('waterSource', e.target.value)}
                  placeholder="PDAM / Sumur Bor"
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: LEGAL */}
        {activeTab === 'legal' && (
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4">
            <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
              5. Legal & Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Certificate Type
                </label>
                <select
                  value={formData.certificateType}
                  onChange={(e) => updateField('certificateType', e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                >
                  <option value="SHM">SHM (Sertifikat Hak Milik)</option>
                  <option value="HGB">HGB (Hak Guna Bangunan)</option>
                  <option value="Letter C">Letter C / Girik</option>
                  <option value="Strata Title">Strata Title</option>
                  <option value="AJB">AJB (Akta Jual Beli)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Certificate Number
                </label>
                <input
                  type="text"
                  value={formData.certificateNumber}
                  onChange={(e) => updateField('certificateNumber', e.target.value)}
                  placeholder="e.g. SHM No. 04812/Condongcatur"
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Building Permit (PBG / IMB)
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-1.5 text-xs text-[#1C2434] dark:text-white cursor-pointer">
                    <input
                      type="radio"
                      name="pbg"
                      checked={formData.pbgStatus === true}
                      onChange={() => updateField('pbgStatus', true)}
                      className="accent-[#3C50E0]"
                    />
                    <span>Available / Complete</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#1C2434] dark:text-white cursor-pointer">
                    <input
                      type="radio"
                      name="pbg"
                      checked={formData.pbgStatus === false}
                      onChange={() => updateField('pbgStatus', false)}
                      className="accent-[#3C50E0]"
                    />
                    <span>None / In Process</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Legal Notes & Verification Status
                </label>
                <textarea
                  rows={2}
                  value={formData.legalNotes}
                  onChange={(e) => updateField('legalNotes', e.target.value)}
                  placeholder="Catatan keabsahan sertifikat, kesesuaian nama pemilik di KTP, status royalti/waris..."
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: MARKETPLACE SOURCE */}
        {activeTab === 'source' && (
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4">
            <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
              6. Marketplace & Ingestion Source
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Source Platform
                </label>
                <select
                  value={formData.marketplace}
                  onChange={(e) => updateField('marketplace', e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                >
                  <option value="Rumah123">Rumah123</option>
                  <option value="OLX">OLX</option>
                  <option value="Lamudi">Lamudi</option>
                  <option value="Facebook Marketplace">Facebook Marketplace</option>
                  <option value="Direct Owner">Direct Owner</option>
                  <option value="Agent Network">Agent Network</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Original Listing ID
                </label>
                <input
                  type="text"
                  value={formData.originalListingId}
                  onChange={(e) => updateField('originalListingId', e.target.value)}
                  placeholder="e.g. R123-992384"
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Date Collected
                </label>
                <input
                  type="date"
                  value={formData.dateCollected}
                  onChange={(e) => updateField('dateCollected', e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Original Listing URL
                </label>
                <input
                  type="url"
                  value={formData.originalListingUrl}
                  onChange={(e) => updateField('originalListingUrl', e.target.value)}
                  placeholder="https://rumah123.com/listing/..."
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: MEDIA */}
        {activeTab === 'media' && (
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4">
            <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
              7. Media & Photo Assets
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Primary Cover Image URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => updateField('coverImage', e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>
              {formData.coverImage && (
                <div className="mt-3">
                  <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] block mb-1">Preview:</span>
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="h-44 w-72 rounded-sm object-cover border border-[#E2E8F0] dark:border-[#2E3A47]"
                  />
                </div>
              )}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                Additional Gallery Image URLs (one per line)
              </label>
              <textarea
                rows={3}
                value={(formData.propertyImages || []).join('\n')}
                onChange={(e) => updateField('propertyImages', e.target.value.split('\n').filter(Boolean))}
                placeholder="https://..."
                className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs font-mono text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
              />
            </div>
          </div>
        )}

        {/* SECTION: OWNER */}
        {activeTab === 'owner' && (
          <div className="rounded-sm border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] space-y-4">
            <h3 className="text-sm font-bold text-[#1C2434] dark:text-white border-b border-[#E2E8F0] pb-2 dark:border-[#2E3A47]">
              8. Owner Assignment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Select Existing Owner
                </label>
                <select
                  value={formData.ownerId}
                  onChange={(e) => handleOwnerSelect(e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white font-medium"
                >
                  {owners.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.type}) - WA: +{o.whatsapp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2434] dark:text-white mb-1.5">
                  Owner Display Name
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => updateField('ownerName', e.target.value)}
                  className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions Bottom Bar */}
        <div className="flex items-center justify-between rounded-sm border border-[#E2E8F0] bg-white p-4 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
          <div className="flex items-center gap-2">
            {navSections.findIndex(s => s.key === activeTab) > 0 && (
              <button
                type="button"
                onClick={() => {
                  const currIdx = navSections.findIndex(s => s.key === activeTab);
                  setActiveTab(navSections[currIdx - 1].key as any);
                }}
                className="rounded-sm border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] dark:border-[#2E3A47] dark:text-[#8A99AD]"
              >
                Previous Step
              </button>
            )}
            {navSections.findIndex(s => s.key === activeTab) < navSections.length - 1 && (
              <button
                type="button"
                onClick={() => {
                  const currIdx = navSections.findIndex(s => s.key === activeTab);
                  setActiveTab(navSections[currIdx + 1].key as any);
                }}
                className="rounded-sm bg-[#3C50E0]/10 px-3 py-1.5 text-xs font-semibold text-[#3C50E0] hover:bg-[#3C50E0]/20 dark:text-[#80CAEE]"
              >
                Next Step
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-sm border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] dark:border-[#2E3A47] dark:text-[#8A99AD]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#2e40c7] transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Save Changes' : 'Create Listing'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
