import { BookingRecord } from '../types';

// --- VERSION: 1.0.1 (GOLD STANDARD) ---

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
 * Send decline notification to client
 */
export const sendClientDecline = async (booking: BookingRecord): Promise<boolean> => {
  const html = `
    <div style="font-family: serif; color: #1a1a1a; padding: 40px; text-align: center; border: 1px solid #eee;">
      <h1 style="letter-spacing: 3px; font-style: italic;">INSOLITO PRIVÉ</h1>
      <p style="font-size: 16px; margin-top: 40px;">Egregio <strong>${booking.name}</strong>,</p>
      <p>La ringraziamo per aver preso in considerazione il nostro Club fiduciario.</p>
      <p style="margin: 30px 0;">Siamo spiacenti di doverLa informare che in data <strong>${booking.date}</strong> non disponiamo della capacità logistica necessaria per soddisfare i Suoi standard requisiti.</p>
      <p style="font-size: 12px; color: #666; font-style: italic;">L'esclusività risiede anche nella trasparenza del limite.</p>
    </div>
  `;

  return await dispatchEmail({
    to: booking.email,
    subject: `AGGIORNAMENTO PROTOCOLLO | INSOLITO PRIVÉ`,
    html
  });
};

/**
 * Send Fiduciary Proposal with Stripe Link (Phase 26)
 */
export const sendFiduciaryProposal = async (booking: BookingRecord): Promise<boolean> => {
  if (!booking.stripeLink) {
    console.error('❌ Proposta non inviabile: manca il link di pagamento Stripe.');
    return false;
  }

  const html = `
    <div style="font-family: 'Playfair Display', serif; color: #000; padding: 50px; background: #fff; border: 1px solid #D4AF37;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="letter-spacing: 5px; font-weight: 300; margin: 0;">INSOLITO PRIVÉ</h1>
        <p style="letter-spacing: 2px; font-size: 10px; color: #D4AF37; text-transform: uppercase;">The Guardian of your Lifestyle</p>
      </div>
      
      <p style="font-size: 16px;">Egregio <strong>${booking.name}</strong>,</p>
      <p>In merito alla Sua richiesta del <strong>${booking.date} @ ${booking.time}</strong>, abbiamo il piacere di sottoporLe la Proposta Fiduciaria definitiva.</p>
      
      <div style="background: #fafafa; padding: 30px; border-left: 2px solid #D4AF37; margin: 40px 0;">
        <p style="font-size: 14px; text-transform: uppercase; color: #888; margin-bottom: 10px;">Mandato d'Ufficio</p>
        <p><strong>Servizio:</strong> ${booking.tier ? `Tier ${booking.tier.toUpperCase()}` : booking.serviceType}</p>
        <p><strong>Onorario Professionale:</strong> €${booking.estimatedPrice}</p>
      </div>

      <div style="text-align: center; margin: 50px 0;">
        <a href="${booking.stripeLink}" style="background: #000; color: #D4AF37; padding: 20px 40px; text-decoration: none; font-size: 14px; font-weight: bold; letter-spacing: 2px; border: 1px solid #D4AF37;">
          SOTTOSCRIVI IL MANDATO (STRIPE)
        </a>
      </div>

      <p style="font-size: 13px; color: #666; line-height: 1.6;">
        La sottoscrizione tramite il link protetto Stripe costituisce accettazione formale del mandato e garantisce la priorità assoluta per la fascia oraria indicata.
      </p>
      
      <div style="margin-top: 60px; border-top: 1px solid #eee; padding-top: 20px; font-size: 11px; color: #999;">
        <p>Michael Jara | Lifestyle Guardian</p>
        <p>Milano - London - Dubai</p>
      </div>
    </div>
  `;

  return await dispatchEmail({
    to: booking.email,
    subject: `PROPOSTA FIDUCIARIA: Incarico del ${booking.date}`,
    html
  });
};

/**
 * Send Completion and Oblivion notification (Phase 26)
 */
export const sendCompletionAndOblivion = async (booking: BookingRecord): Promise<boolean> => {
  const html = `
    <div style="font-family: serif; color: #fff; background: #000; padding: 60px; text-align: center;">
      <h1 style="letter-spacing: 5px; font-style: italic; color: #D4AF37;">INSOLITO PRIVÉ</h1>
      <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 4px; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 40px;">Certificato di Oblio Logistico</h2>
      <p style="font-size: 16px; color: #ccc;">Egregio <strong>${booking.name}</strong>,</p>
      <p style="color: #888;">Il mandato del <strong>${booking.date}</strong> è stato eseguito con successo.</p>
      <p style="margin: 40px 0; color: #ccc; font-style: italic; line-height: 1.8;">
        "Il vero lusso conclude se stesso nel silenzio."<br>
        Come da protocollo fiduciario, i Suoi dati logistici sono stati rimossi dai nostri sistemi operativi attivi.
      </p>
      <p style="font-size: 12px; color: #555;">Speriamo di aver servito i Suoi standard con la dovuta discrezione.</p>
    </div>
  `;

  return await dispatchEmail({
    to: booking.email,
    subject: `COMPLETAMENTO MANDATO | INSOLITO PRIVÉ`,
    html
  });
};

/**
 * Send modification/reschedule request to client (Weather/Technical)
 */
export const sendModificationRequest = async (booking: BookingRecord, customReason?: string): Promise<boolean> => {
  const html = `
    <div style="font-family: serif; color: #1a1a1a; padding: 40px; border: 1px solid #D4AF37; background: #fff;">
      <h1 style="text-align: center; letter-spacing: 3px; font-style: italic;">INSOLITO PRIVÉ</h1>
      <p style="font-size: 16px; margin-top: 40px;">Egregio <strong>${booking.name}</strong>,</p>
      <p>La contattiamo in merito al mandato previsto per il <strong>${booking.date} @ ${booking.time}</strong>.</p>
      
      <div style="background: #fff9e6; padding: 20px; border-left: 4px solid #D4AF37; margin: 30px 0;">
        <p style="font-weight: bold; margin-bottom: 10px;">Comunicazione di Servizio:</p>
        <p style="font-style: italic;">${customReason || "A causa di variabili logistiche esterne (condizioni meteo avverse o criticità stradali improvvise), siamo costretti a richiederLe una ricalibrazione dell'orario o della data del mandato."}</p>
      </div>

      <p>Il Suo Guardian La contatterà a breve via WhatsApp per coordinare la nuova pianificazione fiduciaria.</p>
      
      <p style="font-size: 12px; color: #666; font-style: italic; margin-top: 40px;">"La sicurezza è il primo pilastro dell'esclusività."</p>
    </div>
  `;

  return await dispatchEmail({
    to: booking.email,
    subject: `REVISIONE LOGISTICA: Protocollo ${booking.id?.slice(-6).toUpperCase()}`,
    html
  });
};
