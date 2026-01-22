// --- SERVICE TYPES ---
export type ServiceTypeId =
  | 'airport_transfer'
  | 'hourly_disposal'
  | 'city_to_city'
  | 'event_coverage'
  | 'wedding'
  | 'executive';

export type VehicleTypeId =
  | 'sedan_luxury'
  | 'suv_comfort'
  | 'van_group';

// --- TIER TYPES ---
export enum TierType {
  ESSENTIALS = 'essentials',
  SIGNATURE = 'signature',
  ELITE = 'elite'
}

export interface RouteInfo {
  distance: number;
  duration: number;
  mapUrl: string;
}

export interface PriceBreakdown {
  total: number;
  baseFare: number;
  distanceFare: number;
  nightSurcharge: number;
  stopFee: number; // New field for stop fees
  petFee: number;
  serviceMultiplier: number;
}

export interface BookingFormData {
  clientCode?: string;
  isVIP: boolean;
  // Contact Details
  name: string;
  email: string;
  countryCode: string; // New field for international prefix
  phone: string;

  // TIER-BASED SYSTEM (PRIMARY) - Optional for backward compatibility
  tier?: TierType | null;
  hours?: number; // Duration of assignment in hours
  hourlyRate?: number; // €180 (Essentials), €280 (Signature), or €6000/month (Elite)

  // TIER-BASED: Free description (replaces pickup/destination)
  assistanceDescription?: string; // What needs to be managed/coordinated

  // LEGACY: Maintained for backward compatibility
  serviceType: ServiceTypeId | null;
  pickupLocation: string;
  stops: string[]; // New field for extra stops
  destination: string;
  date: string;
  time: string;
  duration: number; // Duration in minutes (Crucial for overbooking check)
  passengers: number;
  vehiclePreference: VehicleTypeId | null;
  specialRequests: string;

  // New Fields
  contactMethod: 'whatsapp' | 'sms' | 'call';
  paymentMethod: 'link' | 'pos' | 'cash';
  hasPets: boolean;

  estimatedPrice: number;
  priceBreakdown: PriceBreakdown; // Store detailed pricing
}

export interface BookingRecord extends BookingFormData {
  id: string;
  status: 'pending' | 'confirmed' | 'declined' | 'rescheduled' | 'cancelled';
  timestamp?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface LocationSuggestion {
  description: string;
  place_id?: string;
}