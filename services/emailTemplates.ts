import { BookingRecord } from '../types';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  stars: string;
}

/**
 * Generate Luxury HTML email for confirmed booking
 */
export const generateConfirmationEmail = (
  booking: BookingRecord,
  bookingCode: string,
  formattedDate: string,
  testimonial: Testimonial
): string => {
  return `
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Conferma Prenotazione - INSOLITO</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;color:#333;">
<div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">

  <!-- Header -->
  <div style="background-color:#000000;padding:20px;text-align:center;border-bottom:3px solid #d4af37;">
    <h1 style="margin:0;color:#d4af37;font-size:24px;letter-spacing:4px;font-weight:300;">INSOLITO</h1>
    <p style="margin:4px 0 0;color:#888;font-size:9px;text-transform:uppercase;letter-spacing:2px;">Lifestyle Concierge</p>
  </div>

  <!-- Status Banner -->
  <div style="background-color:#f0fdf4;padding:10px;text-align:center;border-bottom:1px solid #e5e7eb;">
    <span style="background-color:#22c55e;color:#ffffff;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">✓ Confermata</span>
  </div>

  <!-- Main Content -->
  <div style="padding:20px 15px;">
    
    <p style="font-size:15px;line-height:1.5;color:#333;margin-bottom:20px;text-align:center;">
      Gentile <strong>${booking.name}</strong>,<br>
      La Sua prenotazione è confermata. Benvenuto a bordo.
    </p>

    <!-- Trip Details Table -->
    <table style="width:100%;border-collapse:collapse;background-color:#f9fafb;border-radius:8px;overflow:hidden;margin-bottom:20px;">
      <tr>
        <td style="padding:10px 15px;border-bottom:1px solid #e5e7eb;width:35%;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;">📅 Data</td>
        <td style="padding:10px 15px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:600;font-size:14px;">${formattedDate}</td>
      </tr>
      <tr>
        <td style="padding:10px 15px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;">⏰ Ora</td>
        <td style="padding:10px 15px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:600;font-size:14px;">${booking.time}</td>
      </tr>
      <tr>
        <td style="padding:10px 15px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;">📍 Da</td>
        <td style="padding:10px 15px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;">${booking.pickupLocation}</td>
      </tr>
      ${booking.stops && booking.stops.length > 0 ? `
      <tr>
        <td style="padding:10px 15px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;">🔄 Via</td>
        <td style="padding:10px 15px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;">${booking.stops.join(' → ')}</td>
      </tr>` : ''}
      <tr>
        <td style="padding:10px 15px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;">🏁 A</td>
        <td style="padding:10px 15px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;">${booking.destination}</td>
      </tr>
      <tr>
        <td style="padding:10px 15px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;">🚗 Veicolo</td>
        <td style="padding:10px 15px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;">${booking.vehiclePreference ? booking.vehiclePreference.toUpperCase() : 'Standard'}</td>
      </tr>
      <tr>
        <td style="padding:10px 15px;background-color:#fffbeb;color:#d4af37;font-size:12px;font-weight:600;text-transform:uppercase;">💰 Totale</td>
        <td style="padding:10px 15px;background-color:#fffbeb;color:#d4af37;font-weight:bold;font-size:16px;">€${booking.estimatedPrice}</td>
      </tr>
    </table>

    <!-- Included Services -->
    <div style="text-align:center;margin-bottom:20px;">
      <p style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;">✨ Servizio Incluso</p>
      <p style="font-size:12px;color:#4b5563;line-height:1.4;">
        Autista Professionale • Veicolo Premium • Acqua & WiFi • Comfort Garantito
      </p>
    </div>

    <!-- Testimonial -->
    <div style="background-color:#f3f4f6;padding:15px;border-radius:8px;margin-bottom:20px;text-align:center;">
      <p style="color:#fbbf24;font-size:12px;margin-bottom:5px;">${testimonial.stars}</p>
      <p style="font-style:italic;color:#4b5563;font-size:12px;line-height:1.4;margin-bottom:5px;">"${testimonial.quote}"</p>
      <p style="color:#111827;font-size:11px;font-weight:bold;">— ${testimonial.name}, ${testimonial.role}</p>
    </div>

    <!-- Referral -->
    <div style="border:1px dashed #d4af37;background-color:#fffbeb;padding:15px;border-radius:8px;text-align:center;margin-bottom:25px;">
      <h3 style="color:#d4af37;font-size:14px;margin:0 0 5px 0;">🎁 Porta un Amico</h3>
      <p style="font-size:12px;color:#4b5563;margin-bottom:10px;">
        Condividi il codice <strong style="color:#d4af37;font-size:13px;">#${bookingCode}</strong><br>
        Il tuo amico riceve <strong>€5</strong> di sconto, tu ricevi <strong>€10</strong>!
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;">
      <a href="https://wa.me/393393522164" style="display:inline-block;background-color:#d4af37;color:#000000;padding:12px 25px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:13px;box-shadow:0 4px 6px rgba(212,175,55,0.2);">
        📞 Contatta Assistenza
      </a>
    </div>

  </div>

  <!-- Footer -->
  <div style="background-color:#1f2937;padding:15px;text-align:center;color:#9ca3af;font-size:10px;">
    <p style="margin-bottom:5px;">
      WhatsApp: <a href="https://wa.me/393393522164" style="color:#d4af37;text-decoration:none;">+39 339 352 2164</a> • 
      Email: <a href="mailto:info@insolitodrive.com" style="color:#d4af37;text-decoration:none;">info@insolitodrive.com</a>
    </p>
    <p style="margin-bottom:0;">© 2025 INSOLITO Experiences. Milan • Bergamo • Lake Como</p>
  </div>

</div>
</body>
</html>
  `.trim();
};

