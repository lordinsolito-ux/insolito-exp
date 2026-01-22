import { BookingRecord } from '../types';
import { BUSINESS_INFO } from '../legalContent';
import { getTierServiceLabel, getTierFeatures } from './tierHelpers';

export const generateInvoiceHTML = (
  booking: BookingRecord,
  type: 'receipt' | 'invoice' = 'receipt',
  billingDetails?: { businessName?: string; vatId?: string; address?: string }
): string => {
  const invoiceNumber = `INV-${(booking.id || '000000').slice(-6).toUpperCase()}`;
  const date = new Date().toLocaleDateString('it-IT');

  const price = Number(booking.estimatedPrice) || 0;
  const taxRate = 0.22;
  const taxAmount = (price * taxRate) / (1 + taxRate);
  const netAmount = price - taxAmount;

  const isInvoice = type === 'invoice';
  const documentTitle = isInvoice ? 'FATTURA / INVOICE' : 'RICEVUTA - LIFESTYLE MANAGEMENT';
  const documentLabel = isInvoice ? 'Fattura' : 'Ricevuta';

  const paymentMethod = booking.paymentMethod ? booking.paymentMethod.toUpperCase() : 'CASH';

  // Use helper functions
  const serviceDescription = getTierServiceLabel(booking.tier, booking.serviceType);
  const tierFeatures = getTierFeatures(booking.tier);

  // Client Details
  const clientName = (isInvoice && billingDetails?.businessName) ? billingDetails.businessName : (booking.name || 'Cliente');
  const clientVat = (isInvoice && billingDetails?.vatId) ? billingDetails.vatId : '';
  const clientAddress = (isInvoice && billingDetails?.address) ? billingDetails.address : '';
  const clientEmail = booking.email || '';
  const clientPhone = booking.phone || '';

  const bookingDate = booking.date || '';
  const bookingTime = booking.time || '';

  // Tier-based pricing
  const hours = booking.hours || 0;
  const hourlyRate = booking.hourlyRate || 0;
  const showHourlyBreakdown = booking.tier && hours > 0 && hourlyRate > 0;

  return `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>${documentLabel} ${invoiceNumber}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1a1a; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; background: #fff; }
        .header { display: flex; justify-content: space-between; margin-bottom: 50px; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #D4AF37; letter-spacing: 2px; text-transform: uppercase; }
        .company-info { text-align: right; font-size: 11px; color: #666; line-height: 1.4; }
        .invoice-title { font-size: 24px; font-weight: 300; margin-bottom: 40px; color: #000; letter-spacing: 1px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .box { background: #fcfcfc; padding: 20px; border: 1px solid #eee; border-radius: 4px; }
        .box h3 { margin-top: 0; font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 2px; margin-bottom: 10px; }
        .box p { margin: 0; font-weight: 500; font-size: 14px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        .table th { text-align: left; padding: 15px; border-bottom: 2px solid #D4AF37; font-size: 11px; text-transform: uppercase; color: #666; letter-spacing: 1px; }
        .table td { padding: 15px; border-bottom: 1px solid #eee; font-size: 14px; }
        .service-details { font-size: 11px; color: #666; margin-top: 8px; line-height: 1.8; }
        .hourly-calc { font-size: 12px; color: #888; margin-top: 8px; font-style: italic; background: #f9f9f9; padding: 8px; border-radius: 4px; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-row { display: flex; justify-content: flex-end; gap: 40px; padding: 5px 0; font-size: 14px; }
        .total-label { color: #666; }
        .total-value { font-weight: bold; width: 120px; }
        .grand-total { font-size: 20px; color: #D4AF37; border-top: 2px solid #D4AF37; padding-top: 15px; margin-top: 10px; }
        .footer { margin-top: 60px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #eee; padding-top: 20px; line-height: 1.5; }
        .legal-disclaimer { margin-top: 20px; font-size: 9px; color: #888; text-align: justify; padding: 10px; background: #f9f9f9; border-left: 3px solid #ccc; line-height: 1.6; }
        ${isInvoice ? '.tax-note { margin-top: 20px; font-size: 11px; color: #666; text-align: center; padding: 10px; background: #fffbeb; border-radius: 5px; }' : ''}
        
        @media print {
          body { padding: 0; background: white; }
          .no-print { display: none; }
          .box { background: none; border: 1px solid #ddd; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">${BUSINESS_INFO.name}</div>
        <div class="company-info">
          <strong>${BUSINESS_INFO.fullName}</strong><br>
          ${BUSINESS_INFO.address}<br>
          P.IVA: ${BUSINESS_INFO.piva}<br>
          ${BUSINESS_INFO.ateco}<br>
          Tel: ${BUSINESS_INFO.phone}<br>
          Email: ${BUSINESS_INFO.email}
        </div>
      </div>

      <div class="invoice-title">${documentTitle}</div>

      <div class="details-grid">
        <div class="box">
          <h3>Cliente / Intestatario</h3>
          <p><strong>${clientName}</strong></p>
          ${clientVat ? `<p style="font-size:12px; margin-top:4px;">P.IVA/CF: ${clientVat}</p>` : ''}
          ${clientAddress ? `<p style="font-size:12px; color:#555;">${clientAddress}</p>` : ''}
          <div style="margin-top: 10px; font-size: 12px; color: #666;">
            ${clientEmail}<br>${clientPhone}
          </div>
        </div>
        <div class="box">
          <h3>Riferimenti</h3>
          <p>N. Documento: <strong>${invoiceNumber}</strong></p>
          <p>Data Emissione: ${date}</p>
          <p>Pagamento: ${paymentMethod}</p>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th style="width: 60%">Descrizione Prestazione</th>
            <th>Data Esecuzione</th>
            <th style="text-align: right;">Importo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${serviceDescription}</strong><br>
              <div class="service-details">
                <strong>Incarico del ${bookingDate} ore ${bookingTime}</strong><br><br>
                <strong>Dettaglio Servizio:</strong><br>
                ${tierFeatures.join('<br>')}
                ${booking.tier && hours > 0 ? `<br><br><strong>Durata Incarico:</strong> ${hours} ore di assistenza continuativa (come da tier selezionato).` : ''}
              </div>
              ${showHourlyBreakdown ? `
              <div class="hourly-calc">
                <strong>ONORARIO:</strong> ${hours} ore × €${hourlyRate}/h = €${(hours * hourlyRate).toFixed(2)}
              </div>
              ` : ''}
            </td>
            <td>${bookingDate} <span style="color:#999">@</span> ${bookingTime}</td>
            <td style="text-align: right;">€${isInvoice ? netAmount.toFixed(2) : price.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div class="total-section">
        ${isInvoice ? `
        <div class="total-row">
          <span class="total-label">Imponibile</span>
          <span class="total-value">€${netAmount.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span class="total-label">IVA (22%)</span>
          <span class="total-value">€${taxAmount.toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="total-row grand-total">
          <span class="total-label" style="color: #000;">TOTALE DOVUTO</span>
          <span class="total-value">€${price.toFixed(2)}</span>
        </div>
      </div>

      ${isInvoice ? '<div class="tax-note">Operazione soggetta ad IVA ordinaria (22%) - Servizi alla Persona n.c.a. (ATECO 96.99.99).</div>' : ''}

      <div class="legal-disclaimer">
        <strong>NOTA LEGALE VINCOLANTE:</strong> Operazione effettuata ai sensi dell'<strong>Art. 2222 e segg. del Codice Civile</strong> (Contratto d'opera per prestazioni di servizi alla persona n.c.a. - ATECO 96.99.99).
        L'importo corrisposto remunera esclusivamente la disponibilità oraria, la consulenza professionale e il coordinamento logistico del Lifestyle Guardian.
        L'eventuale supporto alla mobilità fornito durante l'incarico è da considerarsi <strong>prestazione meramente accessoria e strumentale all'assistenza globale</strong>, non scindibile dalla stessa.
        Il presente documento NON costituisce corrispettivo per servizio di trasporto pubblico non di linea (Taxi/NCC) ai sensi dell'art. 85 CdS.
      </div>

      <div class="legal-disclaimer" style="margin-top: 15px; background: #f5f5f5; border-left: 3px solid #D4AF37;">
        <strong>PRIVACY & RISERVATEZZA:</strong> Per ragioni di riservatezza e conformità all'accordo NDA sottoscritto, i dettagli specifici dei luoghi e degli interlocutori del cliente non vengono riportati in questo documento fiscale.
        La protezione della privacy del cliente è parte integrante del servizio di Lifestyle Management fornito.
      </div>

      <div class="footer">
        <p>${BUSINESS_INFO.fullName}</p>
        <p>${BUSINESS_INFO.address} | P.IVA: ${BUSINESS_INFO.piva}</p>
        <p>${BUSINESS_INFO.ateco}</p>
        <p>Per informazioni: ${BUSINESS_INFO.phone} | ${BUSINESS_INFO.email}</p>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;
};
