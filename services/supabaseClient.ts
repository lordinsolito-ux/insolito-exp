import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
    return !!(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_'));
};

// Database types matching our schema
export interface BookingRow {
    id: string;
    created_at: string;
    status: string;

    // Client Info
    name: string;
    email: string;
    phone: string;
    country_code: string;

    // Service Details
    service_type: string;
    pickup_location: string;
    destination: string;
    stops: string[] | null;
    date: string;
    time: string;
    duration: number;
    passengers: number;

    // Extras
    has_pets: boolean;
    special_requests: string | null;
    payment_method: string;
    estimated_price: number;

    // Metadata
    vehicle_preference: string | null;
    contact_method: string;
    is_vip: boolean;
    stripe_link: string | null;
    attachment_urls: string[] | null;
    accepted_terms: boolean;
    accepted_contract: boolean;
    accepted_waiver: boolean;
    legal_acceptance_timestamp: string | null;
}

// Helper to convert DB row to BookingRecord
export const rowToBookingRecord = (row: BookingRow): any => ({
    id: row.id,
    timestamp: row.created_at,
    status: row.status,
    name: row.name,
    email: row.email,
    phone: row.phone,
    countryCode: row.country_code,
    serviceType: row.service_type,
    pickupLocation: row.pickup_location,
    destination: row.destination,
    stops: row.stops || [],
    date: row.date,
    time: row.time,
    duration: row.duration,
    hours: Math.floor(row.duration / 60), // Derived or explicit
    passengers: row.passengers,
    hasPets: row.has_pets,
    specialRequests: row.special_requests || '',
    paymentMethod: row.payment_method,
    estimatedPrice: row.estimated_price,
    vehiclePreference: row.vehicle_preference,
    contactMethod: row.contact_method,
    isVIP: row.is_vip,
    stripeLink: row.stripe_link || undefined,
    attachmentUrls: row.attachment_urls || [],
    acceptedTerms: !!row.accepted_terms,
    acceptedContract: !!row.accepted_contract,
    acceptedWaiver: !!row.accepted_waiver,
    legalAcceptanceTimestamp: row.legal_acceptance_timestamp || undefined,
});

// Helper to convert BookingRecord to DB row format
export const bookingToRow = (booking: any): Partial<BookingRow> => ({
    id: booking.id || Date.now().toString(),
    status: booking.status || 'requested',
    name: booking.name || 'Anonymous',
    email: booking.email || '',
    phone: booking.phone || '',
    country_code: booking.countryCode || '+39',
    service_type: booking.serviceType || 'lifestyle_management',
    pickup_location: booking.pickupLocation || '',
    destination: booking.destination || '',
    stops: booking.stops?.length > 0 ? booking.stops : null,
    date: booking.date || new Date().toISOString().split('T')[0],
    time: booking.time || '00:00',
    duration: booking.duration || 60,
    passengers: booking.passengers || 1,
    has_pets: booking.hasPets || false,
    special_requests: booking.specialRequests || null,
    payment_method: booking.paymentMethod || 'cash',
    estimated_price: booking.estimatedPrice || 0,
    vehicle_preference: booking.vehiclePreference || null,
    contact_method: booking.contactMethod || 'whatsapp',
    is_vip: booking.isVIP || false,
    stripe_link: booking.stripeLink || null,
    attachment_urls: booking.attachmentUrls?.length ? booking.attachmentUrls : null,
    accepted_terms: booking.acceptedTerms || false,
    accepted_contract: booking.acceptedContract || false,
    accepted_waiver: booking.acceptedWaiver || false,
    legal_acceptance_timestamp: booking.legalAcceptanceTimestamp || new Date().toISOString(),
});
