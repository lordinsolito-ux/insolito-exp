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
  X,
  ChevronDown
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

// --- POPUP COMPONENTS ---
const VisionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[var(--perla-dorata)]/95 backdrop-blur-3xl" onClick={onClose} />
      <div className="relative w-full max-w-4xl luxury-monolith p-12 md:p-20 animate-reveal border-[var(--oro-lucido)]/10 shadow-3xl bg-white/95 rounded-sm">
        <button onClick={onClose} className="absolute top-8 right-8 text-[var(--oro-lucido)]/40 hover:text-[var(--oro-lucido)] transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-[var(--oro-lucido)]/40 font-accent text-[9px] uppercase tracking-[1em]">Our Vision</span>
            <h2 className="text-5xl md:text-7xl font-display text-gold italic">L'Eccellenza Silenziosa.</h2>
          </div>
          <div className="space-y-8 font-sans text-lg text-[var(--bronzo-profondo)]/80 leading-relaxed max-w-2xl">
            <p>Non costruiamo semplici spostamenti. Progettiamo momenti di assoluta sospensione dal mondo, dove il comfort diventa un'ombra invisibile che ti segue con precisione millimetrica.</p>
            <p>La nostra visione a Milano è ridefinire il concetto di assistenza personale: non più un servizio, ma un'architettura del tempo dedicata a proteggere il tuo prestigio e la tua pace.</p>
          </div>
          <div className="pt-8 border-t border-[var(--oro-lucido)]/10">
            <div className="flex items-center gap-4 text-[var(--oro-lucido)]">
              <Crown className="w-4 h-4" />
              <span className="text-[10px] font-accent uppercase tracking-[0.6em]">Reserved for Excellence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BrandStoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[var(--perla-dorata)]/95 backdrop-blur-3xl" onClick={onClose} />
      <div className="relative w-full max-w-6xl luxury-monolith p-12 md:p-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center animate-reveal border-[var(--oro-lucido)]/10 shadow-3xl bg-white/95 rounded-sm">
        <button onClick={onClose} className="absolute top-10 right-10 text-[var(--oro-lucido)]/40 hover:text-[var(--oro-lucido)] transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="space-y-16">
          <div className="space-y-8">
            <span className="text-[var(--oro-lucido)]/40 font-accent text-[10px] uppercase tracking-[1.2em] mb-4 block">Founder & Visionary</span>
            <h2 className="text-6xl md:text-8xl font-display text-gold italic leading-tight">Michael Jara</h2>
            <p className="text-[var(--oro-lucido)] font-accent text-[11px] leading-relaxed tracking-[1.5em] uppercase pl-1">INSOLITO PRIVÉ</p>
          </div>
          <div className="space-y-10 border-l border-[var(--oro-lucido)]/10 pl-12">
            {BRAND_STORY.content.map((p, i) => (
              <p key={i} className="text-[var(--bronzo-profondo)] text-[15px] md:text-base font-light font-display italic leading-relaxed tracking-widest">{p}</p>
            ))}
          </div>
          <div className="pt-12">
            <div className="flex items-center gap-12">
              <div className="h-[0.5px] w-24 bg-[var(--oro-lucido)]/20"></div>
              <span className="text-[10px] text-[var(--oro-lucido)]/40 font-accent uppercase tracking-[1em]">L'Eccellenza della Riservatezza</span>
            </div>
          </div>
        </div>
        <div className="relative group hidden lg:block overflow-hidden rounded-sm border border-[var(--oro-lucido)]/10">
          <img src="/assets/founder_michael_jara.jpg" alt="Michael Jara" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8000ms]" />
          <div className="absolute inset-x-0 bottom-16 px-16 text-center">
            <blockquote className="text-[var(--bronzo-profondo)] font-display text-3xl italic leading-tight tracking-wide opacity-90">"{BRAND_STORY.quote}"</blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

