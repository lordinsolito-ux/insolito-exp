import { BookingRecord } from '../types';

export const generateInvoiceHTML = (booking: BookingRecord, type: 'receipt' | 'invoice' = 'receipt', billingDetails?: { businessName?: string, vatId?: string, address?: string }): string => {
  const invoiceNumber = `INV-${(booking.id || '000000').slice(-6).toUpperCase()}`;
  const date = new Date().toLocaleDateString('it-IT');

  const price = Number(booking.estimatedPrice) || 0;
  // UPDATE: Services (Consulenza/Assistenza) are standard VAT 22%, not 10% (Transport)
  const taxRate = 0.22;
  const taxAmount = (price * taxRate) / (1 + taxRate);
  const netAmount = price - taxAmount;

  const isInvoice = type === 'invoice';
  const documentTitle = isInvoice ? 'FATTURA / INVOICE' : 'RICEVUTA - LIFESTYLE MANAGEMENT';
  const documentLabel = isInvoice ? 'Fattura' : 'Ricevuta';

  // Safe access helpers
  const paymentMethod = booking.paymentMethod ? booking.paymentMethod.toUpperCase() : 'CASH';

  // TRANSFORM SERVICE TYPE TO "LIFESTYLE" LANGUAGE
  const getServiceLabel = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('airport')) return 'Assistenza Lifestyle - Airport Connection';
    if (t.includes('hourly')) return 'Assistenza Personale Oraria (Hourly Disposal)';
    if (t.includes('city')) return 'Assistenza Lifestyle - City Transfer';
    return 'Servizi di Lifestyle Management';
  };

  const serviceDescription = booking.serviceType ? getServiceLabel(booking.serviceType) : 'Assistenza Personale';

  // Client Details - Override with Billing Details if provided for Invoice
  const clientName = (isInvoice && billingDetails?.businessName) ? billingDetails.businessName : (booking.name || 'Cliente');
  const clientVat = (isInvoice && billingDetails?.vatId) ? billingDetails.vatId : '';
  const clientAddress = (isInvoice && billingDetails?.address) ? billingDetails.address : '';

  const clientEmail = booking.email || '';
  const clientPhone = booking.phone || '';

  const pickup = booking.pickupLocation || 'N/A';
  const destination = booking.destination || 'N/A';
  const bookingDate = booking.date || '';
  const bookingTime = booking.time || '';

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
        .total-section { text-align: right; margin-top: 20px; }
        .total-row { display: flex; justify-content: flex-end; gap: 40px; padding: 5px 0; font-size: 14px; }
        .total-label { color: #666; }
        .total-value { font-weight: bold; width: 120px; }
        .grand-total { font-size: 20px; color: #D4AF37; border-top: 2px solid #D4AF37; padding-top: 15px; margin-top: 10px; }
        .footer { margin-top: 60px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #eee; padding-top: 20px; line-height: 1.5; }
        .legal-disclaimer { margin-top: 20px; font-size: 9px; color: #888; text-align: justify; padding: 10px; background: #f9f9f9; border-left: 3px solid #ccc; }
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
        <div class="logo">INSOLITO PRIVÉ</div>
        <div class="company-info">
          <strong>INSOLITO SERVICES</strong><br>
          Via Uboldo 8, 20063 Cernusco sul Naviglio (MI)<br>
          P.IVA: IT14379200968<br>
          Tel: +39 339 352 2164<br>
          Email: info@insolitoprive.it
        </div>
      </div>

      <div class="invoice-title">${documentTitle}</div>

      <div class="details-grid">
        <div class="box">
          <h3>Cliente / Intestatario</h3>
          <p><strong>${clientName}</strong></p>
          ${clientVat ? `<p class="mono" style="font-size:12px; margin-top:4px;">P.IVA/CF: ${clientVat}</p>` : ''}
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
              <div style="font-size: 11px; color: #666; margin-top: 4px; line-height: 1.4;">
                Prestazione di assistenza personale e coordinamento logistico.<br>
                <span style="font-style: italic;">Rif. Tratta: ${pickup} &rarr; ${destination}</span>
              </div>
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

      ${isInvoice ? '<div class="tax-note">Operazione soggetta ad IVA ordinaria (22%) - Prestazione di servizi generica.</div>' : ''}

      <div class="legal-disclaimer">
        <strong>NOTA LEGALE:</strong> Il presente documento attesta il pagamento per servizi di <em>Lifestyle Management & Assistenza Personale</em>. 
        L'importo corrisposto remunera esclusivamente la disponibilità oraria e la consulenza professionale del Personal Manager. 
        L'eventuale utilizzo del veicolo è da intendersi come <strong>strumento di lavoro accessorio</strong> necessario all'espletamento del mandato, e NON costituisce corrispettivo per servizio di trasporto (Taxi/NCC) ai sensi dell'art. 85 CdS.
        Prestazione professionale regolata dagli art. 2222 e segg. del Codice Civile (Contratto d'Opera).
      </div>

      <div class="footer">
        <p>INSOLITO PRIVÉ - Disruptive Luxury Experience</p>
        <p>Per informazioni e assistenza: +39 339 352 2164 | info@insolitoprive.it</p>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;
};