/**
 * Generate Luxury HTML email for declined booking
 */
export const generateDeclinedEmail = (
  booking: BookingRecord,
  bookingCode: string,
  formattedDate: string,
  testimonial: Testimonial
): string => {
  return `
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Prenotazione Non Disponibile - INSOLITO</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;color:#333;">
<div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">

  <!-- Header -->
  <div style="background-color:#000000;padding:20px;text-align:center;border-bottom:3px solid #ef4444;">
    <h1 style="margin:0;color:#d4af37;font-size:24px;letter-spacing:4px;font-weight:300;">INSOLITO</h1>
    <p style="margin:4px 0 0;color:#888;font-size:9px;text-transform:uppercase;letter-spacing:2px;">Lifestyle Concierge</p>
  </div>

  <!-- Status Banner -->
  <div style="background-color:#fef2f2;padding:10px;text-align:center;border-bottom:1px solid #e5e7eb;">
    <span style="background-color:#ef4444;color:#ffffff;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">⚠️ Non Disponibile</span>
  </div>

  <!-- Main Content -->
  <div style="padding:20px 15px;">
    
    <p style="font-size:15px;line-height:1.6;color:#333;margin-bottom:20px;text-align:center;">
      Gentile <strong>${booking.name}</strong>,<br><br>
      Ti ringraziamo per aver scelto INSOLITO.<br>
      A causa di un imprevisto operativo dell'ultimo minuto, non siamo in grado di confermare il servizio per l'orario richiesto.
    </p>

    <!-- Details -->
    <div style="background-color:#f9fafb;border-radius:8px;padding:15px;margin-bottom:20px;text-align:center;">
      <p style="margin:0;color:#6b7280;font-size:11px;text-transform:uppercase;margin-bottom:5px;">Richiesta Originale</p>
      <p style="margin:0;color:#111827;font-weight:bold;font-size:14px;">${formattedDate} alle ${booking.time}</p>
    </div>

    <p style="font-size:14px;line-height:1.6;color:#4b5563;margin-bottom:25px;text-align:center;padding:0 10px;">
      Ci scusiamo sinceramente per l'inconveniente. La tua soddisfazione è la nostra priorità: ti invitiamo a selezionare un nuovo orario per offrirti la migliore esperienza possibile.
    </p>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:10px;">
      <a href="https://insolitodrive.com" style="display:inline-block;background-color:#d4af37;color:#000000;padding:12px 25px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:13px;box-shadow:0 4px 6px rgba(212,175,55,0.2);">
        📅 Scegli un Nuovo Orario
      </a>
    </div>
    
    <div style="text-align:center;margin-top:15px;">
      <a href="https://wa.me/393393522164" style="color:#6b7280;font-size:12px;text-decoration:underline;">
        O contatta l'assistenza prioritaria
      </a>
    </div>

  </div>

  <!-- Footer -->
  <div style="background-color:#1f2937;padding:15px;text-align:center;color:#9ca3af;font-size:10px;">
    <p style="margin-bottom:0;">© 2025 INSOLITO Experiences</p>
  </div>

</div>
</body>
</html>
  `.trim();
};

/**
 * Generate Luxury HTML email for rescheduled booking
 */