const FloatingHeader: React.FC<{
  onPhilosophy: () => void;
  onVision: () => void;
  onServices: () => void;
  onInquire: () => void;
  isScrolled: boolean;
}> = ({ onPhilosophy, onVision, onServices, onInquire, isScrolled }) => {
  return (
    <header className={`fixed top-8 left-1/2 -translate-x-1/2 z-[150] w-[calc(100%-4rem)] max-w-4xl transition-all duration-1000 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full tracking-[2em]'}`}>
      <div className="backdrop-blur-xl bg-white/40 border border-[var(--oro-lucido)]/10 rounded-full px-8 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={onPhilosophy}>
          <Crown className="w-4 h-4 text-gold" strokeWidth={1} />
          <span className="text-[9px] font-accent text-[var(--bronzo-profondo)] tracking-[0.5em] hidden md:block">Insolito Privé</span>
        </div>
        <nav className="flex items-center gap-8">
          {[
            { label: 'Philosophy', action: onPhilosophy },
            { label: 'Vision', action: onVision },
            { label: 'Services', action: onServices },
          ].map((item) => (
            <button key={item.label} onClick={item.action} className="text-[9px] font-accent text-[var(--oro-lucido)]/60 hover:text-[var(--oro-lucido)] tracking-[0.4em] transition-colors">
              {item.label}
            </button>
          ))}
          <button onClick={onInquire} className="bg-[var(--oro-lucido)] text-white text-[9px] font-accent px-6 py-2 rounded-full tracking-[0.4em] hover:bg-[var(--oro-scuro)] transition-all ml-4">
            Inquire
          </button>
        </nav>
      </div>
    </header>
  );
};

