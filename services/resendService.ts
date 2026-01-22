import { Resend } from 'resend';
import { BookingRecord } from '../types';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'insolitoprive@gmail.com';
const FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL || 'onboarding@resend.dev';

/**
 * Send new booking notification to admin
 */
export const sendAdminNotification = async (booking: BookingRecord): Promise<boolean> => {
    try {
        const tierLabel = booking.tier
            ? `Tier ${booking.tier.charAt(0).toUpperCase() + booking.tier.slice(1)}`
            : booking.serviceType?.replace('_', ' ').toUpperCase() || 'Servizio Generico';

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D4AF37 0%, #AA8A2E 100%); color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .booking-details { background: white; border-left: 4px solid #D4AF37; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; width: 140px; color: #666; }
            .detail-value { flex: 1; color: #1a1a1a; }
            .cta-button { display: inline-block; background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">🔔 NUOVA RICHIESTA</h1>
              <p style="margin:10px 0 0 0; opacity: 0.9;">INSOLITO PRIVÉ</p>
            </div>
            
            <div class="content">
              <h2 style="margin-top:0;">Dettagli Prenotazione</h2>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Cliente:</span>
                  <span class="detail-value"><strong>${booking.name}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${booking.email}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Telefono:</span>
                  <span class="detail-value">${booking.phone}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Tier/Servizio:</span>
                  <span class="detail-value"><strong>${tierLabel}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Data:</span>
                  <span class="detail-value">${booking.date} ore ${booking.time}</span>
                </div>
                ${booking.tier && booking.hours ? `
                <div class="detail-row">
                  <span class="detail-label">Durata:</span>
                  <span class="detail-value">${booking.hours} ore @ €${booking.hourlyRate}/h</span>
                </div>
                ` : ''}
                ${!booking.tier ? `
                <div class="detail-row">
                  <span class="detail-label">Pickup:</span>
                  <span class="detail-value">${booking.pickupLocation}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Destination:</span>
                  <span class="detail-value">${booking.destination}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <span class="detail-label">Prezzo Stimato:</span>
                  <span class="detail-value"><strong>€${booking.estimatedPrice}</strong></span>
                </div>
                ${booking.specialRequests ? `
                <div class="detail-row">
                  <span class="detail-label">Note:</span>
                  <span class="detail-value"><em>${booking.specialRequests}</em></span>
                </div>
                ` : ''}
              </div>
              
              <p style="text-align: center;">
                <a href="${window.location.origin}" class="cta-button">Apri Admin Dashboard</a>
              </p>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>Azione Richiesta:</strong> Conferma o rifiuta questa prenotazione dalla dashboard admin entro 24 ore.
              </p>
            </div>
            
            <div class="footer">
              <p>INSOLITO PRIVÉ - Lifestyle Management</p>
              <p>Questa è una notifica automatica. Non rispondere a questa email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `🔔 Nuova Prenotazione - ${booking.name} (${booking.date})`,
            html: html,
        });

        if (error) {
            console.error('❌ Resend error:', error);
            return false;
        }

        console.log('✅ Admin notification sent:', data?.id);
        return true;
    } catch (error) {
        console.error('❌ Failed to send admin notification:', error);
        return false;
    }
};

/**
 * Send booking confirmation to client
 */
export const sendClientConfirmation = async (booking: BookingRecord): Promise<boolean> => {
    try {
        const bookingCode = booking.id.slice(-6).toUpperCase();
        const formattedDate = new Date(booking.date).toLocaleDateString('it-IT', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D4AF37 0%, #AA8A2E 100%); color: white; padding: 40px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .confirmation-box { background: white; border: 2px solid #D4AF37; padding: 25px; margin: 20px 0; text-align: center; }
            .booking-code { font-size: 24px; font-weight: bold; color: #D4AF37; letter-spacing: 3px; }
            .details { background: white; padding: 20px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">✅ PRENOTAZIONE CONFERMATA</h1>
              <p style="margin:10px 0 0 0; opacity: 0.9;">INSOLITO PRIVÉ</p>
            </div>
            
            <div class="content">
              <div class="confirmation-box">
                <p style="margin:0 0 10px 0; color: #666;">Codice Prenotazione</p>
                <div class="booking-code">${bookingCode}</div>
              </div>
              
              <p>Gentile <strong>${booking.name}</strong>,</p>
              <p>La tua prenotazione per il <strong>${formattedDate} alle ore ${booking.time}</strong> è stata <strong style="color: #28a745;">CONFERMATA</strong>.</p>
              
              <div class="details">
                <h3 style="margin-top:0; color: #D4AF37;">Riepilogo Servizio</h3>
                ${booking.tier ? `
                  <p><strong>Tier:</strong> ${booking.tier.charAt(0).toUpperCase() + booking.tier.slice(1)}</p>
                  <p><strong>Durata:</strong> ${booking.hours} ore di assistenza continuativa</p>
                ` : `
                  <p><strong>Servizio:</strong> ${booking.serviceType?.replace('_', ' ').toUpperCase()}</p>
                `}
                <p><strong>Data:</strong> ${formattedDate}</p>
                <p><strong>Ora:</strong> ${booking.time}</p>
                <p><strong>Importo:</strong> €${booking.estimatedPrice}</p>
              </div>
              
              <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p style="margin:0;"><strong>📱 Prossimi Step:</strong></p>
                <p style="margin:5px 0 0 0; font-size: 14px;">Ti contatteremo 24 ore prima del servizio per confermare i dettagli finali e coordinarci sui punti d'incontro.</p>
              </div>
              
              <p style="margin-top: 30px;">Grazie per aver scelto INSOLITO PRIVÉ.</p>
              <p style="color: #666; font-style: italic;">Il vero lusso non è farsi notare, ma avere la certezza che ogni variabile sia già stata prevista e gestita.</p>
              
              <p style="margin-top: 30px;">
                Michael Jara<br>
                <strong>Lifestyle Guardian</strong><br>
                INSOLITO PRIVÉ
              </p>
            </div>
            
            <div class="footer">
              <p>INSOLITO PRIVÉ - Private Lifestyle Management</p>
              <p>P.IVA: 14379200968 | Via Uboldo 8, Cernusco sul Naviglio (MI)</p>
            </div>
          </div>
        </body>
      </html>
    `;

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: booking.email,
            subject: `✅ Prenotazione Confermata - ${bookingCode} | INSOLITO PRIVÉ`,
            html: html,
        });

        if (error) {
            console.error('❌ Resend error:', error);
            return false;
        }

        console.log('✅ Client confirmation sent:', data?.id);
        return true;
    } catch (error) {
        console.error('❌ Failed to send client confirmation:', error);
        return false;
    }
};

/**
 * Send booking decline notification to client
 */
export const sendClientDecline = async (booking: BookingRecord): Promise<boolean> => {
    try {
        const bookingCode = booking.id.slice(-6).toUpperCase();

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6B7280 0%, #4B5563 100%); color: white; padding: 40px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">⚠️ AGGIORNAMENTO PRENOTAZIONE</h1>
              <p style="margin:10px 0 0 0; opacity: 0.9;">INSOLITO PRIVÉ</p>
            </div>
            
            <div class="content">
              <p>Gentile <strong>${booking.name}</strong>,</p>
              <p>Ci dispiace informarti che la tua richiesta di prenotazione (codice <strong>${bookingCode}</strong>) per il <strong>${booking.date} ore ${booking.time}</strong> non può essere confermata in questo momento.</p>
              
              <p style="margin: 20px 0;">Possibili motivi:</p>
              <ul>
                <li>Slot orario non più disponibile</li>
                <li>Esigenza di pianificazione alternativa</li>
              </ul>
              
              <p>Ti invitiamo a contattarci direttamente per esplorare alternative o riprenotare per un'altra data.</p>
              
              <p style="margin-top: 30px;">
                Michael Jara<br>
                INSOLITO PRIVÉ<br>
                📱 ${booking.phone}
              </p>
            </div>
            
            <div class="footer">
              <p>INSOLITO PRIVÉ - Private Lifestyle Management</p>
            </div>
          </div>
        </body>
      </html>
    `;

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: booking.email,
            subject: `⚠️ Aggiornamento Prenotazione - ${bookingCode} | INSOLITO PRIVÉ`,
            html: html,
        });

        if (error) {
            console.error('❌ Resend error:', error);
            return false;
        }

        console.log('✅ Client decline sent:', data?.id);
        return true;
    } catch (error) {
        console.error('❌ Failed to send client decline:', error);
        return false;
    }
};
