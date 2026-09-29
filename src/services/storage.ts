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
  PropertyMatchResult
} from '../types';

import {
  initialProperties,
  initialContacts,
  initialAgreements,
  initialLeads,
  initialFollowups,
  initialSiteVisits,
  initialBookings,
  initialClosings,
  initialCommissions,
  initialPublishing,
  initialCampaigns
} from './mockData';

const STORAGE_KEYS = {
  PROPERTIES: 'honeyan_properties_v1',
  CONTACTS: 'honeyan_contacts_v1',
  AGREEMENTS: 'honeyan_agreements_v1',
  LEADS: 'honeyan_leads_v1',
  FOLLOWUPS: 'honeyan_followups_v1',
  SITE_VISITS: 'honeyan_site_visits_v1',
  BOOKINGS: 'honeyan_bookings_v1',
  CLOSINGS: 'honeyan_closings_v1',
  COMMISSIONS: 'honeyan_commissions_v1',
  PUBLISHING: 'honeyan_publishing_v1',
  CAMPAIGNS: 'honeyan_campaigns_v1',
  THEME: 'honeyan_theme_v1'
};

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

export const HoneyStorage = {
  getProperties: (): Property[] => getItem(STORAGE_KEYS.PROPERTIES, initialProperties),
  saveProperties: (data: Property[]) => setItem(STORAGE_KEYS.PROPERTIES, data),

  getContacts: (): Contact[] => getItem(STORAGE_KEYS.CONTACTS, initialContacts),
  saveContacts: (data: Contact[]) => setItem(STORAGE_KEYS.CONTACTS, data),

  getAgreements: (): Agreement[] => getItem(STORAGE_KEYS.AGREEMENTS, initialAgreements),
  saveAgreements: (data: Agreement[]) => setItem(STORAGE_KEYS.AGREEMENTS, data),

  getLeads: (): Lead[] => getItem(STORAGE_KEYS.LEADS, initialLeads),
  saveLeads: (data: Lead[]) => setItem(STORAGE_KEYS.LEADS, data),

  getFollowups: (): FollowupActivity[] => getItem(STORAGE_KEYS.FOLLOWUPS, initialFollowups),
  saveFollowups: (data: FollowupActivity[]) => setItem(STORAGE_KEYS.FOLLOWUPS, data),

  getSiteVisits: (): SiteVisit[] => getItem(STORAGE_KEYS.SITE_VISITS, initialSiteVisits),
  saveSiteVisits: (data: SiteVisit[]) => setItem(STORAGE_KEYS.SITE_VISITS, data),

  getBookings: (): Booking[] => getItem(STORAGE_KEYS.BOOKINGS, initialBookings),
  saveBookings: (data: Booking[]) => setItem(STORAGE_KEYS.BOOKINGS, data),

  getClosings: (): Closing[] => getItem(STORAGE_KEYS.CLOSINGS, initialClosings),
  saveClosings: (data: Closing[]) => setItem(STORAGE_KEYS.CLOSINGS, data),

  getCommissions: (): CommissionRecord[] => getItem(STORAGE_KEYS.COMMISSIONS, initialCommissions),
  saveCommissions: (data: CommissionRecord[]) => setItem(STORAGE_KEYS.COMMISSIONS, data),

  getPublishing: (): PublishingRecord[] => getItem(STORAGE_KEYS.PUBLISHING, initialPublishing),
  savePublishing: (data: PublishingRecord[]) => setItem(STORAGE_KEYS.PUBLISHING, data),

  getCampaigns: (): Campaign[] => getItem(STORAGE_KEYS.CAMPAIGNS, initialCampaigns),
  saveCampaigns: (data: Campaign[]) => setItem(STORAGE_KEYS.CAMPAIGNS, data),

  getTheme: (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  },
  saveTheme: (theme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  resetAllData: () => {
    localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.AGREEMENTS);
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.FOLLOWUPS);
    localStorage.removeItem(STORAGE_KEYS.SITE_VISITS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.CLOSINGS);
    localStorage.removeItem(STORAGE_KEYS.COMMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.PUBLISHING);
    localStorage.removeItem(STORAGE_KEYS.CAMPAIGNS);
  }
};

/**
 * Deterministic Property Matching Engine
 * Compares Buyer Requirements vs Properties in database
 */