// --- MAGAZINE NARRATIVE SPREAD ---
const NarrativeSpread: React.FC = () => {
  return (
    <section id="essence" className="py-16 px-12 md:px-24 space-y-16 bg-transparent relative z-20 overflow-hidden">
      {/* Spread 1: The Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
        <div className="lg:col-span-12 xl:col-span-5 space-y-8 animate-reveal">
          <span className="text-[var(--oro-lucido)]/40 font-accent text-[10px] uppercase tracking-[1em] block mb-4">The Philosophy</span>
          <h2 className="text-6xl md:text-8xl font-display text-[var(--bronzo-profondo)] italic leading-tight tracking-tight">
            L'Arte di<br /><span className="text-gold">Scomparire.</span>
          </h2>
          <div className="space-y-6 py-8 border-y border-[var(--oro-lucido)]/10 max-w-xl">
            <p className="text-[var(--bronzo-profondo)] text-lg md:text-xl font-sans leading-relaxed text-justify">
              "La vera eccellenza non urla. Si manifesta in quell'ombra perfetta che anticipa ogni tua necessità, proteggendo il tuo tempo e la tua pace."
            </p>
            <p className="text-[var(--oro-lucido)]/60 text-sm font-sans tracking-wide italic">
              — Michael Jara, Fondatore
            </p>
          </div>
        </div>
        <div className="lg:col-span-12 xl:col-span-7 relative">
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm shadow-3xl group transition-all duration-[3000ms] border border-[var(--oro-lucido)]/10">
            <img
              src="/assets/korando_2014.png"
              alt="Elite Discretion"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8000ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bronzo-profondo)]/10 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Spread 2: What We Do */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto items-center">
        <div className="lg:col-span-12 xl:col-span-5 order-2 xl:order-1 relative">
          <div className="aspect-[16/10] xl:aspect-[3/4] overflow-hidden rounded-sm border border-[var(--oro-lucido)]/10 shadow-3xl">
            <img
              src="/assets/narrative_lifestyle.png"
              alt="Milano Lifestyle"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-center space-y-12 order-1 xl:order-2">
          <h3 className="text-5xl md:text-7xl font-display text-[var(--bronzo-profondo)] tracking-tight italic">Servizio alla Persona,<br /><span className="text-gold">Elevato a Concierge.</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-[var(--oro-lucido)]/10">
            <div className="space-y-4">
              <h4 className="text-[var(--oro-lucido)] font-accent text-[10px] tracking-[0.5em] uppercase">Executive Guardian</h4>
              <p className="text-[var(--bronzo-profondo)]/70 text-[13px] leading-relaxed font-sans">Non siamo semplici vettori. Siamo il tuo sigillo legale e fisico a Milano, proteggendo il tuo tempo e la tua immagine con discrezione assoluta.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[var(--oro-lucido)] font-accent text-[10px] tracking-[0.5em] uppercase">Private Logistics</h4>
              <p className="text-[var(--bronzo-profondo)]/70 text-[13px] leading-relaxed font-sans">Ogni rientro, ogni spostamento è una missione di sicurezza e assistenza millimetrica, riservata a pochi eletti.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- INITIAL STATES ---
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

  // New States for Fluid Empire
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisionOpen, setIsVisionOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isBookingConfirmed) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeStep > 1) {
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      <VisionModal isOpen={isVisionOpen} onClose={() => setIsVisionOpen(false)} />
      <BrandStoryModal isOpen={showBrandStory} onClose={() => setShowBrandStory(false)} />

      <FloatingHeader
        isScrolled={isScrolled}
        onPhilosophy={() => {
          document.getElementById('essence')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onVision={() => setIsVisionOpen(true)}
        onServices={() => {
          servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onInquire={() => {
          formCardRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {isBookingConfirmed ? (
        <BookingConfirmation formData={formData} onReset={handleResetApp} />
      ) : (
        <div className={`min-h-screen bg-[var(--perla-dorata)] text-[var(--bronzo-profondo)] font-sans relative overflow-x-hidden transition-opacity duration-[2000ms] ${showIntro ? 'opacity-0' : 'opacity-100'}`} ref={containerRef}>
          {/* CINEMATIC RADIANT BACKGROUND */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[var(--perla-dorata)]"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] opacity-[0.1]" style={{ background: 'radial-gradient(circle, var(--oro-lucido), transparent 70%)' }}></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] opacity-[0.05]" style={{ background: 'radial-gradient(circle, var(--oro-rosa), transparent 70%)' }}></div>
            <div className="absolute inset-0 bg-noise opacity-[0.15]"></div>
          </div>

          <header className={`relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-transparent py-24 transition-all duration-1000 ${isScrolled ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
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

            <div className="relative z-10 flex flex-col items-center text-center px-12 space-y-10 animate-reveal">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-[var(--oro-lucido)]/20 to-transparent"></div>
              <div className="space-y-4">
                <p className="text-[10px] font-accent text-[var(--oro-lucido)]/60 tracking-[1.5em] uppercase">Lifestyle Management Milano</p>
                <h1 className="text-7xl md:text-[12rem] font-display text-gold tracking-[-0.02em] leading-none italic">
                  Insolito<br /><span className="text-[var(--bronzo-profondo)] tracking-[0.1em] not-italic opacity-90">Privé</span>
                </h1>
              </div>
              <button
                onClick={() => servicesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex flex-col items-center gap-6 pt-12"
              >
                <span className="text-[10px] font-accent text-[var(--oro-lucido)]/40 group-hover:text-[var(--oro-lucido)] tracking-[1em] uppercase transition-all">Discover Essence</span>
                <ChevronDown className="w-6 h-6 text-[var(--oro-lucido)]/20 group-hover:text-[var(--oro-lucido)] group-hover:translate-y-2 transition-all duration-700" strokeWidth={1} />
              </button>
            </div>
          </header>

          <main className="bg-transparent relative z-10">
            <NarrativeSpread />

            {/* THE SELECTION */}
            <section ref={servicesRef} className="py-12 px-12 md:px-24 max-w-7xl mx-auto space-y-10">
              <div className="space-y-6 text-center max-w-2xl mx-auto">
                <span className="text-[10px] text-[var(--oro-lucido)]/40 font-accent uppercase tracking-[1.5em] mb-4 block">The Portfolio</span>
                <h3 className="text-6xl md:text-8xl font-display text-[var(--bronzo-profondo)] tracking-[0.1em] lowercase italic">Servizi.</h3>
                <p className="text-[var(--bronzo-profondo)]/60 font-display text-xl md:text-2xl leading-relaxed italic pt-6 border-t border-[var(--oro-lucido)]/10 mt-8">
                  "Ogni gesto è una promessa di eccellenza, scolpito per rispondere alle tue necessità più elevate."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
                {SERVICE_TYPES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className="group flex flex-col bg-white border border-[var(--oro-lucido)]/10 shadow-sm hover:shadow-2xl transition-all duration-700 min-h-[420px] rounded-sm overflow-hidden text-left"
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[6000ms]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="p-8 md:p-10 space-y-4 flex-1 flex flex-col">
                      <div className="space-y-1">
                        <span className="text-[9px] font-accent text-gold tracking-[0.4em] uppercase opacity-70">{service.badge}</span>
                        <h4 className="text-3xl font-display text-[var(--bronzo-profondo)] italic tracking-wide">{service.name}</h4>
                      </div>
                      <p className="text-[var(--bronzo-profondo)]/70 text-[12px] leading-relaxed font-sans line-clamp-3 italic">{service.description}</p>
                      <div className="mt-auto pt-6 border-t border-[var(--oro-lucido)]/5 flex items-center justify-between">
                        <span className="text-[9px] font-accent text-[var(--oro-lucido)]/40 tracking-[0.4em] uppercase">Private Booking</span>
                        <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-2 transition-transform duration-700" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* THE MONOLITH */}
            <div className={`transition-all duration-1000 pb-24 ${activeStep > 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24 pointer-events-none'}`}>
              <div className="max-w-4xl mx-auto px-6">
                <div ref={formCardRef} className="luxury-monolith rounded-sm overflow-hidden border border-[var(--oro-lucido)]/10 shadow-3xl bg-white/95">
                  <StepIndicator currentStep={activeStep} />
                  <div className="p-12 md:p-20">
                    {activeStep === 2 && (
                      <div className="animate-reveal space-y-16">
                        <div className="space-y-6">
                          <h3 className="text-5xl md:text-6xl font-display text-[var(--bronzo-profondo)] tracking-widest italic">{t('booking.details')}</h3>
                          <div className="gold-line"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-8">
                            <h4 className="text-[9px] font-accent text-[var(--oro-lucido)]/40 uppercase tracking-[1em] mb-4">Itinerary</h4>
                            <div className="space-y-4">
                              <input type="text" value={formData.pickupLocation} onChange={(e) => handleLocationSearch('pickup', e.target.value)} onBlur={handleInputBlur} placeholder={t('booking.pickup')} className="w-full px-8 py-5 elite-input text-[11px] tracking-widest uppercase" />
                              <input type="text" value={formData.destination} onChange={(e) => handleLocationSearch('destination', e.target.value)} onBlur={handleInputBlur} placeholder={t('booking.destination')} className="w-full px-8 py-5 elite-input text-[11px] tracking-widest uppercase" />
                            </div>
                          </div>
                          <div className="space-y-8">
                            <h4 className="text-[9px] font-accent text-[var(--oro-lucido)]/40 uppercase tracking-[1em] mb-4">Reserved Schedule</h4>
                            <div className="space-y-4">
                              <input type="date" name="date" value={formData.date} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} className="w-full px-8 py-5 elite-input text-[11px] tracking-widest" style={{ colorScheme: 'light' }} />
                              <select name="time" value={formData.time} onChange={handleInputChange} disabled={!formData.date} className="w-full px-8 py-5 elite-input text-[11px] tracking-widest uppercase appearance-none bg-white/10">
                                <option value="">{t('booking.time')}</option>
                                {availableSlots.map(s => <option key={s} value={s}>{s} {isNightService(s) ? '(Night)' : ''}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStep === 3 && (
                      <div className="animate-reveal space-y-16">
                        <div className="space-y-6">
                          <h3 className="text-5xl md:text-6xl font-display text-[var(--bronzo-profondo)] tracking-widest italic">{t('booking.guest_info')}</h3>
                          <div className="gold-line"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-6">
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={t('booking.name')} className="w-full px-8 py-5 elite-input text-[11px] tracking-widest uppercase" />
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t('booking.email')} className="w-full px-8 py-5 elite-input text-[11px] tracking-widest" />
                            <div className="flex gap-4">
                              <select name="countryCode" value={formData.countryCode} onChange={handleInputChange} className="w-32 px-4 py-5 elite-input text-[11px] bg-white/10">
                                {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                              </select>
                              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder={t('booking.phone')} className="flex-1 px-8 py-5 elite-input text-[11px] tracking-widest" />
                            </div>
                          </div>
                          <div className="space-y-8">
                            <h4 className="text-[9px] font-accent text-[var(--oro-lucido)]/40 uppercase tracking-[1em] mb-4">Reserved Settlement</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {['cash', 'pos'].map(m => (
                                <button key={m} onClick={() => setFormData(p => ({ ...p, paymentMethod: m as any }))} className={`py-5 border text-[9px] uppercase tracking-[0.4em] transition-all ${formData.paymentMethod === m ? 'border-[var(--oro-lucido)] text-[var(--oro-lucido)] bg-[var(--oro-lucido)]/5 font-bold' : 'border-[var(--oro-lucido)]/10 text-[var(--oro-lucido)]/40 hover:border-[var(--oro-lucido)]/30'}`}>
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStep === 4 && (
                      <div className="animate-reveal space-y-16 text-center">
                        <div className="space-y-6">
                          <Star className="w-12 h-12 text-[var(--oro-lucido)]/30 mx-auto" strokeWidth={0.5} />
                          <h3 className="text-5xl font-display text-[var(--bronzo-profondo)] uppercase tracking-[0.3em] italic">{t('booking.step4_title')}</h3>
                        </div>
                        <div className="max-w-xl mx-auto space-y-10 py-10 border-y border-[var(--oro-lucido)]/10 font-display">
                          <div className="flex justify-between items-center text-[var(--oro-lucido)]/60 uppercase tracking-widest text-[10px]">
                            <span>Guest Member</span>
                            <span className="text-[var(--bronzo-profondo)] text-xl font-accent">{formData.name}</span>
                          </div>
                          <div className="flex justify-between items-center text-[var(--oro-lucido)]/60 uppercase tracking-widest text-[10px]">
                            <span>Reserved Experience</span>
                            <span className="text-[var(--bronzo-profondo)] text-xl tracking-widest uppercase font-accent">{SERVICE_TYPES.find(s => s.id === formData.serviceType)?.name}</span>
                          </div>
                          <div className="flex justify-between items-end pt-8">
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
                  <div className="p-10 border-t border-[var(--oro-lucido)]/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-white/30">
                    <button
                      onClick={handlePrevStep}
                      className={`text-[9px] uppercase tracking-[0.5em] text-[var(--oro-lucido)]/40 hover:text-[var(--oro-lucido)] transition-all ${activeStep > 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                      Indietro
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
            </div>
          </main>

          <footer className="relative py-24 px-12 md:px-24 bg-transparent border-t border-[var(--oro-lucido)]/10 overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-[0.05]"></div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-24 relative z-10">
              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <Crown className="w-6 h-6 text-gold" strokeWidth={1} />
                  <span className="text-xl font-display text-[var(--bronzo-profondo)] tracking-[0.2em]">INSOLITO</span>
                </div>
                <p className="text-[var(--bronzo-profondo)]/40 text-[11px] leading-loose tracking-widest uppercase font-accent">
                  Architettura del Tempo & Discrezione Assoluta. Milano.
                </p>
                <div className="flex gap-8">
                  <a href="#" className="text-[var(--oro-lucido)]/40 hover:text-gold transition-colors"><Instagram className="w-5 h-5" strokeWidth={1} /></a>
                  <a href="#" className="text-[var(--oro-lucido)]/40 hover:text-gold transition-colors"><MessageCircle className="w-5 h-5" strokeWidth={1} /></a>
                  <a href="#" className="text-[var(--oro-lucido)]/40 hover:text-gold transition-colors"><Mail className="w-5 h-5" strokeWidth={1} /></a>
                </div>
              </div>
              <div className="space-y-8">
                <h4 className="text-[10px] font-accent text-gold tracking-[1em] uppercase">Maison</h4>
                <div className="flex flex-col gap-6">
                  <button onClick={() => setShowBrandStory(true)} className="text-[11px] text-[var(--bronzo-profondo)]/40 hover:text-[var(--oro-lucido)] tracking-widest uppercase transition-colors text-left">Our Story</button>
                  <button onClick={() => setIsVisionOpen(true)} className="text-[11px] text-[var(--bronzo-profondo)]/40 hover:text-[var(--oro-lucido)] tracking-widest uppercase transition-colors text-left">The Vision</button>
                  <button onClick={() => { setCurrentLegalContent({ title: LEGAL_CONTENT.privacy.title, content: LEGAL_CONTENT.privacy.content }); setShowLegalModal(true); }} className="text-[11px] text-[var(--bronzo-profondo)]/40 hover:text-[var(--oro-lucido)] tracking-widest uppercase transition-colors text-left">Privacy</button>
                </div>
              </div>
              <div className="space-y-8">
                <h4 className="text-[10px] font-accent text-gold tracking-[1em] uppercase">Concierge</h4>
                <div className="flex flex-col gap-6">
                  <a href={`tel:${BUSINESS_INFO.phone}`} className="text-[11px] text-[var(--bronzo-profondo)]/40 hover:text-[var(--oro-lucido)] tracking-widest uppercase transition-colors">Direct Line</a>
                  <a href={`https://wa.me/${BUSINESS_INFO.whatsapp}`} className="text-[11px] text-[var(--bronzo-profondo)]/40 hover:text-[var(--oro-lucido)] tracking-widest uppercase transition-colors">WhatsApp Privé</a>
                  <button onClick={() => setShowHistory(true)} className="text-[11px] text-[var(--bronzo-profondo)]/40 hover:text-[var(--oro-lucido)] tracking-widest uppercase transition-colors text-left">Reserved Archive</button>
                </div>
              </div>
              <div className="space-y-8">
                <h4 className="text-[10px] font-accent text-gold tracking-[1em] uppercase">Direct Inquiries</h4>
                <div className="space-y-6">
                  <p className="text-[11px] text-[var(--bronzo-profondo)]/40 tracking-widest uppercase">{BUSINESS_INFO.address}</p>
                  <p className="text-[11px] text-[var(--bronzo-profondo)]/40 tracking-widest uppercase">{BUSINESS_INFO.email}</p>
                  <div className="pt-4">
                    <button
                      onClick={() => setShowAdminLogin(true)}
                      className="text-[9px] font-accent text-gold/20 hover:text-gold transition-colors tracking-[0.5em] uppercase"
                    >
                      Member Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-24 pt-12 border-t border-[var(--oro-lucido)]/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <span className="text-[9px] font-accent text-[var(--bronzo-profondo)]/20 tracking-[1em] uppercase">© 2024 Insolito Privé. All Rights Reserved.</span>
              <div className="flex gap-12">
                <span className="text-[9px] font-accent text-[var(--bronzo-profondo)]/20 tracking-[0.5em] uppercase">Milano</span>
                <span className="text-[9px] font-accent text-[var(--bronzo-profondo)]/20 tracking-[0.5em] uppercase">Paris</span>
                <span className="text-[9px] font-accent text-[var(--bronzo-profondo)]/20 tracking-[0.5em] uppercase">London</span>
              </div>
            </div>
          </footer>
        </div>
      )}

      {showLegalModal && (
        <LegalModal
          isOpen={showLegalModal}
          onClose={() => setShowLegalModal(false)}
          title={currentLegalContent.title}
          content={currentLegalContent.content}
        />
      )}
    </>
  );
};

export default App;