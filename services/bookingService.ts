import { BookingFormData, BookingRecord } from "../types";
import { supabase, isSupabaseConfigured, rowToBookingRecord, bookingToRow } from "./supabaseClient";

// Check data source
export const isCloudConfigured = (): boolean => {
  return isSupabaseConfigured();
};

export const isCloudSyncEnabled = (): boolean => {
  return isSupabaseConfigured();
};

// --- HELPER FOR TIME SLOTS ---
export const generateTimeSlots = (dateString: string): string[] => {
  if (!dateString) return [];

  const date = new Date(dateString + 'T12:00:00');
  const day = date.getDay();

  const slots: string[] = [];

  const addSlots = (startH: number, startM: number, endH: number, endM: number) => {
    let currentH = startH;
    let currentM = startM;
    const targetH = endH === 0 ? 24 : endH;

    while (currentH < targetH || (currentH === targetH && currentM <= endM)) {
      const hStr = currentH.toString().padStart(2, '0');
      const mStr = currentM.toString().padStart(2, '0');
      const displayTime = (currentH === 24) ? "00:00" : `${hStr}:${mStr}`;
      slots.push(displayTime);
      currentM += 30;
      if (currentM >= 60) {
        currentH++;
        currentM = 0;
      }
    }
  };

  // NIGHT SHIFT (Every day: 00:00 - 06:30)
  addSlots(0, 0, 6, 30);

  // DAY SHIFTS
  if (day === 1 || day === 3) {
    addSlots(18, 0, 23, 30);
  } else if (day === 2) {
    addSlots(18, 0, 20, 0);
    addSlots(23, 0, 23, 30);
  } else if (day === 4 || day === 5) {
    addSlots(18, 0, 23, 30);
  } else if (day === 6) {
    addSlots(9, 0, 23, 30);
  } else if (day === 0) {
    addSlots(15, 0, 23, 30);
  }

  const uniqueSlots = Array.from(new Set(slots));
  uniqueSlots.sort((a, b) => {
    const [h1, m1] = a.split(':').map(Number);
    const [h2, m2] = b.split(':').map(Number);
    if (h1 !== h2) return h1 - h2;
    return m1 - m2;
  });

  return uniqueSlots;
};

const isOverlapping = (startA: Date, endA: Date, startB: Date, endB: Date) => {
  return startA < endB && endA > startB;
};

const parseDateTime = (dateStr: string, timeStr: string): Date => {
  return new Date(`${dateStr}T${timeStr}:00`);
};

// --- CORE DATA FUNCTIONS (SUPABASE ONLY) ---

/**
 * Fetches all bookings from Supabase
 */
export const fetchAllBookings = async (): Promise<BookingRecord[]> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log(`✅ Fetched ${data.length} bookings from Supabase`);
        const bookings = data.map(rowToBookingRecord);
        localStorage.setItem('insolito_bookings', JSON.stringify(bookings));
        return bookings;
      }

      // Return empty array if no data (not an error)
      return [];
    } catch (e) {
      console.warn("Supabase fetch failed, using local backup", e);
    }
  }

  // Fallback to LocalStorage
  const localStored = localStorage.getItem('insolito_bookings');
  return localStored ? JSON.parse(localStored) : [];
};

/**
 * Saves a new booking to Supabase
 */
export const saveBooking = async (
  booking: BookingRecord,
  isNewBooking: boolean = false,
  forceCloudUpdate: boolean = false,
  reason?: string
): Promise<void> => {
  const bookingWithTimestamp = {
    ...booking,
    timestamp: new Date().toISOString()
  };

  // Save to Supabase
  if (isSupabaseConfigured()) {
    try {
      const row = bookingToRow(bookingWithTimestamp);

      if (isNewBooking) {
        const { data, error } = await supabase
          .from('bookings')
          .insert(row)
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }

        console.log(`✅ Saved new booking to Supabase:`, data?.id);
      } else {
        const { error } = await supabase
          .from('bookings')
          .update(row)
          .eq('id', booking.id);

        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }

        console.log(`✅ Updated booking in Supabase: ${booking.id}`);
      }

      // Trigger notification (prepared for Resend integration)
      if (isNewBooking || forceCloudUpdate) {
        await sendBookingUpdateNotification(booking, booking.status as any, reason);
      }
    } catch (e) {
      console.error("Failed to save to Supabase", e);
    }
  }

  // Update local cache
  const currentList = await fetchAllBookings();
  const otherBookings = currentList.filter(b => b.id !== booking.id);
  const updatedList = [bookingWithTimestamp, ...otherBookings];
  localStorage.setItem('insolito_bookings', JSON.stringify(updatedList));
};

/**
 * Checks availability by syncing with Supabase
 */