export const generateRescheduledEmail = (
  booking: BookingRecord,
  bookingCode: string,
  formattedDate: string,
  testimonial: Testimonial,
  reason?: string // NEW PARAMETER
): string => {
  const reasonText = reason || "motivi operativi";

  // WhatsApp Links
  const acceptLink = `https://wa.me/393393522164?text=${encodeURIComponent(`Ciao, accetto la proposta di modifica orario per la prenotazione #${bookingCode}.`)}`;
  const declineLink = `https://wa.me/393393522164?text=${encodeURIComponent(`Ciao, purtroppo non posso accettare il nuovo orario per la prenotazione #${bookingCode}.`)}`;

  return `
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proposta Modifica - INSOLITO</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;color:#333;">
<div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">

  <!-- Header -->
  <div style="background-color:#000000;padding:20px;text-align:center;border-bottom:3px solid #fbbf24;">
    <h1 style="margin:0;color:#d4af37;font-size:24px;letter-spacing:4px;font-weight:300;">INSOLITO</h1>
    <p style="margin:4px 0 0;color:#888;font-size:9px;text-transform:uppercase;letter-spacing:2px;">Lifestyle Concierge</p>
  </div>

  <!-- Status Banner -->
  <div style="background-color:#fffbeb;padding:10px;text-align:center;border-bottom:1px solid #e5e7eb;">
    <span style="background-color:#fbbf24;color:#000000;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">📅 Proposta Modifica Orario</span>
  </div>

  <!-- Main Content -->
  <div style="padding:20px 15px;">
    
    <p style="font-size:15px;line-height:1.6;color:#333;margin-bottom:20px;text-align:center;">
      Gentile <strong>${booking.name}</strong>,<br><br>
      Per garantirti il miglior servizio possibile, vorremmo proporti una modifica all'orario della tua prenotazione.
    </p>

    <!-- Reason (Simplified) -->
    <div style="background-color:#fffbeb;padding:15px;margin-bottom:20px;border-radius:4px;text-align:center;">
      <strong style="color:#b45309;font-size:12px;text-transform:uppercase;">Motivazione:</strong><br>
      <span style="color:#333;font-size:14px;">${reasonText}</span>
    </div>

    <!-- Details -->
    <div style="background-color:#f9fafb;border-radius:8px;padding:15px;margin-bottom:25px;text-align:center;">
      <p style="margin:5px 0;font-size:14px;"><strong>📅 Nuova Data:</strong> ${formattedDate}</p>
      <p style="margin:5px 0;font-size:14px;"><strong>⏰ Nuova Ora:</strong> ${booking.time}</p>
      <p style="margin:5px 0;font-size:13px;color:#666;">${booking.pickupLocation} → ${booking.destination}</p>
    </div>

    <!-- Action Buttons -->
    <div style="text-align:center;margin-bottom:25px;">
      <p style="font-size:13px;color:#4b5563;margin-bottom:15px;">Conferma o rifiuta:</p>
      
      <a href="${acceptLink}" style="display:inline-block;background-color:#22c55e;color:#ffffff;padding:10px 20px;border-radius:20px;text-decoration:none;font-weight:bold;font-size:13px;margin:0 5px;">✅ Accetta</a>
      <a href="${declineLink}" style="display:inline-block;background-color:#ef4444;color:#ffffff;padding:10px 20px;border-radius:20px;text-decoration:none;font-weight:bold;font-size:13px;margin:0 5px;">❌ Rifiuta</a>
    </div>

    <!-- Referral -->
    <div style="border:1px dashed #d4af37;background-color:#fffbeb;padding:15px;border-radius:8px;text-align:center;margin-bottom:15px;">
      <p style="font-size:11px;color:#4b5563;margin:0;">
        Codice Prenotazione: <strong style="color:#d4af37;">#${bookingCode}</strong>
      </p>
    </div>

  </div>

  <!-- Footer -->
  <div style="background-color:#1f2937;padding:15px;text-align:center;color:#9ca3af;font-size:10px;">
    <p style="margin-bottom:0;">© 2025 INSOLITO Experiences</p>
  </div>

</div>
</body>
</html>
  `.trim();
};

/**
 * Get random testimonial for viral effect
 */
export const getRandomTestimonial = (): Testimonial => {
  const testimonials: Testimonial[] = [
    {
      name: "Alessandro M.",
      role: "CEO Milano",
      quote: "Ho portato clienti dall'aeroporto BGY a Milano. Servizio impeccabile, auto pulitissima. I miei ospiti erano impressionati.",
      stars: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Sofia R.",
      role: "Event Planner",
      quote: "Organizzo eventi di lusso sul Lago di Como. INSOLITO è l'unico driver di cui mi fido per i miei VIP. Puntualità svizzera, discrezione totale.",
      stars: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Marco T.",
      role: "Imprenditore",
      quote: "Viaggio spesso tra Milano e Bergamo. Con INSOLITO trasformo ogni tragitto in un momento di relax. Zero stress, massima professionalità.",
      stars: "⭐⭐⭐⭐⭐"
    }
  ];

  return testimonials[Math.floor(Math.random() * testimonials.length)];
};