export function matchPropertiesForLead(lead: Lead, properties: Property[]): PropertyMatchResult[] {
  return properties
    .filter(p => p.listingStatus !== 'Sold' && p.listingStatus !== 'Inactive')
    .map(property => {
      let score = 0;
      const matchingCriteria: string[] = [];
      const missingCriteria: string[] = [];

      // 1. Price Budget Check (30 points)
      const buffer = 0.05; // 5% flexibility buffer
      const minAcceptable = lead.minBudget * (1 - buffer);
      const maxAcceptable = lead.maxBudget * (1 + buffer);

      if (property.askingPrice >= lead.minBudget && property.askingPrice <= lead.maxBudget) {
        score += 30;
        matchingCriteria.push(`Harga Rp ${Number(property.askingPrice).toLocaleString('id-ID')} masuk dalam rentang anggaran`);
      } else if (property.minimumNegotiablePrice <= lead.maxBudget && property.askingPrice >= minAcceptable) {
        score += 24;
        matchingCriteria.push(`Harga nego Rp ${Number(property.minimumNegotiablePrice).toLocaleString('id-ID')} masuk dalam budget maks`);
      } else if (property.askingPrice > lead.maxBudget) {
        missingCriteria.push(`Harga di atas budget maksimal (Selisih +Rp ${(property.askingPrice - lead.maxBudget).toLocaleString('id-ID')})`);
      } else {
        missingCriteria.push(`Harga di bawah rentang target buyer`);
      }

      // 2. Location Check (25 points)
      const targetLoc = (lead.preferredLocation || '').toLowerCase().trim();
      const propCity = property.city.toLowerCase();
      const propDistrict = property.district.toLowerCase();
      const propAddress = property.address.toLowerCase();

      if (
        propCity.includes(targetLoc) || 
        propDistrict.includes(targetLoc) || 
        propAddress.includes(targetLoc) || 
        targetLoc.includes(propCity) || 
        targetLoc.includes(propDistrict)
      ) {
        score += 25;
        matchingCriteria.push(`Lokasi tepat di area prioritas (${property.district}, ${property.city})`);
      } else {
        missingCriteria.push(`Lokasi ${property.city} tidak persis cocok dengan target ${lead.preferredLocation}`);
      }

      // 3. Property Type (15 points)
      if (lead.propertyType === 'Any' || property.propertyType.toLowerCase() === lead.propertyType.toLowerCase()) {
        score += 15;
        matchingCriteria.push(`Tipe properti ${property.propertyType} sesuai`);
      } else {
        missingCriteria.push(`Tipe properti ${property.propertyType} berbeda dengan incaran ${lead.propertyType}`);
      }

      // 4. Bedrooms Requirement (15 points)
      if (property.bedrooms >= lead.minBedrooms) {
        score += 15;
        matchingCriteria.push(`Kamar tidur (${property.bedrooms} KT) memenuhi minimal ${lead.minBedrooms} KT`);
      } else {
        missingCriteria.push(`Kamar tidur (${property.bedrooms} KT) kurang dari target ${lead.minBedrooms} KT`);
      }

      // 5. Land Size Requirement (10 points)
      if (property.landSize >= lead.minLandSize) {
        score += 10;
        matchingCriteria.push(`Luas tanah ${property.landSize} m² memenuhi minimal ${lead.minLandSize} m²`);
      } else {
        missingCriteria.push(`Luas tanah ${property.landSize} m² di bawah target ${lead.minLandSize} m²`);
      }

      // 6. Payment Compatibility (5 points)
      if (lead.paymentMethod === 'Cash') {
        score += 5;
        matchingCriteria.push('Kompatibel dengan pembayaran Cash');
      } else if (lead.paymentMethod === 'KPR' || lead.paymentMethod === 'Cash + KPR') {
        if (property.certificateType === 'SHM' && property.pbgStatus) {
          score += 5;
          matchingCriteria.push('Legalitas SHM & PBG lengkap, sangat ramah KPR Bank');
        } else {
          score += 2;
          missingCriteria.push(`Status sertifikat ${property.certificateType} butuh konfirmasi bank untuk KPR`);
        }
      }

      return {
        property,
        score,
        matchingCriteria,
        missingCriteria
      };
    })
    .sort((a, b) => b.score - a.score);
}
