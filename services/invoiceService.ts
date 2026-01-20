import { BookingRecord } from '../types';

export const generateInvoiceHTML = (booking: BookingRecord, type: 'receipt' | 'invoice' = 'receipt', billingDetails?: { businessName?: string, vatId?: string, address?: string }): string => {
  const invoiceNumber = `INV-${(booking.id || '000000').slice(-6).toUpperCase()}`;
  const date = new Date().toLocaleDateString('it-IT');

  const price = Number(booking.estimatedPrice) || 0;
  const taxRate = 0.10; // 10% VAT for transport
  const taxAmount = (price * taxRate) / (1 + taxRate);
  const netAmount = price - taxAmount;

  const isInvoice = type === 'invoice';
  const documentTitle = isInvoice ? 'FATTURA' : 'RICEVUTA NON FISCALE';
  const documentLabel = isInvoice ? 'Fattura' : 'Ricevuta';

  // Safe access helpers
  const paymentMethod = booking.paymentMethod ? booking.paymentMethod.toUpperCase() : 'CASH';
  const serviceType = booking.serviceType ? booking.serviceType.replace('_', ' ').toUpperCase() : 'TRANSFER';

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
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; margin-bottom: 50px; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #D4AF37; letter-spacing: 2px; text-transform: uppercase; }
        .company-info { text-align: right; font-size: 12px; color: #666; }
        .invoice-title { font-size: 28px; font-weight: 300; margin-bottom: 40px; color: #000; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .box { background: #f9f9f9; padding: 20px; border-radius: 8px; }
        .box h3 { margin-top: 0; font-size: 12px; text-transform: uppercase; color: #999; letter-spacing: 1px; }
        .box p { margin: 0; font-weight: 500; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        .table th { text-align: left; padding: 15px; border-bottom: 2px solid #eee; font-size: 12px; text-transform: uppercase; color: #999; }
        .table td { padding: 15px; border-bottom: 1px solid #eee; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-row { display: flex; justify-content: flex-end; gap: 40px; padding: 5px 0; }
        .total-label { color: #666; }
        .total-value { font-weight: bold; width: 100px; }
        .grand-total { font-size: 20px; color: #D4AF37; border-top: 2px solid #D4AF37; padding-top: 10px; margin-top: 10px; }
        .footer { margin-top: 80px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        ${isInvoice ? '.tax-note { margin-top: 20px; font-size: 11px; color: #666; text-align: center; padding: 10px; background: #fffbeb; border-radius: 5px; }' : ''}
        
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">INSOLITO EXPERIENCES</div>
        <div class="company-info">
          INSOLITO EXPERIENCES<br>
          Via Uboldo 8, 20063 Cernusco sul Naviglio (MI)<br>
          P.IVA: IT14379200968<br>
          Tel: +39 339 352 2164<br>
          info@insolitodrive.com
        </div>
      </div>

      <div class="invoice-title">${documentTitle}</div>

      <div class="details-grid">
        <div class="box">
          <h3>Intestato a</h3>
          <p><strong>${clientName}</strong></p>
          ${clientVat ? `<p>P.IVA / C.F.: ${clientVat}</p>` : ''}
          ${clientAddress ? `<p>${clientAddress}</p>` : ''}
          <p>${clientEmail}</p>
          <p>${clientPhone}</p>
        </div>
        <div class="box">
          <h3>Dettagli Documento</h3>
          <p>Numero: <strong>${invoiceNumber}</strong></p>
          <p>Data: ${date}</p>
          <p>Metodo: ${paymentMethod}</p>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Descrizione Servizio</th>
            <th>Data Servizio</th>
            <th style="text-align: right;">Importo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${serviceType}</strong><br>
              <span style="font-size: 12px; color: #666;">
                Da: ${pickup}<br>
                A: ${destination}
              </span>
            </td>
            <td>${bookingDate} ${bookingTime}</td>
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
          <span class="total-label">IVA (10%)</span>
          <span class="total-value">€${taxAmount.toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="total-row grand-total">
          <span class="total-label" style="color: #000;">TOTALE</span>
          <span class="total-value">€${price.toFixed(2)}</span>
        </div>
      </div>

      ${isInvoice ? '<div class="tax-note">Documento fiscalmente valido ai sensi del DPR 633/72.</div>' : ''}

      <div class="footer">
        <p>Grazie per aver scelto INSOLITO EXPERIENCES.</p>
        <p>Per assistenza: +39 339 352 2164</p>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;
};
