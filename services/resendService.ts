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
  const attachmentsHtml = booking.attachmentUrls?.length
    ? `<div style="margin-top: 30px; padding: 20px; background: #fafafa; border-top: 1px solid #D4AF37;">
        <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #888; letter-spacing: 1px;">Documentazione Allegata:</p>
        <ul style="list-style: none; padding: 0; margin: 10px 0;">
          ${booking.attachmentUrls.map((url, i) => `<li style="margin-bottom: 8px;"><a href="${url}" style="color: #D4AF37; text-decoration: none; font-size: 12px;">&rarr; Vedi Allegato ${i + 1}</a></li>`).join('')}
        </ul>
       </div>`
    : '';

  const html = `
    <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: 20px auto; padding: 60px; background: #ffffff; border: 1px solid #f0f0f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 50px;">
        <h1 style="letter-spacing: 8px; font-weight: 300; margin: 0; text-transform: uppercase; font-size: 24px;">INSOLITO PRIVÉ</h1>
        <div style="width: 30px; height: 1px; background: #D4AF37; margin: 20px auto;"></div>
        <p style="letter-spacing: 3px; font-size: 9px; color: #D4AF37; text-transform: uppercase;">Nuovo Mandato Fiduciario</p>
      </div>

      <p style="font-size: 15px; line-height: 1.8;">Egregio Guardian,</p>
      <p style="font-size: 15px; line-height: 1.8;">Un nuovo protocollo di assistenza è stato sottoscritto da <strong>${booking.name}</strong>.</p>
      
      <div style="margin: 40px 0; padding: 30px; border-left: 2px solid #D4AF37; background: #fdfdfd;">
        <p style="margin: 0 0 10px 0; font-size: 13px;"><strong>Servizio:</strong> ${booking.tier ? booking.tier.toUpperCase() : (booking.serviceType || 'Lifestyle Management')}</p>
        <p style="margin: 0 0 10px 0; font-size: 13px;"><strong>Pianificazione:</strong> ${booking.date} @ ${booking.time}</p>
        <p style="margin: 0 0 10px 0; font-size: 13px;"><strong>Durata Mandato:</strong> ${booking.hours || (booking.duration ? booking.duration / 60 : 0)} ORE</p>
        <p style="margin: 0; font-size: 13px;"><strong>Onorario Stimato:</strong> €${booking.estimatedPrice}</p>
      </div>

      ${attachmentsHtml}

      <div style="margin-top: 50px; text-align: center;">
        <p style="font-size: 11px; color: #999; font-style: italic;">Accedere alla Dashboard God Mode per l'analisi logistica.</p>
      </div>
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
  const firstName = booking.name.split(' ')[0];

  const html = `
    <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: 20px auto; padding: 60px; background: #ffffff; border: 1px solid #D4AF37; box-shadow: 0 20px 50px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 60px;">
        <h1 style="letter-spacing: 12px; font-weight: 300; margin: 0; text-transform: uppercase; font-size: 28px;">INSOLITO PRIVÉ</h1>
        <div style="width: 50px; height: 1px; background: #D4AF37; margin: 25px auto;"></div>
        <p style="letter-spacing: 4px; font-size: 10px; color: #D4AF37; text-transform: uppercase; font-style: italic;">The Guardian of your Lifestyle</p>
      </div>

      <p style="font-size: 18px; line-height: 1.8; margin-bottom: 30px;">Egregio <strong>${firstName}</strong>,</p>
      
      <p style="font-size: 15px; line-height: 1.8; color: #444;">
        È un onore confermarLe che il Suo mandato è stato acquisito con successo dai nostri protocolli riservati. In un mondo di rumore, la Sua scelta di affidarsi a <strong>Insolito Privé</strong> è un attestato di ricerca della perfezione logistica.
      </p>

      <div style="margin: 50px 0; padding: 40px; background: #fcfbf7; border: 1px solid #efece3; position: relative;">
        <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #888; margin-bottom: 25px; border-bottom: 1px solid #efece3; padding-bottom: 10px;">Dettaglio Protocollo</h3>
        <p style="margin: 0 0 15px 0; font-size: 14px;"><strong>Codice Riferimento:</strong> <span style="letter-spacing: 2px; color: #D4AF37;">${bookingCode}</span></p>
        <p style="margin: 0 0 15px 0; font-size: 14px;"><strong>Servizio:</strong> ${booking.tier ? booking.tier.toUpperCase() : (booking.serviceType || 'Lifestyle Management')}</p>
        <p style="margin: 0 0 15px 0; font-size: 14px;"><strong>Data & Ora:</strong> ${booking.date} @ ${booking.time}</p>
        <p style="margin: 0; font-size: 14px;"><strong>Onorario Stimato:</strong> €${booking.estimatedPrice}</p>
      </div>

      <div style="background: #000; color: #D4AF37; padding: 40px; text-align: center; margin-bottom: 50px;">
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; opacity: 0.8;">Privilegio Riservato</p>
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px; font-style: italic;">"La fedeltà merita di essere onorata."</p>
        <div style="border: 1px dashed #D4AF37; padding: 15px; display: inline-block; margin-bottom: 15px;">
          <span style="font-size: 18px; letter-spacing: 5px; font-weight: bold;">INSOLITO10</span>
        </div>
        <p style="font-size: 12px; color: #fff; margin: 0;">Usufruisca di uno <strong style="color: #D4AF37;">sconto del 10%</strong> sulla Sua prossima richiesta.</p>
      </div>

      <p style="font-size: 14px; text-align: center; font-style: italic; color: #666; margin-top: 40px;">
        "Il vero lusso conclude se stesso nel silenzio della certezza."
      </p>

      <div style="margin-top: 80px; text-align: center; border-top: 1px solid #eee; padding-top: 40px;">
        <p style="font-size: 11px; letter-spacing: 2px; color: #aaa; margin: 0;">MICHAEL JARA | LIFESTYLE GUARDIAN</p>
        <p style="font-size: 9px; letter-spacing: 1px; color: #ccc; margin-top: 5px;">MILANO - LONDON - DUBAI</p>
      </div>
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
    <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: 20px auto; padding: 60px; background: #ffffff; border: 1px solid #D4AF37;">
      <div style="text-align: center; margin-bottom: 50px;">
        <h1 style="letter-spacing: 10px; font-weight: 300; margin: 0; text-transform: uppercase;">INSOLITO PRIVÉ</h1>
        <div style="width: 40px; height: 1px; background: #D4AF37; margin: 20px auto;"></div>
        <p style="letter-spacing: 3px; font-size: 9px; color: #D4AF37; text-transform: uppercase;">The Guardian of your Lifestyle</p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.8;">Egregio <strong>${booking.name}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.8;">In merito alla Sua richiesta del <strong>${booking.date} @ ${booking.time}</strong>, abbiamo il piacere di sottoporLe la Proposta Fiduciaria definitiva per il Suo incarico.</p>
      
      <div style="background: #fdfdfd; padding: 40px; border-left: 3px solid #D4AF37; margin: 40px 0;">
        <p style="font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 2px; margin-bottom: 15px;">Dettaglio Mandato</p>
        <p style="font-size: 14px; margin-bottom: 10px;"><strong>Servizio:</strong> ${booking.tier ? `TIER ${booking.tier.toUpperCase()}` : (booking.serviceType || 'Elite Liaison')}</p>
        <p style="font-size: 14px; margin: 0;"><strong>Onorario Professionale:</strong> €${booking.estimatedPrice}</p>
      </div>

      <div style="text-align: center; margin: 60px 0;">
        <a href="${booking.stripeLink}" style="background: #000; color: #D4AF37; padding: 22px 50px; text-decoration: none; font-size: 13px; font-weight: bold; letter-spacing: 3px; border: 1px solid #D4AF37; display: inline-block;">
          PERFEZIONA IL MANDATO
        </a>
      </div>

      <p style="font-size: 13px; color: #666; font-style: italic; line-height: 1.8; text-align: center;">
        "Il vero lusso è la certezza di un'esecuzione impeccabile."
      </p>
      
      <div style="margin-top: 80px; border-top: 1px solid #efefef; padding-top: 30px; font-size: 10px; color: #aaa; text-align: center; letter-spacing: 1px;">
        <p>MICHAEL JARA | LIFESTYLE GUARDIAN</p>
        <p>MILANO - LONDON - DUBAI</p>
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
