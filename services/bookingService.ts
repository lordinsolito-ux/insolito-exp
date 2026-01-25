import { BookingFormData, BookingRecord } from "../types";
import { supabase, isSupabaseConfigured, rowToBookingRecord, bookingToRow } from "./supabaseClient";
import * as resendService from './resendService';

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
 * Uploads attachments to Supabase Storage and returns their public URLs
 */
export const uploadAttachments = async (files: File[], bookingId: string): Promise<string[]> => {
  if (!isSupabaseConfigured() || !files.length) return [];

  const urls: string[] = [];

  for (const file of files) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${bookingId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `mission-files/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('attachments') // Using 'attachments' bucket
        .upload(filePath, file);

      if (uploadError) {
        console.error(`❌ Upload error for ${file.name}:`, uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        urls.push(data.publicUrl);
      }
    } catch (e) {
      console.error(`❌ Exception during upload of ${file.name}:`, e);
    }
  }

  return urls;
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
  let updatedBooking = { ...booking };

  // Handle file uploads for new bookings
  if (isNewBooking && booking.attachments?.length) {
    console.log(`📂 Uploading ${booking.attachments.length} attachments...`);
    const urls = await uploadAttachments(booking.attachments, booking.id || Date.now().toString());
    updatedBooking.attachmentUrls = urls;
  }

  const bookingWithTimestamp = {
    ...updatedBooking,
    timestamp: new Date().toISOString()
  };

  // Save to Supabase
  if (isSupabaseConfigured()) {
    try {
      const row = bookingToRow(bookingWithTimestamp);

      if (isNewBooking) {
        // Strip ID from the insertion payload to let Supabase generate it (prevents 400 errors)
        const { id: _, ...rowWithoutId } = row;

        const { data, error } = await supabase
          .from('bookings')
          .insert(rowWithoutId)
          .select()
          .single();

        if (error) {
          console.error('❌ Supabase insert error:', {
            message: error.message,
            hint: error.hint,
            details: error.details,
            path: error.code,
            payload: rowWithoutId
          });
          throw error;
        }

        console.log(`✅ Saved new booking to Supabase:`, data?.id);
      } else {
        const { error } = await supabase
          .from('bookings')
          .update(row)
          .eq('id', booking.id);

        if (error) {
          console.error('❌ Supabase update error:', {
            message: error.message,
            hint: error.hint,
            details: error.details,
            code: error.code,
            payload: row
          });
          throw error;
        }

        console.log(`✅ Updated booking in Supabase: ${booking.id}`);
      }

      // Trigger notification (prepared for Resend integration)
      if (isNewBooking || forceCloudUpdate) {
        await sendBookingUpdateNotification(bookingWithTimestamp, bookingWithTimestamp.status as any, reason);
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
 * @param date The date to check
 * @param requestedDuration Duration in minutes of the new potential booking
 */
export const checkAvailability = async (date: string, requestedDuration: number = 60): Promise<string[]> => {
  const bookings = await fetchAllBookings();

  const busySlots: string[] = [];
  const theoreticalSlots = generateTimeSlots(date);

  // Intelligent Scheduling: Consider confirmed, pending, requested, and proposed as "booked" to prevent overlaps
  const busyStatuses = ['confirmed', 'pending', 'requested', 'proposed'];
  const daysBookings = bookings.filter(b => b.date === date && busyStatuses.includes(b.status));
  const ASSUMED_DURATION = 60;

  theoreticalSlots.forEach(slotTime => {
    const slotStart = parseDateTime(date, slotTime);
    // The slot is "busy" if there's an overlap for the WHOLE duration required by the client
    const slotEnd = new Date(slotStart.getTime() + requestedDuration * 60000);

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
        const blockStartParsed = parseDateTime(date, `${blockStartH.toString().padStart(2, '0')}:${blockStartM.toString().padStart(2, '0')}`);
        const blockEndParsed = parseDateTime(date, `${blockEndH.toString().padStart(2, '0')}:${blockEndM.toString().padStart(2, '0')}`);

        if (isOverlapping(slotStart, slotEnd, blockStartParsed, blockEndParsed)) {
          busySlots.push(slotTime);
          break;
        }
      } else {
        const bookingStart = parseDateTime(booking.date, booking.time);
        // Calculate real end time based on hours or duration
        const durationMinutes = (booking.hours ? booking.hours * 60 : (booking.duration || 60));
        const bookingEnd = new Date(bookingStart.getTime() + durationMinutes * 60000);

        // If the 30-min slot falls inside an existing booking range, it's busy
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

  const busyStatuses = ['confirmed', 'pending', 'requested', 'proposed'];

  return existingBookings.some(existing => {
    if (!busyStatuses.includes(existing.status)) return false;
    if (existing.date !== newBooking.date) return false;

    const existingStart = parseDateTime(existing.date, existing.time);
    const existingEnd = new Date(existingStart.getTime() + (existing.duration || 60) * 60000);

    return isOverlapping(newStart, newEnd, existingStart, existingEnd);
  });
};

/**
 * Sends notifications via Resend email service
 */
export const sendBookingUpdateNotification = async (
  booking: BookingRecord,
  status: 'confirmed' | 'declined' | 'rescheduled' | 'pending' | 'proposed' | 'executed' | 'requested',
  reason?: string
): Promise<boolean> => {
  try {
    // For new bookings (pending/requested), notify admin only
    if (status === 'pending' || status === 'requested') {
      console.log(`📧 Sending admin notification for new booking (${status})...`);
      return await resendService.sendAdminNotification(booking);
    }

    // For proposed mandates (Phase 26), notify client
    if (status === 'proposed') {
      console.log('💎 Sending Fiduciary Proposal to client...');
      return await resendService.sendFiduciaryProposal(booking);
    }

    // For executed mandates (Phase 26), notify client
    if (status === 'executed') {
      console.log('🔏 Sending Completion & Oblivion email to client...');
      return await resendService.sendCompletionAndOblivion(booking);
    }

    // For confirmed bookings, notify client
    if (status === 'confirmed') {
      console.log('✅ Sending confirmation email to client...');
      return await resendService.sendClientConfirmation(booking);
    }

    // For declined bookings, notify client
    if (status === 'declined') {
      console.log('⚠️ Sending decline notification to client...');
      return await resendService.sendClientDecline(booking);
    }

    // For rescheduled bookings
    if (status === 'rescheduled') {
      console.log('📅 Reschedule notification ready');
      return true;
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to send notification:', error);
    return false;
  }
};
