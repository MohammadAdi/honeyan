import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Eye, 
  ExternalLink, 
  Sparkles, 
  FileCheck2,
  Trash2,
  CheckCircle,
  Clock,
  ArrowUpDown,
  MoreVertical
} from 'lucide-react';
import { Property, ListingStatus, PropertyType } from '../../types';
import { Breadcrumb } from '../layout/Breadcrumb';
import { Badge, getListingStatusBadge } from '../common/Badge';

interface PropertyListProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigate: (path: string) => void;
  onDeleteProperty?: (id: string) => void;
  initialFilter?: string | null;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  onSelectProperty,
  onNavigate,
  onDeleteProperty,
  initialFilter
}) => {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedListingStatus, setSelectedListingStatus] = useState<string>(
    initialFilter === 'ready' ? 'Ready to Market' : initialFilter === 'published' ? 'Published' : 'All'
  );
  const [selectedAgreementStatus, setSelectedAgreementStatus] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  // Filter properties
  const filtered = properties.filter((prop) => {
    // Search
    if (search) {
      const q = search.toLowerCase();
      const match = 
        prop.title.toLowerCase().includes(q) ||
        prop.code.toLowerCase().includes(q) ||
        prop.district.toLowerCase().includes(q) ||
        prop.city.toLowerCase().includes(q) ||
        prop.ownerName.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Location
    if (selectedLocation !== 'All' && !prop.city.includes(selectedLocation)) return false;

    // Type
    if (selectedType !== 'All' && prop.propertyType !== selectedType) return false;

    // Source
    if (selectedSource !== 'All' && prop.marketplace !== selectedSource) return false;

    // Listing Status
    if (selectedListingStatus !== 'All' && prop.listingStatus !== selectedListingStatus) return false;

    // Agreement Status
    if (selectedAgreementStatus !== 'All' && prop.agreementStatus !== selectedAgreementStatus) return false;

    // Price Range
    if (priceRange === '< 1M' && prop.askingPrice >= 1000000000) return false;
    if (priceRange === '1M - 2M' && (prop.askingPrice < 1000000000 || prop.askingPrice > 2000000000)) return false;
    if (priceRange === '> 2M' && prop.askingPrice <= 2000000000) return false;

    return true;
  });

  const locations = Array.from(new Set(properties.map(p => p.city)));
  const sources = Array.from(new Set(properties.map(p => p.marketplace)));

  const formatPrice = (val: number) => `Rp ${Number(val).toLocaleString('id-ID')}`;

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        pageName="All Properties"
        actions={
          <button
            onClick={() => onNavigate('/properties/create')}
            className="inline-flex items-center gap-2 rounded-sm bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-opacity-90 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        }
      />

      {/* FILTERS CARD */}
      <div className="mb-6 rounded-sm border border-[#E2E8F0] bg-white p-4 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#8A99AD]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search code, title, owner, area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            />
          </div>

          {/* Location */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            >
              <option value="All">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            >
              <option value="All">All Types</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Shophouse">Shophouse</option>
              <option value="Land">Land</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            >
              <option value="All">All Prices</option>
              <option value="< 1M">&lt; Rp 1 Milyar</option>
              <option value="1M - 2M">Rp 1M - 2M</option>
              <option value="> 2M">&gt; Rp 2 Milyar</option>
            </select>
          </div>

          {/* Listing Status */}
          <div>
            <select
              value={selectedListingStatus}
              onChange={(e) => setSelectedListingStatus(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            >
              <option value="All">All Listing Statuses</option>
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

          {/* Agreement Status */}
          <div>
            <select
              value={selectedAgreementStatus}
              onChange={(e) => setSelectedAgreementStatus(e.target.value)}
              className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-3 text-xs text-[#1C2434] focus:border-[#3C50E0] focus:bg-white focus:outline-hidden dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white"
            >
              <option value="All">Agreement Status</option>
              <option value="Active">Active Agreement</option>
              <option value="Waiting Approval">Waiting Approval</option>
              <option value="Draft">Draft</option>
              <option value="No Agreement">No Agreement</option>
            </select>
          </div>
        </div>

        {/* Quick status tabs */}
        <div className="mt-3 pt-3 border-t border-[#E2E8F0] dark:border-[#2E3A47] flex items-center justify-between text-xs text-[#64748B] dark:text-[#8A99AD]">
          <span>Showing <strong className="text-[#1C2434] dark:text-white">{filtered.length}</strong> of {properties.length} properties</span>
          {(search || selectedLocation !== 'All' || selectedType !== 'All' || selectedListingStatus !== 'All' || priceRange !== 'All' || selectedAgreementStatus !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedLocation('All');
                setSelectedType('All');
                setSelectedSource('All');
                setSelectedListingStatus('All');
                setSelectedAgreementStatus('All');
                setPriceRange('All');
              }}
              className="text-[#3C50E0] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* PROPERTIES TABLE */}
      <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-[#1A222C] dark:text-[#8A99AD] font-semibold border-b border-[#E2E8F0] dark:border-[#2E3A47]">
              <tr>
                <th className="px-4 py-3.5">Code</th>
                <th className="px-4 py-3.5">Cover & Title</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-3 py-3.5">Type</th>
                <th className="px-4 py-3.5">Owner</th>
                <th className="px-3 py-3.5">Source</th>
                <th className="px-4 py-3.5">Listing Status</th>
                <th className="px-3 py-3.5">Agreement</th>
                <th className="px-3 py-3.5 text-center">Leads</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2E3A47]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-[#64748B] dark:text-[#8A99AD]">
                    <Building2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    No properties match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((prop) => (
                  <tr 
                    key={prop.id}
                    onClick={() => onSelectProperty(prop)}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A222C] transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-[#3C50E0] dark:text-[#80CAEE] whitespace-nowrap">
                      {prop.code}
                    </td>
                    <td className="px-4 py-3.5 max-w-[240px]">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={prop.coverImage} 
                          alt={prop.title}
                          className="h-10 w-12 rounded-xs object-cover shrink-0 border border-[#E2E8F0] dark:border-[#2E3A47]"
                        />
                        <div className="truncate">
                          <span className="font-semibold text-[#1C2434] dark:text-white line-clamp-1 block">
                            {prop.title}
                          </span>
                          <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD]">
                            LT {prop.landSize}m² · LB {prop.buildingSize}m² · {prop.bedrooms}KT/{prop.bathrooms}KM
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-[#1C2434] dark:text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#64748B]" />
                        {prop.district}
                      </div>
                      <span className="text-[11px] text-[#64748B] dark:text-[#8A99AD] pl-4">
                        {prop.city}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-bold text-[#1C2434] dark:text-white">
                        {formatPrice(prop.askingPrice)}
                      </div>
                      <span className="text-[10px] text-[#94A3B8]">
                        Min: {formatPrice(prop.minimumNegotiablePrice)}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-[#475569] dark:text-[#94A3B8]">
                        {prop.propertyType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-[#1C2434] dark:text-white">
                      {prop.ownerName}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-[#64748B] dark:text-[#8A99AD]">
                      {prop.marketplace}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getListingStatusBadge(prop.listingStatus)}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <Badge variant={prop.agreementStatus === 'Active' ? 'success' : prop.agreementStatus === 'Waiting Approval' ? 'warning' : 'neutral'} size="sm">
                        {prop.agreementStatus}
                      </Badge>
                    </td>
                    <td className="px-3 py-3.5 text-center font-bold text-[#3C50E0] dark:text-[#80CAEE]">
                      {prop.leadCount}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="rounded p-1.5 text-[#64748B] hover:text-[#3C50E0] hover:bg-[#F1F5F9] dark:hover:bg-[#2E3A47] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            onNavigate(`/marketing/content?propertyId=${prop.id}`);
                          }}
                          className="rounded p-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                          title="Generate AI Content"
                        >
                          <Sparkles className="w-4 h-4" />
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
    </div>
  );
};
