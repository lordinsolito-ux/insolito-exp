import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  EyeOff,
  Crown,
  MapPin,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Zap,
  ThermometerSnowflake,
  Volume2,
  VolumeX,
  Instagram,
  MessageCircle,
  Phone,
  CreditCard,
  Banknote,
  Terminal,
  Dog,
  Globe,
  Plus,
  Trash2,
  Moon,
  ShieldCheck,
  History,
  Map,
  FileWarning,
  Map as MapIcon,
  Loader2,
  Lock,
  Star,
  Mail,
  Edit2
} from 'lucide-react';
import LegalModal from './components/LegalModal';
import { LEGAL_CONTENT } from './legalContent';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import { StepIndicator } from './components/StepIndicator';
import { GoogleMapLink } from './components/GoogleMapLink';
import { TermsModal } from './components/TermsModal';
import { BookingConfirmation } from './components/BookingConfirmation';
import { BookingHistoryModal } from './components/BookingHistoryModal';
import { AdminDashboard } from './components/AdminDashboard';
import { RouteModal } from './components/RouteModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import {
  SERVICE_TYPES,
  VEHICLE_TYPES,
  COUNTRY_CODES
} from './constants';
import {
  BookingFormData,
  VehicleTypeId,
  ValidationErrors,
  LocationSuggestion,
  RouteInfo,
  ServiceTypeId,
  BookingRecord
} from './types';
import { searchLocations, calculateRoute, calculatePrice } from './services/googleMapsService';
import { getCachedRoute, cacheRoute } from './services/routeCache';
import { generateTimeSlots, checkAvailability, checkBookingConflict, saveBooking, fetchAllBookings } from './services/bookingService';

