import { BookingRecord } from '../types';

// --- CONFIGURATION ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const EDGE_FUNCTION_NAME = 'send-notification';
const ADMIN_EMAIL = 'insolitoprive@gmail.com';

/**
 * Technical Dispatcher for Notifications
 * Routes the email payload through the secure Edge Function to bypass CORS.
 */
async function dispatchEmail(payload: { to: string, subject: string, html: string }): Promise<boolean> {
  console.log('💎 Dispatching notification via The Guardian Engine...');

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${EDGE_FUNCTION_NAME}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn('⚠️ Guardian Engine Notice: Function endpoint reached but returned an error. Ensure the Edge Function is deployed and configured.');
      return false;
    }

    console.log('✅ Email dispatched successfully.');
    return true;
  } catch (error) {
    console.error('❌ Guardian Engine Connection Failed:', error);
    console.info('💡 Note: This is due to browser CORS or the Supabase project not having the function deployed.');
    return false;
  }
}

/**
 * Send new booking notification to admin
 */
export const sendAdminNotification = async (booking: BookingRecord): Promise<boolean> => {
  const html = `
    <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; padding: 40px; background: #fafafa; border: 1px solid #ddd;">
      <h1 style="color: #D4AF37; font-style: italic; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">Nuovo Mandato Fiduciario</h1>
      <p style="font-size: 16px;">Egregio Guardian, un nuovo protocollo è stato sottoscritto da <strong>${booking.name}</strong>.</p>
      <div style="background: white; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0;">
        <p><strong>Servizio:</strong> ${booking.tier || booking.serviceType}</p>
        <p><strong>Pianificazione:</strong> ${booking.date} @ ${booking.time}</p>
        <p><strong>Onorario Stimato:</strong> €${booking.estimatedPrice}</p>
      </div>
      <p style="margin-top: 30px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 15px;">
        Accedere alla Dashboard God Mode per l'analisi di fattibilità logistica.
      </p>
    </div>
  `;

  return await dispatchEmail({
    to: ADMIN_EMAIL,
    subject: `[MANDATO] ${booking.name} - ${booking.date}`,
    html
  });
};

/**
 * Send booking confirmation to client
 */
export const sendClientConfirmation = async (booking: BookingRecord): Promise<boolean> => {
  const bookingCode = booking.id?.slice(-6).toUpperCase() || 'REF-PENDING';

  const html = `
    <div style="font-family: serif; color: #000; padding: 40px; text-align: center;">
      <h1 style="letter-spacing: 3px; font-style: italic;">INSOLITO PRIVÉ</h1>
      <h2 style="color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 5px; margin-bottom: 40px;">Protocollo Confermato</h2>
      <p style="font-size: 16px;">Egregio <strong>${booking.name}</strong>,</p>
      <p>Il Suo mandato per il <strong>${booking.date} @ ${booking.time}</strong> è stato acquisito con successo.</p>
      <div style="margin: 40px 0; padding: 20px; border: 1px solid #eee;">
        <p style="font-size: 10px; color: #999; text-transform: uppercase;">Reference Code</p>
        <p style="font-size: 24px; letter-spacing: 10px; font-weight: bold;">${bookingCode}</p>
      </div>
      <p style="font-size: 12px; color: #666; font-style: italic;">Il vero lusso è il silenzio della certezza.</p>
    </div>
  `;

  return await dispatchEmail({
    to: booking.email,
    subject: `CONFIRMATION: ${bookingCode} | INSOLITO PRIVÉ`,
    html
  });
};

/**
 * Additional service functions can be added here following the same dispatch pattern.
 */
export const sendClientDecline = async (booking: BookingRecord) => {
  // Implementation similar to above...
  return false;
};

export const sendFiduciaryProposal = async (booking: BookingRecord) => {
  // Implementation similar to above...
  return false;
};

export const sendCompletionAndOblivion = async (booking: BookingRecord) => {
  // Implementation similar to above...
  return false;
};
