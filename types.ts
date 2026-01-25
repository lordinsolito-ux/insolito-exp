
import { LucideIcon } from 'lucide-react';

// TIER-BASED SYSTEM (Essentials/Signature/Elite)
export enum TierType {
  ESSENTIALS = 'essentials',
  SIGNATURE = 'signature',
  ELITE = 'elite'
}

export interface TierInfo {
  type: TierType;
  hours: number;
  hourlyRate: number;
  totalPrice: number;
  minHours: number;
}

// LEGACY: Maintained for backward compatibility during migration
export enum ServiceTypeId {
  AIRPORT_TRANSFER = 'airport_transfer',
  HOURLY = 'hourly',
  CITY_TO_CITY = 'city_to_city',
  EVENT = 'event',
  WEDDING = 'wedding',
  EXECUTIVE = 'executive'
}

export enum VehicleTypeId {
  SUV_COMFORT = 'suv_comfort' // Changed to generic premium SUV
}

export interface ServiceType {
  id: ServiceTypeId;
  name: string;
  description: string;
  icon: LucideIcon;
  popular?: boolean;
  startingPrice?: number;
  badge?: string;
}

export interface VehicleType {
  id: VehicleTypeId;
  name: string;
  description: string;
  capacity: number;
  luggage: number;
  basePriceMultiplier: number; // Multiplier for the base rate
  imagePlaceholder: string;
}

export interface LocationSuggestion {
  id: string;
  shortAddress: string;
  fullAddress: string;
  type: 'airport' | 'city' | 'venue' | 'station' | 'landmark';
}

export interface RouteInfo {
  distance: number; // in km
  duration: number; // in minutes
  traffic: 'low' | 'moderate' | 'heavy';
  toll: boolean;
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

export type PaymentMethod = 'link' | 'pos' | 'cash' | 'credit_card' | 'stripe';

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
  assistanceDescription?: string; // Free-form description for tier-based bookings

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
  paymentMethod: PaymentMethod;
  hasPets: boolean;

  // Legal Compliance
  acceptedTerms: boolean; // General terms
  acceptedContract: boolean; // Contratto d'Opera
  acceptedWaiver: boolean; // Liberatoria/Manleva
  legalAcceptanceTimestamp?: string;

  attachments?: File[]; // Optional: support for mission-critical documents
  attachmentUrls?: string[]; // Public URLs for uploaded attachments
  estimatedPrice: number;
  priceBreakdown: PriceBreakdown; // Store detailed pricing
}

export interface BookingRecord extends BookingFormData {
  id: string;
  timestamp: string;
  status: 'requested' | 'proposed' | 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'declined' | 'rescheduled' | 'executed';
  needsInvoice?: boolean; // Optional: true if user needs formal invoice (fattura)
  stripeLink?: string; // New: payment link for proposals
}

export interface ValidationErrors {
  tier?: string;
  hours?: string;
  serviceType?: string;
  pickupLocation?: string;
  destination?: string;
  date?: string;
  time?: string;
  name?: string;
  email?: string;
  phone?: string;
  assistanceDescription?: string;
}