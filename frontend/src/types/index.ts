export type PropertyType = 'House' | 'Villa' | 'Apartment' | 'Shophouse' | 'Land' | 'Commercial';

export type ListingStatus = 
  | 'Prospect' 
  | 'Owner Contacted' 
  | 'Agreement Pending' 
  | 'Ready to Market' 
  | 'Published' 
  | 'Reserved' 
  | 'Sold' 
  | 'Inactive';

export type AgreementStatus = 
  | 'Draft' 
  | 'Waiting Approval' 
  | 'Active' 
  | 'Expired' 
  | 'Closed';

export type LeadTemperature = 'Hot' | 'Warm' | 'Cold';

export type PipelineStage = 
  | 'New' 
  | 'Contacted' 
  | 'Qualified' 
  | 'Property Suggested' 
  | 'Site Visit' 
  | 'Negotiation' 
  | 'Booking' 
  | 'Closed Won' 
  | 'Closed Lost';

export type PaymentMethod = 'Cash' | 'KPR' | 'Cash + KPR';
export type BuyingPurpose = 'Own Stay' | 'Investment';
export type PurchaseTimeline = 'Immediate' | '< 1 Month' | '< 3 Months' | '3-6 Months' | 'Exploring';

export interface Property {
  id: string;
  code: string;
  title: string;
  propertyType: PropertyType;
  description: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  address: string;
  googleMapsUrl: string;
  askingPrice: number;
  minimumNegotiablePrice: number;
  pricePerSqm: number;
  landSize: number;
  buildingSize: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  carport: number;
  electricity: string;
  waterSource: string;
  certificateType: 'SHM' | 'HGB' | 'Letter C' | 'Strata Title' | 'AJB';
  certificateNumber: string;
  pbgStatus: boolean;
  legalNotes: string;
  marketplace: 'Rumah123' | 'OLX' | 'Lamudi' | 'Facebook Marketplace' | 'Direct Owner' | 'Agent Network';
  originalListingUrl: string;
  originalListingId: string;
  dateCollected: string;
  coverImage: string;
  propertyImages: string[];
  ownerId: string;
  ownerName: string;
  listingStatus: ListingStatus;
  agreementStatus: AgreementStatus | 'No Agreement';
  leadCount: number;
  siteVisitCount: number;
  viewsCount: number;
  inquiriesCount: number;
  potentialCommission: number;
  createdAt: string;
}

export interface Contact {
  id: string;
  type: 'Owner' | 'Agent';
  name: string;
  whatsapp: string;
  phone: string;
  email: string;
  propertiesCount: number;
  activeAgreementsCount: number;
  lastContact: string;
  status: 'Active' | 'Follow Up' | 'Cold' | 'Blacklisted';
  notes: string;
  communicationHistory: {
    id: string;
    date: string;
    channel: string;
    summary: string;
    agent: string;
  }[];
}

export interface Agreement {
  id: string;
  code: string;
  propertyId: string;
  propertyTitle: string;
  propertyCode: string;
  ownerId: string;
  ownerName: string;
  agreementDate: string;
  expiryDate: string;
  commissionType: 'Percentage' | 'Fixed';
  commissionValue: number;
  leadProtectionPeriodDays: number;
  notes: string;
  documentUrl?: string;
  status: AgreementStatus;
  createdAt: string;
}

export type ContentAngle = 
  | 'New Listing' 
  | 'Price Highlight' 
  | 'Family Home' 
  | 'Strategic Location' 
  | 'First Home Buyer' 
  | 'Investment' 
  | 'KPR Friendly' 
  | 'Price Drop' 
  | 'Property Comparison';

export interface MarketingContent {
  id: string;
  propertyId: string;
  propertyTitle: string;
  angle: ContentAngle;
  headline: string;
  facebookPost: string;
  instagramCaption: string;
  cta: string;
  hashtags: string[];
  shortVideoScript: string;
  createdAt: string;
}

export interface PublishingRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  channel: 'Facebook Page' | 'Instagram' | 'TikTok' | 'WhatsApp Channel' | 'Website';
  campaignName: string;
  publishDate: string;
  status: 'Draft' | 'Scheduled' | 'Published' | 'Failed';
  leadsGenerated: number;
  contentSnippet: string;
  externalPostUrl?: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'Meta Ads (FB/IG)' | 'Organic Social' | 'Google Search' | 'WhatsApp Blast' | 'Agent Referral';
  startDate: string;
  endDate: string;
  properties: string[];
  contentAngle: string;
  leadCount: number;
  siteVisitCount: number;
  closedDeals: number;
  budget: number;
}

export interface Lead {
  id: string;
  buyerName: string;
  whatsapp: string;
  email: string;
  interestedPropertyId: string;
  interestedPropertyTitle: string;
  source: 'Facebook Ads' | 'Instagram Ads' | 'WhatsApp Inbound' | 'TikTok Organic' | 'Marketplace Lead' | 'Referral';
  campaign: string;
  leadTemperature: LeadTemperature;
  pipelineStage: PipelineStage;
  assignedSales: string;
  lastActivity: string;
  createdAt: string;
  notes: string;
  // Qualification criteria
  minBudget: number;
  maxBudget: number;
  preferredLocation: string;
  propertyType: PropertyType | 'Any';
  minBedrooms: number;
  minLandSize: number;
  paymentMethod: PaymentMethod;
  buyingPurpose: BuyingPurpose;
  purchaseTimeline: PurchaseTimeline;
}

export interface FollowupActivity {
  id: string;
  leadId: string;
  leadName: string;
  assignedSales: string;
  activityType: 'WhatsApp' | 'Call' | 'Follow-up' | 'Negotiation';
  scheduledDate: string;
  status: 'Pending' | 'Completed' | 'Rescheduled' | 'Cancelled';
  notes: string;
}

export interface SiteVisit {
  id: string;
  leadId: string;
  buyerName: string;
  buyerPhone: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  schedule: string;
  sales: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show';
  notes: string;
  buyerFeedback: string;
}

export interface Booking {
  id: string;
  leadId: string;
  buyerName: string;
  propertyId: string;
  propertyTitle: string;
  bookingDate: string;
  bookingAmount: number;
  status: 'Active' | 'Refunded' | 'Transferred' | 'Converted to Closing';
  receiptNumber: string;
}

export interface Closing {
  id: string;
  propertyId: string;
  propertyTitle: string;
  leadId: string;
  buyerName: string;
  askingPrice: number;
  finalSellingPrice: number;
  closingDate: string;
  commission: number;
  status: 'Pending Notary' | 'PPJB Signed' | 'AJB Signed' | 'Closed Won';
}

export interface CommissionRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  ownerName: string;
  buyerName: string;
  sellingPrice: number;
  commissionType: 'Percentage' | 'Fixed';
  commissionValue: number;
  earnedAmount: number;
  earnedDate: string;
  paymentStatus: 'Potential' | 'Earned' | 'Invoiced' | 'Paid';
  invoiceNumber?: string;
}

export interface PropertyMatchResult {
  property: Property;
  score: number;
  matchingCriteria: string[];
  missingCriteria: string[];
}