export const checkAvailability = async (date: string): Promise<string[]> => {
  const bookings = await fetchAllBookings();

  const busySlots: string[] = [];
  const theoreticalSlots = generateTimeSlots(date);

  const daysBookings = bookings.filter(b => b.date === date && (b.status === 'confirmed' || b.status === 'pending'));
  const ASSUMED_DURATION = 60;

  theoreticalSlots.forEach(slotTime => {
    const slotStart = parseDateTime(date, slotTime);
    const slotEnd = new Date(slotStart.getTime() + ASSUMED_DURATION * 60000);

    for (const booking of daysBookings) {
      if (booking.email === 'admin@block') {
        const blockStartTime = booking.time;
        let blockEndTime = booking.destination;

        if (blockEndTime.startsWith('END:')) {
          blockEndTime = blockEndTime.substring(4);
        } else if (!blockEndTime.includes(':')) {
          const decimal = parseFloat(blockEndTime);
          const hours = Math.floor(decimal * 24);
          const minutes = Math.round((decimal * 24 - hours) * 60);
          blockEndTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }

        const [blockStartH, blockStartM] = blockStartTime.split(':').map(Number);
        const [blockEndH, blockEndM] = blockEndTime.split(':').map(Number);
        const [slotH, slotM] = slotTime.split(':').map(Number);
        const slotMinutes = slotH * 60 + slotM;
        const blockStartMinutes = blockStartH * 60 + blockStartM;
        const blockEndMinutes = blockEndH * 60 + blockEndM;

        if (slotMinutes >= blockStartMinutes && slotMinutes < blockEndMinutes) {
          busySlots.push(slotTime);
          break;
        }
      } else {
        const bookingStart = parseDateTime(booking.date, booking.time);
        const bookingEnd = new Date(bookingStart.getTime() + (booking.duration || 60) * 60000);

        if (isOverlapping(slotStart, slotEnd, bookingStart, bookingEnd)) {
          busySlots.push(slotTime);
          break;
        }
      }
    }
  });

  return busySlots;
};

/**
 * Strict Overbooking Check
 */
export const checkBookingConflict = (newBooking: BookingFormData, existingBookings: BookingRecord[]): boolean => {
  const newStart = parseDateTime(newBooking.date, newBooking.time);
  const newEnd = new Date(newStart.getTime() + (newBooking.duration || 60) * 60000);

  return existingBookings.some(existing => {
    if (existing.status !== 'confirmed' && existing.status !== 'pending') return false;
    if (existing.date !== newBooking.date) return false;

    const existingStart = parseDateTime(existing.date, existing.time);
    const existingEnd = new Date(existingStart.getTime() + (existing.duration || 60) * 60000);

    return isOverlapping(newStart, newEnd, existingStart, existingEnd);
  });
};

/**
 * Sends notifications - Prepared for Resend integration
 * Currently logs to console. Will send emails via Resend API when configured.
 */
export const sendBookingUpdateNotification = async (
  booking: BookingRecord,
  status: 'confirmed' | 'declined' | 'rescheduled',
  reason?: string
): Promise<boolean> => {
  const { generateConfirmationEmail, generateDeclinedEmail, generateRescheduledEmail, getRandomTestimonial } = await import('./emailTemplates');

  const bookingCode = booking.id.slice(-6).toUpperCase();
  const formattedDate = new Date(booking.date).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const testimonial = getRandomTestimonial();
  let htmlMessage = "";
  let subject = "";

  if (status === 'confirmed') {
    htmlMessage = generateConfirmationEmail(booking, bookingCode, formattedDate, testimonial);
    subject = "Conferma Servizio INSOLITO Experiences";
  } else if (status === 'declined') {
    htmlMessage = generateDeclinedEmail(booking, bookingCode, formattedDate, testimonial);
    subject = "⚠️ Aggiornamento Servizio - INSOLITO Experiences";
  } else if (status === 'rescheduled') {
    htmlMessage = generateRescheduledEmail(booking, bookingCode, formattedDate, testimonial, reason);
    subject = "📅 Proposta Modifica - INSOLITO Experiences";
  }

  // TODO: Integrate with Resend API
  // For now, log the notification details
  console.log('📧 Notification Ready (Resend integration pending):', {
    to: booking.email,
    subject: subject,
    status: status,
    bookingId: booking.id
  });

  // Store notification in Supabase for tracking
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('notifications')
        .insert({
          booking_id: booking.id,
          email: booking.email,
          subject: subject,
          status: status,
          sent_at: new Date().toISOString()
        });
    } catch (e) {
      // Table might not exist yet, that's ok
      console.log('Notification tracking skipped (table not configured)');
    }
  }

  return true;
};
