import { supabase } from './supabaseClient';
import { BookingRecord } from '../types';

/**
 * Stripe Service
 * Orchestrates payment link generation and status updates
 */
export const stripeService = {
    /**
     * Calls the create-proposal-payment Edge Function to generate a Stripe link
     */
    async createProposalPayment(booking: BookingRecord): Promise<{ url: string; error?: string }> {
        try {
            const { data, error } = await supabase.functions.invoke('create-proposal-payment', {
                body: {
                    bookingId: booking.id,
                    amount: booking.estimatedPrice,
                    customerEmail: booking.email,
                    customerName: booking.name,
                    description: `Incarico Fiduciario Insolito Privé - ${booking.date}`,
                    // ⚠️ NUOVI CAMPI per tier-based pricing:
                    tier: booking.tier || null,
                    hours: booking.hours || null
                }
            });

            if (error) {
                console.error('Edge Function error:', error);
                return { url: '', error: error.message };
            }

            return { url: data.url };
        } catch (err) {
            console.error('Stripe service error:', err);
            return { url: '', error: 'Failed to generate payment proposal' };
        }
    }
};