// --- INTRO COMPONENT ---
const IntroSplash: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const { t } = useTranslation();
  const [showButton, setShowButton] = useState(false);
  const [playShow, setPlayShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSrc = "https://www.dropbox.com/scl/fi/trkgfjejfgayjdkgqvt75/Drive-in-Style.mp3?rlkey=ep7dkuq7hl7swnpys0m1p7c6a&e=1&st=ccy55v2q&raw=1";

  useEffect(() => {
    // Show button after a brief "loading" moment to allow fonts to load
    const timer = setTimeout(() => setShowButton(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = async () => {
    // 1. Hide Button immediately
    setShowButton(false);

    // 2. Start the "Show" (Logo animation + Audio)
    setPlayShow(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      try {
        await audioRef.current.play();
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    }

    // 3. Play for 3 seconds (giving enough time to read the new text) before exiting
    setTimeout(() => {
      setIsExiting(true);
      // Wait for fade out animation to finish before unmounting
      setTimeout(onFinish, 1500);
    }, 3000);
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1500 ease-in-out ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <audio ref={audioRef} src={audioSrc} preload="auto" />

      {/* Cinematic Background (Always visible) */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-900/30 via-black to-black"></div>
      <div className="absolute inset-0 bg-noise opacity-50"></div>

      {/* PHASE 1: THE BUTTON (Splash) */}
      {!playShow && (
        <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-700 ${showButton ? 'opacity-100' : 'opacity-0'}`}>

          {/* MAIN TITLE ON SPLASH */}
          <h1 className="text-3xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-b from-gold-100 to-gold-500 tracking-[0.2em] mb-12 drop-shadow-2xl animate-fade-in opacity-90">
            {t('hero.title')}
          </h1>

          <button
            onClick={handleEnter}
            className="group relative px-10 py-5 bg-transparent overflow-hidden transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* Button Borders & Glow */}
            <div className="absolute inset-0 border border-gold-500/20 group-hover:border-gold-500/60 transition-colors duration-700"></div>
            <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/5 transition-colors duration-700"></div>

            {/* Horizontal Lines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gold-500/50 group-hover:w-full transition-all duration-700"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gold-500/50 group-hover:w-full transition-all duration-700"></div>

            <div className="flex flex-col items-center gap-2">
              <span className="relative z-10 text-gold-100 font-display tracking-[0.3em] text-xs md:text-sm uppercase group-hover:text-white transition-colors">
                {t('hero.cta')}
              </span>
            </div>

            {/* Shine Effect */}
            <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-gold-500/20 opacity-40 group-hover:animate-shimmer" />
          </button>
        </div>
      )}

      {/* PHASE 2: THE SHOW (Logo Animation triggered on click) */}
      {playShow && (
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <div className="relative mb-8 animate-fade-in">
            <div className="absolute inset-0 bg-gold-500 blur-[100px] opacity-40 animate-pulse-slow"></div>
            <Crown className="w-24 h-24 md:w-32 md:h-32 text-gold-400 drop-shadow-[0_0_35px_rgba(212,175,55,0.4)] animate-zoom-out" strokeWidth={0.6} />
          </div>

          <h1 className="text-5xl md:text-8xl font-display text-transparent bg-clip-text bg-gradient-to-b from-gold-100 to-gold-600 tracking-[0.25em] mb-4 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
            INSOLITO
          </h1>

          <h2 className="text-xs md:text-sm font-serif text-gold-200/60 tracking-[0.8em] uppercase mb-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            {t('hero.subtitle')}
          </h2>

          {/* NEW KEYWORDS ANIMATION */}
          <div className="mt-6 flex items-center gap-4 md:gap-8 text-[10px] md:text-xs font-serif text-gold-400/70 uppercase tracking-[0.25em]">
            <span className="animate-fade-in" style={{ animationDelay: '1.5s' }}>Discretion</span>
            <span className="animate-fade-in text-gold-700" style={{ animationDelay: '1.7s' }}>•</span>
            <span className="animate-fade-in" style={{ animationDelay: '1.9s' }}>Serenity</span>
            <span className="animate-fade-in text-gold-700" style={{ animationDelay: '2.1s' }}>•</span>
            <span className="animate-fade-in" style={{ animationDelay: '2.3s' }}>Comfort</span>
          </div>
        </div>
      )}

      {/* Loading Indicator (Before button) */}
      {!showButton && !playShow && (
        <div className="absolute bottom-12">
          <div className="flex items-center gap-2 text-[9px] text-gold-500/40 tracking-[0.3em] uppercase animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" /> Loading
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const INITIAL_FORM_STATE: BookingFormData = {
  isVIP: false,
  serviceType: null,
  pickupLocation: '',
  stops: [],
  destination: '',
  date: '',
  time: '',
  duration: 0,
  passengers: 1,
  vehiclePreference: VehicleTypeId.SUV_COMFORT,
  specialRequests: '',
  contactMethod: 'whatsapp',
  estimatedPrice: 25,
  name: '',
  email: '',
  countryCode: '+39',
  phone: '',
  paymentMethod: 'link',
  hasPets: false,
  priceBreakdown: { total: 0, baseFare: 0, distanceFare: 0, nightSurcharge: 0, petFee: 0, stopFee: 0, serviceMultiplier: 1 }
};

const App: React.FC = () => {
  const { t } = useTranslation();
  const [showIntro, setShowIntro] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [currentLegalContent, setCurrentLegalContent] = useState({ title: '', content: '' });
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_STATE);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [showClientCode, setShowClientCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [searchingField, setSearchingField] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [bookingConflictError, setBookingConflictError] = useState<string | null>(null);

  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([]);
  const [stopSuggestions, setStopSuggestions] = useState<LocationSuggestion[]>([]);
  const [activeStopIndex, setActiveStopIndex] = useState<number | null>(null);
  const [showPickupSugg, setShowPickupSugg] = useState(false);
  const [showDestSugg, setShowDestSugg] = useState(false);
  const [showStopSugg, setShowStopSugg] = useState(false);

  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [hasShownRouteModal, setHasShownRouteModal] = useState(false);


  const containerRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isBookingConfirmed) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeStep > 1) {
      // Scroll to the booking card for intermediate steps to avoid jumping to top of page
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // For Step 1 (or initial load), we might want to see the header
      containerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeStep, isBookingConfirmed]);

  useEffect(() => {
    if (formData.serviceType && formData.vehiclePreference && routeInfo) {
      const breakdown = calculatePrice(
        formData.serviceType,
        formData.vehiclePreference,
        routeInfo.distance,
        formData.time,
        formData.hasPets,
        formData.stops.length,
        formData.date
      );
      setFormData(prev => ({
        ...prev,
        estimatedPrice: breakdown.total,
        priceBreakdown: breakdown,
        duration: routeInfo.duration
      }));
    } else if (!routeInfo) {
      setFormData(prev => ({ ...prev, estimatedPrice: 25, duration: 0 }));
    }
  }, [formData.serviceType, formData.vehiclePreference, routeInfo, formData.time, formData.hasPets, formData.stops.length]);

  useEffect(() => {
    let isMounted = true;
    setBookingConflictError(null);

    const fetchSlots = async () => {
      if (formData.date) {
        setIsLoadingSlots(true);
        setAvailableSlots([]);

        const theoreticalSlots = generateTimeSlots(formData.date);

        try {
          const busySlots = await checkAvailability(formData.date);

          if (isMounted) {
            const finalSlots = theoreticalSlots.filter(t => !busySlots.includes(t));
            setAvailableSlots(finalSlots);

            if (formData.time && !finalSlots.includes(formData.time)) {
              setFormData(prev => ({ ...prev, time: '' }));
            }
          }
        } catch (e) {
          console.error("Availability check failed", e);
          if (isMounted) {
            setAvailableSlots(theoreticalSlots);
          }
        } finally {
          if (isMounted) setIsLoadingSlots(false);
        }
      } else {
        setAvailableSlots([]);
      }
    };

    fetchSlots();

    return () => { isMounted = false; };
  }, [formData.date]);

  const isNightService = (time: string): boolean => {
    if (!time) return false;
    const [h, m] = time.split(':').map(Number);
    return (h < 6) || (h === 6 && m <= 30);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'time' || name === 'date') setBookingConflictError(null);

    if (name === 'clientCode') {
      const code = value.toUpperCase();
      if (code === 'INSOLITO' || code === 'VIP' || code === 'LUXURY') {
        setFormData(prev => ({ ...prev, [name]: value, isVIP: true }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value, isVIP: false }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLocationSearch = async (type: 'pickup' | 'destination' | 'stop', value: string, index?: number) => {
    const fieldId = type === 'stop' ? `stop-${index}` : type;

    if (type === 'stop' && index !== undefined) {
      const newStops = [...formData.stops];
      newStops[index] = value;
      setFormData(prev => ({ ...prev, stops: newStops }));
      setActiveStopIndex(index);
    } else {
      setFormData(prev => ({ ...prev, [type === 'pickup' ? 'pickupLocation' : 'destination']: value }));
    }

    if (value.length > 2) {
      setSearchingField(fieldId);
      const results = await searchLocations(value);
      setSearchingField(null);

      if (type === 'pickup') {
        setPickupSuggestions(results);
        setShowPickupSugg(true);
      } else if (type === 'destination') {
        setDestSuggestions(results);
        setShowDestSugg(true);
      } else if (type === 'stop') {
        setStopSuggestions(results);
        setShowStopSugg(true);
      }
    } else {
      setSearchingField(null);
      setShowPickupSugg(false);
      setShowDestSugg(false);
      setShowStopSugg(false);
    }
  };

  const handleInputBlur = () => {
    // Add delay to allow click events to process first
    setTimeout(() => {
      if (formData.pickupLocation && formData.destination) {
        triggerRouteCalc();
      }
    }, 300);
  };

  const selectPlace = (place: LocationSuggestion, type: 'pickup' | 'destination' | 'stop') => {
    // Reset modal flag when location changes
    setHasShownRouteModal(false);

    if (type === 'stop' && activeStopIndex !== null) {
      const newStops = [...formData.stops];
      newStops[activeStopIndex] = place.fullAddress; // Use fullAddress instead of shortAddress
      setFormData(prev => ({ ...prev, stops: newStops }));
      setShowStopSugg(false);
      setActiveStopIndex(null);
    } else {
      // Use fullAddress for better clarity
      setFormData(prev => ({ ...prev, [type === 'pickup' ? 'pickupLocation' : 'destination']: place.fullAddress }));
      if (type === 'pickup') setShowPickupSugg(false);
      else setShowDestSugg(false);
    }
    setTimeout(() => {
      if (formData.pickupLocation && formData.destination) {
        triggerRouteCalc();
      }
    }, 100);
  };

  const addStop = () => {
    if (formData.stops.length < 2) {
      setFormData(prev => ({ ...prev, stops: [...prev.stops, ''] }));
    }
  };

  const removeStop = (index: number) => {
    const newStops = formData.stops.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, stops: newStops }));
    setTimeout(triggerRouteCalc, 100);
  };

  const triggerRouteCalc = async () => {
    const origin = formData.pickupLocation;
    const dest = formData.destination;
    if (!origin || !dest) return;

    // 1. Check Cache
    const cached = getCachedRoute(origin, dest);
    if (cached) {
      console.log('✅ Using cached route!');
      setRouteInfo({
        distance: cached.distance,
        duration: cached.duration,
        traffic: cached.traffic,
        toll: cached.toll,
        mapUrl: cached.mapUrl
      });

      // Show modal briefly to confirm route found (or just to show details)
      if (!hasShownRouteModal) {
        setShowRouteModal(true);
        setHasShownRouteModal(true);
      }
      return;
    }

    // 2. Calculate New Route
    setIsCalculatingRoute(true);
    // Show modal immediately when starting calculation
    if (!hasShownRouteModal) {
      setShowRouteModal(true);
      setHasShownRouteModal(true);
    }

    try {
      const info = await calculateRoute(origin, dest, formData.stops);

      // 3. Save to Cache
      cacheRoute(origin, dest, info.distance, info.duration, info.traffic, info.toll, info.mapUrl);

      setRouteInfo(info);
    } catch (error) {
      console.error("Route calculation failed");
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  useEffect(() => {
    if (formData.pickupLocation && formData.destination) {
      triggerRouteCalc();
    }
  }, [formData.stops.length]);

  const validateStep = (step: number): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.serviceType) {
        errors.serviceType = "Please select a service type.";
        isValid = false;
      }
    } else if (step === 2) {
      if (!formData.pickupLocation) {
        errors.pickupLocation = "Pickup location required";
        isValid = false;
      }
      if (!formData.destination) {
        errors.destination = "Destination required";
        isValid = false;
      }
      if (!formData.date) {
        errors.date = "Date required";
        isValid = false;
      }
      if (!formData.time) {
        errors.time = "Time required";
        isValid = false;
      }
    } else if (step === 3) {
      if (!formData.name || formData.name.length < 2) {
        errors.name = "Name required";
        isValid = false;
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Valid email required";
        isValid = false;
      }
      if (!formData.phone || formData.phone.length < 5) {
        errors.phone = "Phone number required";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

  const handleServiceSelect = (id: ServiceTypeId) => {
    setFormData(prev => ({ ...prev, serviceType: id }));
    if (validationErrors.serviceType) {
      setValidationErrors(prev => ({ ...prev, serviceType: undefined }));
    }
    setTimeout(() => {
      setActiveStep(2);
    }, 500);
  };

  const handleResetApp = () => {
    setIsBookingConfirmed(false);
    setActiveStep(1);
    setFormData(INITIAL_FORM_STATE);
    setRouteInfo(null);
    setTermsAccepted(false);
    setBookingConflictError(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setBookingConflictError(null);

    try {
      const existingBookings = await fetchAllBookings();
      const hasConflict = checkBookingConflict(formData, existingBookings);

      if (hasConflict) {
        setBookingConflictError("Orario non disponibile. Seleziona un’altra fascia oraria.");
        setIsLoading(false);
        return;
      }

      const newBooking: BookingRecord = {
        ...formData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      // Save to Cloud & Local
      await saveBooking(newBooking, true); // Flag as NEW booking from client

    } catch (e) {
      console.error("Submission failed", e);
    }

    // Prepare WhatsApp
    const clientPhone = `${formData.countryCode} ${formData.phone}`;
    const message = `
*NEW BOOKING REQUEST* 👑
*STATUS:* Pending Approval ⏳
--------------------------------
*Client:* ${formData.name}
*Phone:* ${clientPhone}
*Email:* ${formData.email}
*Contact Preference:* ${formData.contactMethod === 'whatsapp' ? 'WhatsApp' : 'Phone Call'}
*Service:* ${SERVICE_TYPES.find(s => s.id === formData.serviceType)?.name}

*TRIP DETAILS* 📍
*From:* ${formData.pickupLocation}
${formData.stops.length > 0 ? `*Stops:* ${formData.stops.join(' ➔ ')}` : ''}
*To:* ${formData.destination}
*Date:* ${new Date(formData.date).toLocaleDateString()}
*Time:* ${formData.time} ${isNightService(formData.time) ? '🌙' : ''}
*Guests:* ${formData.passengers}

*PREFERENCES* ✨
*Vehicle:* ${VEHICLE_TYPES.find(v => v.id === formData.vehiclePreference)?.name}
*Payment:* ${formData.paymentMethod === 'pos' ? 'Card on Board (POS)' : 'Cash'}
*Pets:* ${formData.hasPets ? 'Yes (Carrier) 🐾' : 'No'}
${formData.specialRequests ? `*Notes:* ${formData.specialRequests}` : ''}

*ESTIMATED TOTAL:* €${formData.estimatedPrice}
--------------------------------
_Sent via INSOLITO Web App_
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const YOUR_BUSINESS_NUMBER = "393393522164";

    const whatsappUrl = `https://wa.me/${YOUR_BUSINESS_NUMBER}?text=${encodedMessage}`;

    // Remove timeout to prevent iOS popup blocking
    setIsLoading(false);
    setIsBookingConfirmed(true);

    // Use location.href for better mobile compatibility (avoids popup blockers)
    window.location.href = whatsappUrl;
  };

  return (
    <>
      {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <BookingHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={() => setShowAdminDashboard(true)}
      />
      <AdminDashboard isOpen={showAdminDashboard} onClose={() => setShowAdminDashboard(false)} />
      <RouteModal
        isOpen={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        origin={formData.pickupLocation}
        destination={formData.destination}
        routeInfo={routeInfo}
        isCalculating={isCalculatingRoute}
      />

      {isBookingConfirmed ? (
        <BookingConfirmation formData={formData} onReset={handleResetApp} />
      ) : (

        <div className={`min-h-screen bg-black text-gray-200 font-sans selection:bg-gold-500 selection:text-black relative overflow-x-hidden transition-opacity duration-1000 ${showIntro ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`} ref={containerRef}>

          {/* CINEMATIC BACKGROUND */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-black/50"></div>
            {/* Changed to Milan sunset/city street image as requested */}
            <img
              src="https://img.freepik.com/free-photo/reflective-photography-string-lights-river_413556-2.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Milan City Sunset"
              className="absolute inset-0 w-full h-full object-cover opacity-10 animate-fade-in mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
          </div>

          <header className="relative z-10 pt-20 pb-12 text-center overflow-hidden">
            <button
              onClick={() => setShowHistory(true)}
              className="absolute top-6 right-6 z-50 text-gold-400 hover:text-white transition-colors p-3 bg-black/20 rounded-full backdrop-blur-md border border-white/5 hover:border-gold-500/50 group"
              title="My Bookings"
            >
              <History className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            <div className="absolute top-[70px] right-6 z-50">
              <LanguageSwitcher />
            </div>

            <div className="relative inline-block">
              <h1 className="relative z-10 text-6xl md:text-8xl font-display text-transparent bg-clip-text bg-gradient-to-b from-gold-100 via-gold-300 to-gold-600 mb-6 tracking-[0.2em] animate-fade-in drop-shadow-2xl">
                INSOLITO
              </h1>
              <div className="absolute -inset-10 bg-gold-500/10 blur-[60px] rounded-full opacity-50 pointer-events-none"></div>
            </div>

            <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-6 opacity-60"></div>

            <h2 className="text-sm md:text-lg font-display text-gold-100/80 mb-3 tracking-[0.4em] uppercase">
              {t('hero.subtitle')}
            </h2>

            <div className="text-gold-500/80 text-[10px] md:text-xs tracking-[0.3em] uppercase font-sans font-bold opacity-80 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              MILAN <span className="text-gold-300 mx-1">•</span> BERGAMO <span className="text-gold-300 mx-1">•</span> LAKE COMO <span className="text-gold-300 mx-1">•</span> AIRPORTS <span className="text-gold-300 mx-1">•</span> PRIVATE PARTIES
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4 pb-20 relative z-10">
            <div
              ref={formCardRef}
              className="glass-card rounded-2xl shadow-2xl overflow-hidden relative border border-white/5 scroll-mt-24"
            >

              {/* Glossy Top Edge Highlight */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>

              <StepIndicator currentStep={activeStep} />

              <div className="p-6 md:p-12 min-h-[500px]">
                {activeStep === 1 && (
                  <div className="animate-fade-in space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                      <div>
                        <h3 className="text-3xl font-display text-gold-100 tracking-wide mb-1">
                          {t('booking.step1_title')}
                        </h3>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-light">{t('booking.step1_subtitle')}</p>
                      </div>

                      <div className="flex items-center gap-4 bg-white/5 px-4 py-3 rounded-full border border-white/5 focus-within:border-gold-700/50 transition-colors backdrop-blur-sm">
                        <span className="text-[10px] text-gold-500 uppercase tracking-widest font-bold">Code</span>
                        <div className="relative">
                          <input
                            type={showClientCode ? "text" : "password"}
                            name="clientCode"
                            value={formData.clientCode || ''}
                            onChange={handleInputChange}
                            placeholder="Optional"
                            className="bg-transparent border-none text-white placeholder-gray-600 w-24 focus:ring-0 text-xs font-mono tracking-wider py-0"
                          />
                          <button
                            type="button"
                            onClick={() => setShowClientCode(!showClientCode)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-400 transition-colors"
                          >
                            {showClientCode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {SERVICE_TYPES.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => handleServiceSelect(service.id)}
                          className={`
                          relative group text-left transition-all duration-500 p-8 border rounded-xl overflow-hidden
                          ${formData.serviceType === service.id
                              ? "bg-gradient-to-br from-gold-900/40 to-black border-gold-500/50 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                              : "bg-white/5 border-white/5 hover:border-gold-500/30 hover:bg-white/10"
                            }
                        `}
                        >
                          {service.badge && (
                            <div className="absolute top-0 right-0">
                              <div className="bg-gold-500 text-black text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-lg shadow-lg">
                                {service.badge}
                              </div>
                            </div>
                          )}

                          <div className={`
                          w-14 h-14 mb-6 rounded-full flex items-center justify-center border transition-all duration-500
                          ${formData.serviceType === service.id
                              ? 'border-gold-400 bg-gold-500/20 text-gold-300 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                              : 'border-white/10 bg-black/20 text-gray-500 group-hover:border-gold-500/30 group-hover:text-gold-200'
                            }
                        `}>
                            <service.icon className="w-6 h-6" strokeWidth={1.5} />
                          </div>

                          <h4 className={`font-display text-lg mb-2 tracking-wide transition-colors ${formData.serviceType === service.id ? 'text-gold-200' : 'text-gray-300 group-hover:text-white'}`}>
                            {service.name}
                          </h4>
                          <p className="text-xs text-gray-500 font-light leading-relaxed group-hover:text-gray-400 transition-colors tracking-wide mb-4">
                            {service.description}
                          </p>

                          {/* PRICE ANCHOR */}
                          {service.startingPrice && (
                            <div className={`mt-auto pt-4 border-t border-white/5 flex justify-between items-end transition-opacity duration-500 ${formData.serviceType === service.id ? 'border-gold-500/30' : ''}`}>
                              <span className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">From</span>
                              <span className={`font-display text-xl ${formData.serviceType === service.id ? 'text-gold-300' : 'text-gray-400 group-hover:text-gold-400'} transition-colors`}>
                                €{service.startingPrice}
                              </span>
                            </div>
                          )}

                          {/* Hover Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gold-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </button>
                      ))}
                    </div>
                    {validationErrors.serviceType && (
                      <p className="text-red-400 text-xs text-center font-light flex items-center justify-center gap-2 bg-red-900/10 py-2 rounded border border-red-900/20">
                        <AlertCircle className="w-3 h-3" /> {validationErrors.serviceType}
                      </p>
                    )}
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-3 mb-8">
                      <h3 className="text-3xl font-display text-gold-100 tracking-wide">{t('booking.step2_title')}</h3>
                      <p className="text-gray-500 font-serif italic text-sm">{t('booking.step2_subtitle')}</p>
                    </div>

                    <div className="relative z-20 space-y-6">

                      {/* ROUTE CARD */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                        <h4 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Map className="w-4 h-4" /> Route Details
                        </h4>

                        {/* ORIGIN FIELD */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase ml-1">{t('booking.origin')}</label>
                          <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-400 transition-colors z-10" />
                            <input
                              type="text"
                              value={formData.pickupLocation}
                              onChange={(e) => handleLocationSearch('pickup', e.target.value)}
                              onBlur={handleInputBlur}
                              placeholder="Airport, Hotel, or Address"
                              className={`w-full pl-12 pr-4 py-4 glass-input text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-0 transition-all font-light tracking-wide ${validationErrors.pickupLocation ? 'border-red-900/50' : ''}`}
                            />
                            {searchingField === 'pickup' && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                            {showPickupSugg && pickupSuggestions.length > 0 && (
                              <div className="absolute top-full left-0 w-full mt-1 bg-[#0A0A0C] border border-gold-900/30 shadow-2xl z-50 max-h-60 overflow-y-auto rounded-b-lg">
                                {pickupSuggestions.map(s => (
                                  <div
                                    key={s.id}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => selectPlace(s, 'pickup')}
                                    className="px-4 py-3 hover:bg-gold-900/10 cursor-pointer flex flex-col border-b border-white/5 last:border-0 group transition-colors"
                                  >
                                    <span className="text-gray-300 group-hover:text-gold-200 text-sm transition-colors">{s.shortAddress}</span>
                                    <span className="text-gray-600 text-xs">{s.fullAddress}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* STOPS */}
                        {formData.stops.map((stop, index) => (
                          <div key={index} className="space-y-2 relative animate-fade-in pl-8 border-l border-dashed border-gray-800 ml-4">
                            <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase flex justify-between">
                              <span>{t('booking.stops')} {index + 1}</span>
                              <button onClick={() => removeStop(index)} className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                                <Trash2 className="w-3 h-3" /> {t('booking.remove_stop')}
                              </button>
                            </label>
                            <div className="relative group">
                              <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-800 border border-gray-600"></div>
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-gold-400 transition-colors z-10" />
                              <input
                                type="text"
                                value={stop}
                                onChange={(e) => handleLocationSearch('stop', e.target.value, index)}
                                placeholder="Add stop location..."
                                className="w-full pl-12 pr-4 py-4 glass-input text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-0"
                              />
                              {searchingField === `stop-${index}` && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                  <div className="w-4 h-4 border border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                              {activeStopIndex === index && showStopSugg && stopSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-[#0A0A0C] border border-gold-900/30 shadow-2xl z-50 max-h-60 overflow-y-auto rounded-b-lg">
                                  {stopSuggestions.map(s => (
                                    <div
                                      key={s.id}
                                      onMouseDown={(e) => e.preventDefault()}
                                      onClick={() => selectPlace(s, 'stop')}
                                      className="px-4 py-3 hover:bg-gold-900/10 cursor-pointer flex flex-col border-b border-white/5 last:border-0"
                                    >
                                      <span className="text-gray-300 text-sm">{s.shortAddress}</span>
                                      <span className="text-gray-600 text-xs">{s.fullAddress}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {formData.stops.length < 2 && (
                          <div className="flex justify-end">
                            <button onClick={addStop} className="text-xs text-gold-500/80 hover:text-gold-300 flex items-center gap-2 uppercase tracking-wider px-4 py-2 hover:bg-gold-900/10 rounded transition-all">
                              <Plus className="w-3 h-3" /> {t('booking.add_stop')}
                            </button>
                          </div>
                        )}

                        {/* DESTINATION FIELD */}
                        <div className="space-y-2 relative z-10">
                          <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase ml-1">{t('booking.destination')}</label>
                          <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-400 transition-colors z-10" />
                            <input
                              type="text"
                              value={formData.destination}
                              onChange={(e) => handleLocationSearch('destination', e.target.value)}
                              onBlur={handleInputBlur}
                              placeholder="Destination"
                              className={`w-full pl-12 pr-4 py-4 glass-input text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-0 transition-all font-light tracking-wide ${validationErrors.destination ? 'border-red-900/50' : ''}`}
                            />
                            {(isCalculatingRoute || searchingField === 'destination') && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                            {showDestSugg && destSuggestions.length > 0 && (
                              <div className="absolute top-full left-0 w-full mt-1 bg-[#0A0A0C] border border-gold-900/30 shadow-2xl z-50 max-h-60 overflow-y-auto rounded-b-lg">
                                {destSuggestions.map(s => (
                                  <div
                                    key={s.id}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => selectPlace(s, 'destination')}
                                    className="px-4 py-3 hover:bg-gold-900/10 cursor-pointer flex flex-col border-b border-white/5 last:border-0 group transition-colors"
                                  >
                                    <span className="text-gray-300 group-hover:text-gold-200 text-sm transition-colors">{s.shortAddress}</span>
                                    <span className="text-gray-600 text-xs">{s.fullAddress}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Manual Confirm Button */}
                        <div className="flex justify-center pt-2">
                          <button
                            onClick={() => {
                              if (formData.pickupLocation && formData.destination) {
                                setShowRouteModal(true);
                                triggerRouteCalc();
                              }
                            }}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 rounded-lg transition-all group"
                          >
                            <Map className="w-4 h-4 text-gold-400 group-hover:text-gold-300" />
                            <span className="text-xs font-bold text-gold-400 group-hover:text-gold-300 tracking-widest uppercase">
                              {t('modal.confirm_address')}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* SCHEDULE CARD */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                        <h4 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Schedule
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* DATE */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase ml-1">DATE</label>
                            <div className="relative group">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-400 transition-colors z-10" />
                              <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={(e) => {
                                  handleInputChange(e);
                                  setFormData(prev => ({ ...prev, time: '' }));
                                }}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full pl-12 pr-4 py-4 glass-input text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-0 transition-all font-light tracking-wide ${validationErrors.date ? 'border-red-900/50' : ''}`}
                              />
                            </div>
                            {validationErrors.date && (
                              <p className="text-red-400 text-xs ml-1">{validationErrors.date}</p>
                            )}
                          </div>

                          {/* TIME */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase ml-1">TIME</label>
                            <div className="relative group">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-400 transition-colors z-10" />
                              <select
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                disabled={!formData.date || isLoadingSlots}
                                className={`w-full pl-12 pr-4 py-4 glass-input text-white placeholder-gray-600 focus:outline-none focus:ring-0 transition-all font-light tracking-wide ${validationErrors.time ? 'border-red-900/50' : ''}`}
                                style={{ colorScheme: 'dark' }}
                              >
                                <option value="" className="bg-gray-900 text-white">Select Date First</option>
                                {availableSlots.map(slot => {
                                  const isSun = formData.date ? new Date(formData.date).getDay() === 0 : false;
                                  const isNight = isNightService(slot);
                                  let label = '';
                                  if (isSun) label = ' (Sunday +30%)';
                                  else if (isNight) label = ' (Night +30%)';

                                  return (
                                    <option key={slot} value={slot} className="bg-gray-900 text-white">
                                      {slot}{label}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            {validationErrors.time && (
                              <p className="text-red-400 text-xs ml-1">{validationErrors.time}</p>
                            )}
                          </div>

                          {/* GUESTS */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase ml-1">GUESTS</label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-400 transition-colors z-10" />
                              <select
                                name="passengers"
                                value={formData.passengers}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-4 glass-input text-gray-200 focus:outline-none focus:ring-0 transition-all font-light tracking-wide"
                              >
                                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                                  <option key={n} value={n} className="bg-gray-900 text-white">{n}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-3 mb-8">
                      <h3 className="text-3xl font-display text-gold-100 tracking-wide">{t('booking.step3_title')}</h3>
                      <p className="text-gray-500 font-serif italic text-sm">{t('booking.step3_subtitle')}</p>
                    </div>

                    {/* PAYMENT CARD */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                      <h4 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-4 flex items-center gap-2 justify-center">
                        <CreditCard className="w-4 h-4" /> {t('booking.payment_method')}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { id: 'cash', label: 'Cash', sub: 'Pay Driver', icon: Banknote },
                          { id: 'pos', label: 'Card on Board', sub: 'POS Terminal', icon: Terminal },
                        ].map((method) => (
                          <div
                            key={method.id}
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id as any }))}
                            className={`
                                   p-4 border rounded-xl text-center cursor-pointer transition-all flex flex-col items-center group
                                   ${formData.paymentMethod === method.id
                                ? 'bg-gold-900/20 border-gold-500 text-gold-200 shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                                : 'bg-black/40 border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/20'
                              }
                                `}
                          >
                            <method.icon className={`w-5 h-5 mb-2 transition-colors ${formData.paymentMethod === method.id ? 'text-gold-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                            <div className="font-display tracking-wide text-xs mb-1">{method.label}</div>
                            <div className="text-[9px] opacity-60 uppercase tracking-widest">{method.sub}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* GUEST INFO CARD */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden space-y-6">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>

                      <h4 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                        <User className="w-4 h-4" /> {t('booking.guest_info')}
                      </h4>

                      <div className="space-y-6 relative z-10">
                        {/* Contact Method */}
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase block mb-3">{t('booking.contact_method')}</label>
                          <div className="flex gap-4 p-1 bg-black/50 rounded-lg border border-white/5">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, contactMethod: 'whatsapp' }))}
                              className={`flex-1 py-3 rounded-md flex items-center justify-center gap-2 transition-all ${formData.contactMethod === 'whatsapp' ? 'bg-gold-900/30 text-gold-400 border border-gold-500/30 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">WhatsApp</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, contactMethod: 'call' }))}
                              className={`flex-1 py-3 rounded-md flex items-center justify-center gap-2 transition-all ${formData.contactMethod === 'call' ? 'bg-gold-900/30 text-gold-400 border border-gold-500/30 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                              <Phone className="w-4 h-4" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Phone Call</span>
                            </button>
                          </div>
                        </div>

                        {/* Name & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase ml-1">{t('booking.name')}</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Your Name"
                              className={`w-full glass-input px-4 py-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-0 transition-all ${validationErrors.name ? 'border-red-900/50' : ''}`}
                            />
                            {validationErrors.name && <p className="text-red-400 text-xs">{validationErrors.name}</p>}
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase ml-1">{t('booking.email')}</label>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-400 z-10" />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="client@email.com"
                                className={`w-full glass-input pl-12 pr-4 py-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-0 transition-all ${validationErrors.email ? 'border-red-900/50' : ''}`}
                              />
                            </div>
                            {validationErrors.email && <p className="text-red-400 text-xs">{validationErrors.email}</p>}
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase ml-1">{t('booking.phone')}</label>
                          <div className="flex gap-2">
                            <div className="relative w-32 shrink-0">
                              <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleInputChange}
                                className="w-full h-full glass-input pl-3 pr-8 text-gray-200 appearance-none cursor-pointer focus:outline-none"
                              >
                                {COUNTRY_CODES.map(c => (
                                  <option key={c.code} value={c.code} className="bg-gray-900 text-white">
                                    {c.flag} {c.code}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronRight className="w-3 h-3 rotate-90 text-gray-500" />
                              </div>
                            </div>

                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="123 456 7890"
                              className={`w-full glass-input px-4 py-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-0 transition-all ${validationErrors.phone ? 'border-red-900/50' : ''}`}
                            />
                          </div>
                          {validationErrors.phone && <p className="text-red-400 text-xs">{validationErrors.phone}</p>}
                        </div>
                      </div>
                    </div>

                    {/* NOTES CARD */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                      <h4 className="text-xs font-bold text-gold-500 uppercase tracking-widest flex items-center gap-2">
                        <Edit2 className="w-4 h-4" /> {t('booking.notes')}
                      </h4>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder={t('booking.notes_placeholder')}
                        className="w-full bg-black/40 border border-white/10 rounded-lg focus:border-gold-500 text-gray-300 placeholder-gray-600 resize-none focus:ring-0 text-sm p-4 transition-colors"
                      />
                    </div>

                  </div>
                )}

                {activeStep === 4 && (
                  <div className="animate-fade-in max-w-3xl mx-auto">
                    <div className="bg-gradient-to-b from-gray-900 to-black border border-gold-900/30 p-8 md:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm">
                      {/* Decorative Elements */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50"></div>
                      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-500/5 rounded-full blur-[50px]"></div>

                      <Crown className="absolute -top-6 -right-6 w-48 h-48 text-gold-900/10 rotate-12" />

                      <div className="text-center mb-10 relative z-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-gold-500/30 mb-4 bg-gold-900/10 text-gold-400">
                          <Star className="w-5 h-5 fill-gold-400/20" />
                        </div>
                        <h3 className="text-3xl font-display text-transparent bg-clip-text bg-gradient-to-b from-gold-100 to-gold-400 tracking-widest">
                          {t('booking.step4_title')}
                        </h3>
                        <div className="w-16 h-px bg-gold-500/30 mx-auto mt-4"></div>
                      </div>

                      <div className="space-y-8 relative z-10">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                          <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t('booking.guest')}</div>
                            <div className="text-gold-100 font-display text-lg tracking-wide">{formData.name}</div>
                            <div className="text-xs text-gray-600 lowercase">{formData.email}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t('booking.contact')}</div>
                            <div className="text-white font-mono text-sm tracking-wide">{formData.countryCode} {formData.phone}</div>
                            <div className="text-[9px] text-gold-500/70 mt-1 uppercase tracking-widest">
                              via {formData.contactMethod === 'whatsapp' ? 'WhatsApp' : 'Phone Call'}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded border border-white/5">
                          <div className="flex justify-between items-end mb-4">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">{t('booking.service')}</div>
                            <div className="text-lg font-display text-gold-200">{SERVICE_TYPES.find(s => s.id === formData.serviceType)?.name}</div>
                          </div>

                          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                            <div>
                              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t('booking.pickup')}</div>
                              <div className="text-gray-200 font-light leading-tight">{formData.pickupLocation}</div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gold-500/50 to-transparent"></div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t('booking.dropoff')}</div>
                              <div className="text-gray-200 font-light leading-tight">{formData.destination}</div>
                            </div>
                          </div>

                          {formData.stops.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{t('booking.stops')}</div>
                              <div className="space-y-2">
                                {formData.stops.map((stop, i) => (
                                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
                                    {stop}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center border-b border-white/5 pb-8">
                          <div className="space-y-1">
                            <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">{t('booking.date')}</div>
                            <div className="text-white text-sm">{new Date(formData.date).toLocaleDateString()}</div>
                          </div>
                          <div className="space-y-1 border-l border-white/5">
                            <Clock className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">{t('booking.time')}</div>
                            <div className="text-white text-sm">{formData.time}</div>
                          </div>
                          <div className="space-y-1 border-l border-white/5">
                            <User className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">{t('booking.passengers')}</div>
                            <div className="text-white text-sm">{formData.passengers}</div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{t('booking.base_fare')}</span>
                              <span>€{formData.priceBreakdown.baseFare + formData.priceBreakdown.distanceFare}</span>
                            </div>
                            {formData.priceBreakdown.stopFee > 0 && (
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{t('booking.extra_stops')} ({formData.stops.length})</span>
                                <span>+€{formData.priceBreakdown.stopFee}</span>
                              </div>
                            )}
                            {formData.priceBreakdown.nightSurcharge > 0 && (
                              <div className="flex justify-between text-xs text-gold-400/80">
                                <span>{t('booking.night_service')} (+30%)</span>
                                <span>+€{formData.priceBreakdown.nightSurcharge}</span>
                              </div>
                            )}
                            {formData.priceBreakdown.petFee > 0 && (
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{t('booking.pet_fee')}</span>
                                <span>+€{formData.priceBreakdown.petFee}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-end p-6 bg-gold-900/10 border border-gold-500/20 rounded">
                            <div className="text-gold-200/70 text-xs font-light uppercase tracking-widest">
                              {t('booking.total')}
                            </div>
                            <div className="text-4xl font-display text-gold-400 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                              €{formData.estimatedPrice}
                            </div>
                          </div>

                          <div className="text-[10px] text-gray-600 mt-4 text-center leading-relaxed">
                            <p>{t('booking.waiting_time')}</p>
                            <p>{t('booking.night_surcharge_note')}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-3 animate-fade-in bg-black/20 p-3 rounded">
                          <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600 bg-black text-gold-500 focus:ring-gold-500 focus:ring-offset-black transition-all cursor-pointer"
                          />
                          <label htmlFor="terms" className="text-xs text-gray-400 select-none cursor-pointer">
                            {t('booking.terms_agree')} <button onClick={() => setShowTerms(true)} className="text-gold-400 hover:text-gold-300 underline underline-offset-4 transition-colors">{t('booking.terms_link')}</button>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/5 p-6 md:p-8 bg-[#0A0A0C]/90 backdrop-blur-xl flex justify-between items-center sticky bottom-0 z-40">
                <button
                  onClick={handlePrevStep}
                  disabled={activeStep === 1 || isBookingConfirmed}
                  className={`
                  flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:-translate-x-1
                  ${(activeStep === 1 || isBookingConfirmed) ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:text-white'}
                `}
                >
                  <ChevronLeft className="w-3 h-3" /> {t('booking.back')}
                </button>

                {!isBookingConfirmed && activeStep < 4 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={activeStep === 2 && isCalculatingRoute}
                    className="group relative px-10 py-4 bg-gold-500 text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-gold-400 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.4)] rounded-sm"
                  >
                    <span className="relative z-10">{t('booking.continue')}</span>
                    <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out z-0"></div>
                    <ChevronRight className="w-3 h-3 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : !isBookingConfirmed ? (
                  <div className="flex flex-col items-end gap-2">
                    {bookingConflictError && (
                      <div className="text-red-400 text-[10px] font-bold uppercase tracking-widest bg-red-900/20 px-3 py-1 rounded border border-red-900/50 animate-pulse flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" /> {bookingConflictError}
                      </div>
                    )}
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || !termsAccepted}
                      className="relative px-10 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed rounded-sm overflow-hidden group"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="relative z-10">{t('booking.request_booking')}</span>
                          <Crown className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        </>
                      )}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </main>

          <footer className="relative z-10 py-12 text-center text-gray-600 text-[10px] tracking-widest uppercase border-t border-white/5 bg-black/50 backdrop-blur-sm mt-20">
            <div className="flex justify-center gap-8 mb-8">
              <a href="https://instagram.com/insolito.experiences" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors duration-300 flex items-center gap-2 group">
                <div className="p-2 border border-white/10 rounded-full group-hover:border-gold-500/50 transition-colors">
                  <Instagram className="w-4 h-4" />
                </div>
                <span className="hidden md:inline group-hover:translate-x-1 transition-transform">insolito.experiences</span>
              </a>
              <a href="https://wa.me/393393522164" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors duration-300 flex items-center gap-2 group">
                <div className="p-2 border border-white/10 rounded-full group-hover:border-gold-500/50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="hidden md:inline group-hover:translate-x-1 transition-transform">+39 3393522164</span>
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex justify-center gap-6 mb-8 text-[9px] font-medium">
              <button
                onClick={() => { setCurrentLegalContent(LEGAL_CONTENT.privacy); setShowLegalModal(true); }}
                className="hover:text-gold-400 transition-colors duration-300 relative group"
              >
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => { setCurrentLegalContent(LEGAL_CONTENT.terms); setShowLegalModal(true); }}
                className="hover:text-gold-400 transition-colors duration-300 relative group"
              >
                Termini e Condizioni
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => { setCurrentLegalContent(LEGAL_CONTENT.cookies); setShowLegalModal(true); }}
                className="hover:text-gold-400 transition-colors duration-300 relative group"
              >
                Cookies
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 opacity-60">
              <p>&copy; {new Date().getFullYear()} Insolito Experiences. Tutti i diritti riservati.</p>
              <p className="text-[9px]">ATECO 96.99.99 - Servizi alla Persona | P.IVA: IT14379200968 | Milano</p>

              <button
                onClick={() => setShowAdminLogin(true)}
                className="hover:text-gold-500 transition-colors mt-2"
                title={t('booking.admin_access')}
              >
                <Lock className="w-3 h-3" />
              </button>
            </div>
          </footer>
        </div>
      )}

      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        title={currentLegalContent.title}
        content={currentLegalContent.content}
      />
    </>
  );
};

export default App;