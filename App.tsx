import React, { useState, useEffect, useRef } from 'react';
import {
  Crown,
  MapPin,
  Calendar,
  Clock,
  User,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  History,
  Instagram,
  MessageCircle,
  Phone,
  CreditCard,
  Banknote,
  Terminal,
  Moon,
  Map,
  Star,
  Mail,
  Edit2,
  Trash2,
  Plus,
  Lock,
  ArrowRight,
  X
} from 'lucide-react';
import LegalModal from './components/LegalModal';
import { LEGAL_CONTENT, BUSINESS_INFO, BRAND_STORY } from './legalContent';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import { StepIndicator } from './components/StepIndicator';
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
    const timer = setTimeout(() => setShowButton(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = async () => {
    setShowButton(false);
    setPlayShow(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      try {
        await audioRef.current.play();
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    }

    setTimeout(() => {
      setIsExiting(true);
      setTimeout(onFinish, 2000);
    }, 5000);
  };

  return (
    <div className={`fixed inset-0 z-[200] bg-[var(--perla-dorata)] flex flex-col items-center justify-center transition-all duration-[2500ms] ease-in-out ${isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'}`}>
      <audio ref={audioRef} src={audioSrc} preload="auto" />
      <div className="absolute inset-0 bg-noise"></div>

      {!playShow && (
        <div className={`flex flex-col items-center max-w-xl text-center px-12 transition-all duration-[2500ms] ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-px h-32 bg-gradient-to-b from-transparent via-[var(--oro-lucido)]/30 to-transparent mb-16"></div>
          <h1 className="text-5xl md:text-7xl font-display text-gold tracking-[0.3em] mb-12 italic opacity-90">
            INSOLITO PRIVÉ
          </h1>
          <p className="text-[10px] font-accent text-[var(--oro-lucido)]/50 tracking-[1.2em] mb-20 uppercase">
            Lifestyle Management
          </p>
          <button
            onClick={handleEnter}
            className="btn-prive group"
          >
            <span className="relative z-10">
              Inquire for Access
            </span>
          </button>
        </div>
      )}

      {playShow && (
        <div className="relative z-10 flex flex-col items-center text-center px-12 animate-fade">
          <div className="flex flex-col gap-4 mb-24 opacity-30">
            <span className="text-[9px] font-accent tracking-[1.5em] uppercase">Private Access Only</span>
          </div>
          <div className="max-w-3xl space-y-12">
            <h2 className="text-3xl md:text-5xl font-display text-[var(--bronzo-profondo)] leading-relaxed italic tracking-wide">
              "L'architettura del tempo,<br />
              <span className="text-[var(--oro-lucido)]">la maestria della discrezione."</span>
            </h2>
          </div>
          <h1 className="text-6xl md:text-[10rem] font-display text-gold tracking-[0.3em] leading-none mt-32">
            INSOLITO
          </h1>
          <span className="text-[10px] font-accent text-[var(--oro-lucido)]/40 tracking-[2em] uppercase mt-12">
            Personal Lifestyle Concierge
          </span>
        </div>
      )}
    </div>
  );
};

// --- BRAND STORY SECTION ---

// BrandStory removed

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
  paymentMethod: 'cash',
  hasPets: false,
  priceBreakdown: { total: 0, baseFare: 0, distanceFare: 0, nightSurcharge: 0, petFee: 0, stopFee: 0, serviceMultiplier: 1 }
};

const BrandStoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
      <div className="absolute inset-0 bg-[var(--perla-dorata)]/95 backdrop-blur-2xl" onClick={onClose} />

      <div className="relative w-full max-w-6xl max-h-full overflow-y-auto luxury-monolith p-12 md:p-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center animate-reveal border-[var(--oro-lucido)]/10 shadow-3xl bg-white/90">
        <button onClick={onClose} className="absolute top-10 right-10 text-[var(--oro-lucido)]/20 hover:text-[var(--oro-lucido)] transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-16">
          <div className="space-y-8">
            <span className="text-[var(--oro-lucido)]/40 font-accent text-[10px] uppercase tracking-[1.2em] mb-4 block">Founder & Visionary</span>
            <h2 className="text-6xl md:text-8xl font-display text-gold tracking-[0.1em] leading-tight opacity-95">
              Michael Jara
            </h2>
            <p className="text-[var(--oro-lucido)] font-accent text-[11px] leading-relaxed tracking-[1.5em] uppercase pl-1">
              INSOLITO PRIVÉ
            </p>
          </div>

          <div className="space-y-10 border-l border-[var(--oro-lucido)]/10 pl-12">
            {BRAND_STORY.content.map((p, i) => (
              <p key={i} className="text-[var(--bronzo-profondo)] text-[15px] md:text-base font-light font-display italic leading-relaxed tracking-widest">
                {p}
              </p>
            ))}
          </div>

          <div className="pt-12">
            <div className="flex items-center gap-12">
              <div className="h-[0.5px] w-24 bg-[var(--oro-lucido)]/20"></div>
              <span className="text-[10px] text-[var(--oro-lucido)]/40 font-accent uppercase tracking-[1em]">L'Eccellenza della Riservatezza</span>
            </div>
          </div>
        </div>

        <div className="relative group hidden lg:block overflow-hidden">
          <div className="aspect-[4/6] rounded-sm overflow-hidden border border-[var(--oro-lucido)]/10 relative bg-white/[0.02] grayscale contrast-125">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
              alt="Michael Jara"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[6000ms] ease-out group-hover:grayscale-0"
            />
            <div className="absolute inset-x-0 bottom-16 px-16 text-center">
              <blockquote className="text-[var(--bronzo-profondo)] font-display text-3xl italic leading-tight tracking-wide opacity-90">
                "{BRAND_STORY.quote}"
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAGAZINE NARRATIVE SPREAD ---
const NarrativeSpread: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-64 px-12 md:px-24 space-y-64 bg-transparent relative z-20 overflow-hidden">
      {/* Spread 1: The Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-7xl mx-auto">
        <div className="lg:col-span-12 xl:col-span-5 space-y-16 animate-reveal">
          <span className="text-[var(--oro-lucido)]/40 font-accent text-[10px] uppercase tracking-[1em] block mb-8">The Philosophy</span>
          <h2 className="text-5xl md:text-8xl font-display text-[var(--bronzo-profondo)] italic leading-[1.1] tracking-tight">
            L'Arte di<br /><span className="text-gold">Scomparire.</span>
          </h2>
          <p className="text-[var(--bronzo-profondo)]/80 font-display text-2xl md:text-3xl leading-relaxed italic max-w-xl py-12 border-y border-[var(--oro-lucido)]/10">
            "La vera eccellenza non urla. Si manifesta in quell'ombra perfetta che anticipa ogni tua necessità, proteggendo il tuo tempo e la tua pace."
          </p>
        </div>
        <div className="lg:col-span-12 xl:col-span-7 xl:pl-24 relative">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] shadow-3xl group transition-all duration-[3000ms]">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cc1ad4706?q=85&w=2600&auto=format&fit=crop"
              alt="Elite Discretion"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[6000ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bronzo-profondo)]/20 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Spread 2: What We Do */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 max-w-7xl mx-auto items-center">
        <div className="lg:col-span-12 xl:col-span-5 order-2 xl:order-1 relative">
          <div className="aspect-[3/4] overflow-hidden rounded-[2px] border border-[var(--oro-lucido)]/10 shadow-3xl">
            <img
              src="https://images.unsplash.com/photo-1513581026335-113b1740c0cd?q=85&w=2600&auto=format&fit=crop"
              alt="Milano Lifestyle"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-center space-y-20 xl:pl-24 order-1 xl:order-2">
          <h3 className="text-4xl md:text-6xl font-display text-[var(--bronzo-profondo)] tracking-tight italic">Servizio alla Persona,<br /><span className="text-gold">Elevato a Concierge.</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8">
            <div className="space-y-6">
              <h4 className="text-[var(--oro-lucido)] font-accent text-[10px] tracking-[0.5em] uppercase">Executive Guardian</h4>
              <p className="text-[var(--bronzo-profondo)] text-sm leading-relaxed font-light font-accent">Non siamo semplici vettori. Siamo il tuo sigillo legale e fisico a Milano, proteggendo il tuo tempo e la tua immagine.</p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[var(--oro-lucido)] font-accent text-[10px] tracking-[0.5em] uppercase">Private Logistics</h4>
              <p className="text-[var(--bronzo-profondo)] text-sm leading-relaxed font-light font-accent">Ogni rientro, ogni spostamento è una missione di sicurezza e assistenza millimetrica, riservata a pochi.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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
  const [showBrandStory, setShowBrandStory] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_STATE);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

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
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  }, [formData.serviceType, formData.vehiclePreference, routeInfo, formData.time, formData.hasPets, formData.stops.length, formData.date]);

  useEffect(() => {
    let isMounted = true;
    const fetchSlots = async () => {
      if (formData.date) {
        setIsLoadingSlots(true);
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
          if (isMounted) setAvailableSlots(theoreticalSlots);
        } finally {
          if (isMounted) setIsLoadingSlots(false);
        }
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
      if (type === 'pickup') { setPickupSuggestions(results); setShowPickupSugg(true); }
      else if (type === 'destination') { setDestSuggestions(results); setShowDestSugg(true); }
      else if (type === 'stop') { setStopSuggestions(results); setShowStopSugg(true); }
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => { if (formData.pickupLocation && formData.destination) triggerRouteCalc(); }, 300);
  };

  const selectPlace = (place: LocationSuggestion, type: 'pickup' | 'destination' | 'stop') => {
    setHasShownRouteModal(false);
    if (type === 'stop' && activeStopIndex !== null) {
      const newStops = [...formData.stops];
      newStops[activeStopIndex] = place.fullAddress;
      setFormData(prev => ({ ...prev, stops: newStops }));
      setShowStopSugg(false);
    } else {
      setFormData(prev => ({ ...prev, [type === 'pickup' ? 'pickupLocation' : 'destination']: place.fullAddress }));
      if (type === 'pickup') setShowPickupSugg(false); else setShowDestSugg(false);
    }
    setTimeout(() => { if (formData.pickupLocation && formData.destination) triggerRouteCalc(); }, 100);
  };

  const triggerRouteCalc = async () => {
    const origin = formData.pickupLocation;
    const dest = formData.destination;
    if (!origin || !dest) return;
    const cached = getCachedRoute(origin, dest);
    if (cached) {
      setRouteInfo(cached);
      if (!hasShownRouteModal) { setShowRouteModal(true); setHasShownRouteModal(true); }
      return;
    }
    setIsCalculatingRoute(true);
    if (!hasShownRouteModal) { setShowRouteModal(true); setHasShownRouteModal(true); }
    try {
      const info = await calculateRoute(origin, dest, formData.stops);
      cacheRoute(origin, dest, info.distance, info.duration, info.traffic, info.toll, info.mapUrl);
      setRouteInfo(info);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const addStop = () => { if (formData.stops.length < 2) setFormData(prev => ({ ...prev, stops: [...prev.stops, ''] })); };
  const removeStop = (index: number) => {
    const newStops = formData.stops.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, stops: newStops }));
    setTimeout(triggerRouteCalc, 100);
  };

  const validateStep = (step: number): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;
    if (step === 1 && !formData.serviceType) { errors.serviceType = t('validation.required'); isValid = false; }
    else if (step === 2) {
      if (!formData.pickupLocation) { errors.pickupLocation = t('validation.required'); isValid = false; }
      if (!formData.destination) { errors.destination = t('validation.required'); isValid = false; }
      if (!formData.date) { errors.date = t('validation.required'); isValid = false; }
      if (!formData.time) { errors.time = t('validation.required'); isValid = false; }
    } else if (step === 3) {
      if (!formData.name) { errors.name = t('validation.required'); isValid = false; }
      if (!formData.email) { errors.email = t('validation.required'); isValid = false; }
      if (!formData.phone) { errors.phone = t('validation.required'); isValid = false; }
    }
    setValidationErrors(errors);
    return isValid;
  };

  const handleNextStep = () => { if (validateStep(activeStep)) setActiveStep(prev => Math.min(prev + 1, 4)); };
  const handlePrevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));
  const handleServiceSelect = (id: ServiceTypeId) => { setFormData(prev => ({ ...prev, serviceType: id })); setActiveStep(2); };
  const handleResetApp = () => { setIsBookingConfirmed(false); setActiveStep(1); setFormData(INITIAL_FORM_STATE); setRouteInfo(null); setTermsAccepted(false); };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const existingBookings = await fetchAllBookings();
      if (checkBookingConflict(formData, existingBookings)) {
        setBookingConflictError(t('booking.conflict_error'));
        setIsLoading(false);
        return;
      }
      const newBooking: BookingRecord = { ...formData, id: Date.now().toString(), timestamp: new Date().toISOString(), status: 'pending' };
      await saveBooking(newBooking, true);
      const message = `*NEW ASSISTANCE REQUEST* 👑\n*Client:* ${formData.name}\n*Concierge Services:* ${SERVICE_TYPES.find(s => s.id === formData.serviceType)?.name}\n*Pick-up:* ${formData.pickupLocation}\n*Destination:* ${formData.destination}\n*Date:* ${new Date(formData.date).toLocaleDateString()}\n*Time:* ${formData.time}\n*Total:* €${formData.estimatedPrice}`;
      window.location.href = `https://wa.me/393393522164?text=${encodeURIComponent(message)}`;
      setIsBookingConfirmed(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <BookingHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <AdminLoginModal isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} onLoginSuccess={() => setShowAdminDashboard(true)} />
      <AdminDashboard isOpen={showAdminDashboard} onClose={() => setShowAdminDashboard(false)} />
      <RouteModal isOpen={showRouteModal} onClose={() => setShowRouteModal(false)} origin={formData.pickupLocation} destination={formData.destination} routeInfo={routeInfo} isCalculating={isCalculatingRoute} />

      {isBookingConfirmed ? (
        <BookingConfirmation formData={formData} onReset={handleResetApp} />
      ) : (
        <div className={`min-h-screen bg-[var(--perla-dorata)] text-[var(--bronzo-profondo)] font-sans relative overflow-x-hidden transition-opacity duration-[2000ms] ${showIntro ? 'opacity-0' : 'opacity-100'}`} ref={containerRef}>
          {/* CINEMATIC RADIANT BACKGROUND */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[var(--perla-dorata)]"></div>

            {/* VIBRANT GOLD LAYERS */}
            <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] opacity-[0.1]" style={{ background: 'radial-gradient(circle, var(--oro-lucido), transparent 70%)' }}></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] opacity-[0.05]" style={{ background: 'radial-gradient(circle, var(--oro-rosa), transparent 70%)' }}></div>

            {/* REFINED GRAIN */}
            <div className="absolute inset-0 bg-noise opacity-[0.15]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20"></div>
          </div>

          <header className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-transparent py-24">
            {/* Magazine Cover Navigation */}
            <nav className="flex items-center justify-between px-12 md:px-24 absolute top-12 left-0 w-full z-20">
              <div className="flex items-center gap-6 group cursor-pointer" onClick={() => setShowAdminLogin(true)}>
                <div className="w-8 h-8 rounded-full border border-[var(--oro-lucido)]/20 flex items-center justify-center transition-all duration-700">
                  <Crown className="w-4 h-4 text-[var(--oro-lucido)]/40 group-hover:text-[var(--oro-lucido)]" strokeWidth={1} />
                </div>
                <span className="text-[10px] text-[var(--oro-lucido)]/40 uppercase tracking-[0.8em] group-hover:text-[var(--oro-lucido)] transition-all duration-700 font-accent hidden md:block">Privé Index</span>
              </div>
              <div className="flex items-center gap-12">
                <button onClick={() => setShowHistory(true)} className="text-[10px] text-[var(--oro-lucido)]/40 hover:text-[var(--oro-lucido)] border-none tracking-[0.6em] font-accent">Archive</button>
                <LanguageSwitcher />
              </div>
            </nav>

            {/* Main Cover Title */}
            <div className="relative text-center z-10 space-y-16 animate-reveal">
              <p className="text-[10px] font-accent text-[var(--oro-lucido)]/40 tracking-[2em] uppercase mb-4 ml-[2em]">The Excellence of Privacy</p>
              <div className="relative">
                <h1 className="text-7xl md:text-[13rem] font-display text-gold tracking-[0.1em] leading-none mb-4">
                  INSOLITO
                </h1>
                <span className="block text-3xl md:text-5xl font-display text-[var(--oro-lucido)]/60 tracking-[1.5em] mt-8">PRIVÉ</span>
              </div>
              <div className="max-w-2xl mx-auto space-y-12 pt-16">
                <p className="text-[11px] md:text-xs font-accent text-[var(--oro-lucido)]/60 tracking-[0.8em] uppercase leading-relaxed font-light">
                  Elite Assistance <span className="text-[var(--oro-lucido)]/20 px-4">|</span> Personal Concierge <span className="text-[var(--oro-lucido)]/20 px-4">|</span> Reserved Luxury
                </p>
              </div>
            </div>

            {/* Scroll Hint */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-8 animate-fade opacity-40">
              <span className="text-[9px] font-accent text-[var(--oro-lucido)] tracking-[1em] uppercase vertical-text">Enter the Vitrine</span>
              <div className="w-px h-16 bg-gradient-to-b from-[var(--oro-lucido)] to-transparent"></div>
            </div>
          </header>

          <main className="bg-transparent relative z-10">
            <NarrativeSpread />

            <div className="max-w-4xl mx-auto px-6 pb-12">
              {/* THE MONOLITH: A Single, Sweeping Experience */}
              <div ref={formCardRef} className="luxury-monolith rounded-sm overflow-hidden animate-reveal">
                <StepIndicator currentStep={activeStep} />

                <div className="p-12 md:p-20">
                  {activeStep === 1 && (
                    <div className="animate-reveal space-y-24">
                      <div className="space-y-6 text-center max-w-2xl mx-auto">
                        <span className="text-[10px] text-[var(--oro-lucido)]/40 font-accent uppercase tracking-[1.5em] mb-4 block">The Selection</span>
                        <h3 className="text-6xl md:text-8xl font-display text-[var(--bronzo-profondo)] tracking-[0.1em] lowercase italic">Seleziona.</h3>
                        <p className="text-[var(--bronzo-profondo)]/60 font-display text-xl md:text-2xl leading-relaxed italic pt-6 px-12 border-t border-[var(--oro-lucido)]/10 mt-12">
                          "Costruiamo l'accesso riservato ai tuoi desideri, con una cura che non lascia spazio all'incertezza."
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-12 pt-16">
                        {SERVICE_TYPES.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => handleServiceSelect(service.id)}
                            className="group catalog-selector flex flex-col md:flex-row items-center gap-0 overflow-hidden text-left bg-white/95 border border-[var(--oro-lucido)]/20 shadow-lg hover:shadow-2xl"
                          >
                            <div className="w-full md:w-2/5 aspect-[16/9] md:aspect-[4/3] relative overflow-hidden transition-all duration-[2000ms] border-r border-[var(--oro-lucido)]/10">
                              <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4000ms]" />
                              <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent"></div>
                            </div>

                            <div className="w-full md:w-3/5 p-12 md:p-16 flex flex-col justify-center space-y-8">
                              <div className="flex items-center gap-6">
                                <div className="h-[0.5px] w-8 bg-[var(--oro-lucido)]/30 group-hover:w-16 transition-all duration-700"></div>
                                <span className="text-[9px] font-accent text-[var(--oro-lucido)] uppercase tracking-[1em]">{service.badge || 'Privé'}</span>
                              </div>
                              <div className="space-y-4">
                                <h4 className="font-display text-4xl md:text-5xl text-[var(--bronzo-profondo)] tracking-[0.05em] leading-tight">
                                  {service.name}
                                </h4>
                                <p className="text-[13px] text-[var(--bronzo-profondo)]/80 font-display italic leading-relaxed max-w-md tracking-wide font-medium">
                                  {service.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                                <span className="text-[10px] text-[var(--oro-lucido)] font-accent uppercase tracking-[0.6em]">Request Reserved Access</span>
                                <ArrowRight className="w-4 h-4 text-[var(--oro-lucido)]" />
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="animate-reveal space-y-20">
                      <div className="space-y-6">
                        <h3 className="text-5xl md:text-6xl font-display text-[var(--bronzo-profondo)] tracking-widest italic">{t('booking.details')}</h3>
                        <div className="gold-line"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-12">
                          <h4 className="text-[9px] font-accent text-[var(--oro-lucido)]/40 uppercase tracking-[1em] mb-4">Itinerary</h4>
                          <div className="space-y-6">
                            <input type="text" value={formData.pickupLocation} onChange={(e) => handleLocationSearch('pickup', e.target.value)} onBlur={handleInputBlur} placeholder={t('booking.pickup')} className="w-full px-8 py-6 elite-input text-[11px] tracking-widest uppercase" />
                            <input type="text" value={formData.destination} onChange={(e) => handleLocationSearch('destination', e.target.value)} onBlur={handleInputBlur} placeholder={t('booking.destination')} className="w-full px-8 py-6 elite-input text-[11px] tracking-widest uppercase" />
                          </div>
                        </div>
                        <div className="space-y-12">
                          <h4 className="text-[9px] font-accent text-[var(--oro-lucido)]/40 uppercase tracking-[1em] mb-4">Reserved Schedule</h4>
                          <div className="space-y-6">
                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} className="w-full px-8 py-6 elite-input text-[11px] tracking-widest" style={{ colorScheme: 'light' }} />
                            <select name="time" value={formData.time} onChange={handleInputChange} disabled={!formData.date} className="w-full px-8 py-6 elite-input text-[11px] tracking-widest uppercase appearance-none bg-white/10">
                              <option value="">{t('booking.time')}</option>
                              {availableSlots.map(s => <option key={s} value={s}>{s} {isNightService(s) ? '(Night)' : ''}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="animate-reveal space-y-20">
                      <div className="space-y-6">
                        <h3 className="text-5xl md:text-6xl font-display text-[var(--bronzo-profondo)] tracking-widest italic">{t('booking.guest_info')}</h3>
                        <div className="gold-line"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-8">
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={t('booking.name')} className="w-full px-8 py-6 elite-input text-[11px] tracking-widest uppercase" />
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t('booking.email')} className="w-full px-8 py-6 elite-input text-[11px] tracking-widest" />
                          <div className="flex gap-4">
                            <select name="countryCode" value={formData.countryCode} onChange={handleInputChange} className="w-32 px-4 py-6 elite-input text-[11px] bg-white/10">
                              {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                            </select>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder={t('booking.phone')} className="flex-1 px-8 py-6 elite-input text-[11px] tracking-widest" />
                          </div>
                        </div>
                        <div className="space-y-12">
                          <h4 className="text-[9px] font-accent text-[var(--oro-lucido)]/40 uppercase tracking-[1em] mb-4">Reserved Settlement</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {['cash', 'pos'].map(m => (
                              <button key={m} onClick={() => setFormData(p => ({ ...p, paymentMethod: m as any }))} className={`py-6 border text-[9px] uppercase tracking-[0.4em] transition-all ${formData.paymentMethod === m ? 'border-[var(--oro-lucido)] text-[var(--oro-lucido)] bg-[var(--oro-lucido)]/5 font-bold' : 'border-[var(--oro-lucido)]/10 text-[var(--oro-lucido)]/40 hover:border-[var(--oro-lucido)]/30'}`}>
                                {m}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div className="animate-reveal space-y-20 text-center">
                      <div className="space-y-8">
                        <Star className="w-12 h-12 text-[var(--oro-lucido)]/30 mx-auto" strokeWidth={0.5} />
                        <h3 className="text-5xl font-display text-[var(--bronzo-profondo)] uppercase tracking-[0.3em] italic">{t('booking.step4_title')}</h3>
                      </div>

                      <div className="max-w-xl mx-auto space-y-12 py-12 border-y border-[var(--oro-lucido)]/10 font-display">
                        <div className="flex justify-between items-center text-[var(--oro-lucido)]/60 uppercase tracking-widest text-[10px]">
                          <span>Guest Member</span>
                          <span className="text-[var(--bronzo-profondo)] text-xl font-accent">{formData.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-[var(--oro-lucido)]/60 uppercase tracking-widest text-[10px]">
                          <span>Reserved Experience</span>
                          <span className="text-[var(--bronzo-profondo)] text-xl tracking-widest uppercase font-accent">{SERVICE_TYPES.find(s => s.id === formData.serviceType)?.name}</span>
                        </div>
                        <div className="flex justify-between items-end pt-12">
                          <span className="text-[var(--oro-lucido)]/30 text-[10px] uppercase tracking-[1em]">Estimated Excellence</span>
                          <span className="text-7xl text-gold">€{formData.estimatedPrice}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-6">
                        <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="w-4 h-4 rounded-none border-[var(--oro-lucido)]/20 bg-transparent text-[var(--oro-lucido)] focus:ring-0" />
                        <label htmlFor="terms" className="text-[10px] text-[var(--bronzo-profondo)]/40 font-accent tracking-widest uppercase">
                          {t('booking.terms_agree')} <button onClick={() => setShowTerms(true)} className="text-[var(--oro-lucido)] hover:underline transition-colors">{t('booking.terms_link')}</button>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTION BAR */}
                <div className="p-12 border-t border-[var(--oro-lucido)]/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-white/30">
                  <button onClick={handlePrevStep} disabled={activeStep === 1} className={`text-[9px] uppercase tracking-[0.5em] text-[var(--oro-lucido)]/40 hover:text-[var(--oro-lucido)] transition-all ${activeStep === 1 ? 'opacity-0' : 'opacity-100'}`}>
                    Torna Indietro
                  </button>
                  <div className="flex gap-4">
                    {activeStep < 4 ? (
                      <button onClick={handleNextStep} className="btn-monumental">Prosegui</button>
                    ) : (
                      <button onClick={handleSubmit} disabled={isLoading || !termsAccepted} className="btn-monumental disabled:opacity-20">
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Richiedi Accesso Privé"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer className="py-12 border-t border-[var(--oro-lucido)]/10 z-20">
            <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex flex-col items-center md:items-start gap-4">
                <h4 className="font-display text-xl text-gold tracking-[0.3em]">{BUSINESS_INFO.name}</h4>
                <div className="flex items-center gap-6">
                  {[
                    { icon: Instagram, label: 'IG', href: `https://instagram.com/${BUSINESS_INFO.instagram}` },
                    { icon: MessageCircle, label: 'WA', href: 'https://wa.me/393393522164' }
                  ].map((s, i) => (
          <footer className="py-24 border-t border-[var(--oro-lucido)]/10 bg-transparent relative z-20">
            <div className="max-w-7xl mx-auto px-12 flex flex-col items-center gap-16 text-center">
              <div className="space-y-4">
                <h4 className="font-display text-4xl text-gold tracking-[0.2em] uppercase">{BUSINESS_INFO.name}</h4>
                <p className="text-[10px] font-accent text-[var(--oro-lucido)]/40 tracking-[1em] uppercase">Lifestyle Management & Personal Concierge</p>
              </div>

              <div className="flex items-center gap-12">
                {[
                  { icon: Instagram, label: 'Instagram', href: `https://instagram.com/${BUSINESS_INFO.instagram}` },
                  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/393393522164' }
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[var(--oro-lucido)]/60 hover:text-[var(--oro-lucido)] tracking-[0.4em] uppercase transition-colors font-accent border border-[var(--oro-lucido)]/10 px-8 py-3 hover:bg-[var(--oro-lucido)]/5">
                    {s.label}
                  </a>
                ))}
              </div>

              <div className="flex flex-col md:flex-row items-center gap-12 pt-12 border-t border-[var(--oro-lucido)]/5 w-full justify-center">
                <button 
                  onClick={() => {
                    setCurrentLegalContent({ 
                      title: 'Corporate Identity', 
                      content: `${BUSINESS_INFO.fullName}\n${BUSINESS_INFO.address}\nP.IVA: ${BUSINESS_INFO.piva}\nATECO: ${BUSINESS_INFO.ateco}` 
                    });
                    setShowLegalModal(true);
                  }} 
                  className="text-[9px] text-[var(--oro-lucido)]/40 hover:text-[var(--oro-lucido)] tracking-[0.5em] uppercase font-accent transition-colors"
                >
                  Legal Details
                </button>
                <button onClick={() => setShowBrandStory(true)} className="text-[9px] text-[var(--oro-lucido)]/40 hover:text-[var(--oro-lucido)] tracking-[0.5em] uppercase font-accent transition-colors">
                  Our Philosophy
                </button>
                <span className="text-[9px] text-[var(--bronzo-profondo)]/20 tracking-[0.5em] uppercase font-accent">
                  &copy; {new Date().getFullYear()} Elite Excellence
                </span>
              </div>
            </div>
          </footer>

          <BrandStoryModal isOpen={showBrandStory} onClose={() => setShowBrandStory(false)} />
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