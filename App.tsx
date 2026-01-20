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
  ArrowRight
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
    const timer = setTimeout(() => setShowButton(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = async () => {
    setShowButton(false);
    setPlayShow(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      try {
        await audioRef.current.play();
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    }

    setTimeout(() => {
      setIsExiting(true);
      setTimeout(onFinish, 1800);
    }, 4500);
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-[2000ms] ease-in-out ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <audio ref={audioRef} src={audioSrc} preload="auto" />

      {/* DINAMIC LAYERS */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] aura-bloom opacity-[0.05] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] aura-bloom opacity-[0.03] animate-pulse-slow font-accent" style={{ background: 'radial-gradient(circle, #F7E7CE, transparent 70%)' }}></div>

      {!playShow && (
        <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-1000 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl md:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-b from-pearl via-platinum to-platinum/40 tracking-[0.3em] mb-16 drop-shadow-2xl italic">
            {t('hero.title')}
          </h1>
          <button
            onClick={handleEnter}
            className="group relative px-12 py-6 bg-transparent overflow-hidden transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="absolute inset-0 border border-white/10 group-hover:border-platinum/40 transition-colors duration-1000"></div>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-1000"></div>
            <div className="flex flex-col items-center gap-2">
              <span className="relative z-10 text-platinum/60 font-accent tracking-[0.5em] text-[10px] md:text-xs uppercase group-hover:text-pearl transition-colors duration-700">
                {t('hero.cta')}
              </span>
            </div>
          </button>
        </div>
      )}

      {playShow && (
        <div className="relative z-10 w-full max-w-7xl px-12 flex flex-col items-center justify-center min-h-screen">
          {/* QUOTE - Top Leftish */}
          <div className="absolute top-[20%] left-[10%] max-w-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-platinum/20 font-accent text-[9px] uppercase tracking-[0.8em] mb-6">The Legacy</p>
            <h2 className="text-2xl md:text-4xl font-display text-platinum/60 leading-tight tracking-[0.1em] italic mb-10 border-l border-white/10 pl-8">
              "Il tempo è l'ultimo lusso.<br />Noi ne siamo i custodi."
            </h2>
            <div className="flex items-center gap-6 opacity-30">
              <div className="h-px w-16 bg-white/20"></div>
              <span className="text-[10px] text-platinum uppercase tracking-[0.5em] font-medium">M.S. Jara</span>
            </div>
          </div>

          {/* BRAND - Bottom Rightish */}
          <div className="absolute bottom-[20%] right-[10%] flex flex-col items-end text-right">
            <div className="relative mb-8 animate-zoom-out">
              <Crown className="w-16 h-16 text-platinum/40 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" strokeWidth={0.5} />
            </div>
            <h1 className="text-7xl md:text-[10rem] font-display text-transparent bg-clip-text bg-gradient-to-b from-pearl via-platinum/80 to-platinum/20 tracking-[0.2em] leading-none mb-6 drop-shadow-2xl">
              INSOLITO
            </h1>
            <span className="text-[10px] md:text-xs font-accent text-platinum/30 tracking-[1em] uppercase pr-2">
              {t('hero.subtitle')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// --- BRAND STORY SECTION ---

const BrandStory: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="animate-fade-in">
              <span className="text-gold-titan/40 font-accent text-[9px] uppercase tracking-[0.8em] mb-4 block">Founder & Visionary</span>
              <h2 className="text-5xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-b from-pearl-warm via-pearl-warm to-gold-titan/30 tracking-[0.1em] mb-8">
                Michael Jara
              </h2>
              <p className="text-pearl-warm/60 font-accent text-sm md:text-base leading-relaxed max-w-lg">
                Architect of Experiences
              </p>
            </div>

            <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {BRAND_STORY.content.map((p, i) => (
                <p key={i} className="text-platinum/40 text-[13px] md:text-sm font-light leading-relaxed italic border-l border-white/5 pl-8">
                  {p}
                </p>
              ))}
            </div>

            <div className="pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-6">
                <div className="h-[1px] w-12 bg-gold-titan/20"></div>
                <span className="text-[10px] text-gold-titan font-accent uppercase tracking-[0.5em]">The Signature of Excellence</span>
              </div>
            </div>
          </div>

          <div className="relative group animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden border border-white/5 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                alt="Michael Jara"
                className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-110 transition-transform duration-[3000ms] ease-out"
              />
              <div className="absolute inset-x-0 bottom-12 px-12 z-20">
                <blockquote className="text-pearl-warm/80 font-display text-2xl italic leading-tight tracking-wide">
                  "{BRAND_STORY.quote}"
                </blockquote>
              </div>
            </div>
            {/* DECORATIVE ELEMENTS */}
            <div className="absolute -top-12 -right-12 w-64 h-64 aura-bloom opacity-[0.05] pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 aura-bloom opacity-[0.03] pointer-events-none" style={{ background: 'radial-gradient(circle, var(--gold-titan), transparent 75%)' }}></div>
          </div>
        </div>
      </div>
    </section>
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
      const message = `*NEW BOOKING REQUEST* 👑\n*Client:* ${formData.name}\n*Service:* ${SERVICE_TYPES.find(s => s.id === formData.serviceType)?.name}\n*From:* ${formData.pickupLocation}\n*To:* ${formData.destination}\n*Date:* ${new Date(formData.date).toLocaleDateString()}\n*Time:* ${formData.time}\n*Total:* €${formData.estimatedPrice}`;
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
        <div className={`min-h-screen bg-[#030303] text-pearl font-sans relative overflow-x-hidden transition-opacity duration-[2000ms] ${showIntro ? 'opacity-0' : 'opacity-100'}`} ref={containerRef}>
          {/* CINEMATIC DYNAMIC BACKGROUND */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[#030303]"></div>

            {/* VIBRANT LIGHT LAYERS */}
            <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] aura-bloom opacity-[0.07] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] aura-bloom opacity-[0.04] animate-pulse-slow" style={{ background: 'radial-gradient(circle, var(--champagne), transparent 70%)' }}></div>

            {/* REFINED GRAIN & LEAKS */}
            <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
            <div className="absolute top-[30%] left-[-5%] w-full h-[1px] light-leak rotate-[-5deg] scale-150"></div>

            <img src="https://img.freepik.com/free-photo/reflective-photography-string-lights-river_413556-2.jpg?semt=ais_hybrid&w=740&q=80" alt="Milan" className="absolute inset-0 w-full h-full object-cover opacity-[0.05] grayscale mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]"></div>
          </div>

          <header className="relative z-10 pt-32 pb-24 text-center">
            <div className="flex items-center justify-between px-12 absolute top-10 left-0 w-full">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setShowAdminLogin(true)}>
                <Crown className="w-5 h-5 text-platinum/20 group-hover:text-platinum/60 transition-all duration-700" strokeWidth={0.5} />
                <span className="text-[9px] text-platinum/10 uppercase tracking-[0.5em] group-hover:text-platinum/40 transition-all duration-700">Elite Panel</span>
              </div>
              <div className="flex items-center gap-8">
                <button onClick={() => setShowHistory(true)} className="text-platinum/20 hover:text-pearl transition-all duration-700"><History className="w-5 h-5" strokeWidth={1} /></button>
                <LanguageSwitcher />
              </div>
            </div>

            <div className="relative inline-block mb-8">
              <h1 className="text-8xl md:text-[11rem] font-display text-transparent bg-clip-text bg-gradient-to-b from-pearl via-platinum/60 to-platinum/10 tracking-[0.35em] drop-shadow-2xl">
                INSOLITO
              </h1>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-platinum/20 to-transparent"></div>
            </div>

            <h2 className="text-[10px] md:text-xs font-accent text-platinum/30 tracking-[1.2em] uppercase italic mt-4">{t('hero.subtitle')}</h2>
          </header>

          <BrandStory />

          <main className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
            <div className="mb-12 flex justify-center">
              <div className="glass-2026 px-6 py-2 rounded-full border border-gold-titan/20 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-titan animate-pulse"></div>
                <span className="text-[9px] text-gold-titan/60 uppercase tracking-[0.4em]">Referral System Active</span>
              </div>
            </div>

            <div ref={formCardRef} className="glass-2026 rounded-[40px] shadow-2xl overflow-hidden relative border border-white/5 max-w-5xl mx-auto">
              <StepIndicator currentStep={activeStep} />
              <div className="p-8 md:p-14">
                {activeStep === 1 && (
                  <div className="animate-fade-in space-y-20">
                    <div className="text-center">
                      <h3 className="text-5xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-b from-pearl via-pearl to-platinum/20 tracking-[0.25em] uppercase italic leading-tight">{t('booking.step1_title')}</h3>
                      <p className="text-[11px] text-platinum/30 font-accent uppercase tracking-[1em] mt-6">{t('booking.step1_subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      {SERVICE_TYPES.map(service => (
                        <button
                          key={service.id}
                          onClick={() => handleServiceSelect(service.id)}
                          className="group glass-2026 p-12 rounded-[48px] border border-white/5 hover:border-platinum/30 hover:bg-white/[0.04] transition-all duration-[1200ms] flex flex-col items-center text-center relative overflow-hidden"
                        >
                          {/* INTERNAL GLOW */}
                          <div className="absolute inset-0 bg-gradient-to-br from-platinum/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                          <div className="w-20 h-20 rounded-3xl bg-white/[0.03] flex items-center justify-center mb-12 group-hover:text-pearl group-hover:scale-110 transition-all duration-1000 shadow-[0_0_40px_rgba(255,255,255,0.02)]">
                            <service.icon strokeWidth={0.3} className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <h4 className="font-display text-3xl text-pearl/90 mb-6 tracking-wide group-hover:text-white transition-colors">{t(`services.name_${service.id}`)}</h4>
                          <p className="text-[12px] text-platinum/20 font-light italic leading-relaxed group-hover:text-platinum/40 transition-colors">{t(`services.desc_${service.id}`)}</p>

                          {/* BUTTON HINT */}
                          <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-4 group-hover:translate-y-0">
                            <span className="text-[9px] uppercase tracking-[0.5em] text-platinum/60 border-b border-platinum/20 pb-1">Select Experience</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-8">
                      <div className="glass-2026 rounded-[40px] p-10 space-y-12">
                        <h4 className="text-[9px] font-accent text-gold-titan/40 uppercase tracking-[0.6em] flex items-center gap-4"><Map className="w-3 h-3" /> {t('booking.route_details')}</h4>
                        <div className="space-y-6">
                          <div className="relative group">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" strokeWidth={0.5} />
                            <input type="text" value={formData.pickupLocation} onChange={(e) => handleLocationSearch('pickup', e.target.value)} onBlur={handleInputBlur} placeholder={t('booking.pickup')} className="w-full pl-16 pr-6 py-5 bg-white/[0.01] border border-white/5 rounded-[24px] text-gray-300 focus:outline-none focus:border-gold-500/20 transition-all" />
                            {showPickupSugg && pickupSuggestions.length > 0 && (
                              <div className="absolute top-full left-0 w-full mt-2 glass-2026 rounded-3xl z-50 overflow-hidden">
                                {pickupSuggestions.map(s => <div key={s.id} onClick={() => selectPlace(s, 'pickup')} className="px-6 py-4 hover:bg-gold-500/5 cursor-pointer text-xs text-gray-400">{s.fullAddress}</div>)}
                              </div>
                            )}
                          </div>
                          {formData.stops.map((stop, i) => (
                            <div key={i} className="relative group animate-fade-in">
                              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/30" strokeWidth={0.5} />
                              <input type="text" value={stop} onChange={(e) => handleLocationSearch('stop', e.target.value, i)} placeholder={`${t('booking.stops')} ${i + 1}`} className="w-full pl-16 pr-12 py-5 bg-white/[0.005] border border-white/5 rounded-[24px] text-gray-400" />
                              <button onClick={() => removeStop(i)} className="absolute right-6 top-1/2 -translate-y-1/2 text-red-900/40 hover:text-red-500Transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          ))}
                          {formData.stops.length < 2 && <button onClick={addStop} className="text-[9px] text-gray-700 hover:text-gold-500/80 uppercase tracking-widest pl-4 opacity-40">+ {t('booking.add_stop')}</button>}
                          <div className="relative group">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" strokeWidth={0.5} />
                            <input type="text" value={formData.destination} onChange={(e) => handleLocationSearch('destination', e.target.value)} onBlur={handleInputBlur} placeholder={t('booking.destination')} className="w-full pl-16 pr-6 py-5 bg-white/[0.01] border border-white/5 rounded-[24px] text-gray-300 focus:outline-none focus:border-gold-500/20 transition-all" />
                            {showDestSugg && destSuggestions.length > 0 && (
                              <div className="absolute top-full left-0 w-full mt-2 glass-2026 rounded-3xl z-50 overflow-hidden">
                                {destSuggestions.map(s => <div key={s.id} onClick={() => selectPlace(s, 'destination')} className="px-6 py-4 hover:bg-gold-500/5 cursor-pointer text-xs text-gray-400">{s.fullAddress}</div>)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-5 space-y-10">
                      <div className="glass-2026 rounded-[40px] p-10 space-y-10">
                        <h4 className="text-[9px] font-accent text-gold-titan/40 uppercase tracking-[0.6em] flex items-center gap-4"><Calendar className="w-3 h-3" /> {t('booking.schedule_guests')}</h4>
                        <div className="space-y-4">
                          <input type="date" name="date" value={formData.date} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} className="w-full glass-input-2026 px-6 py-4 rounded-2xl text-xs text-gray-400" style={{ colorScheme: 'dark' }} />
                          <select name="time" value={formData.time} onChange={handleInputChange} disabled={!formData.date} className="w-full glass-input-2026 px-6 py-4 rounded-2xl text-xs text-gray-400 appearance-none">
                            <option value="">{t('booking.time')}</option>
                            {availableSlots.map(s => <option key={s} value={s}>{s} {isNightService(s) ? '(Night)' : ''}</option>)}
                          </select>
                          <select name="passengers" value={formData.passengers} onChange={handleInputChange} className="w-full glass-input-2026 px-6 py-4 rounded-2xl text-xs text-gray-400 appearance-none">
                            {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} {t('booking.passengers')}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="glass-2026 rounded-[40px] p-10 space-y-8">
                        <h4 className="text-[9px] font-accent text-gold-titan/40 uppercase tracking-[0.6em] flex items-center gap-4"><User className="w-3 h-3" /> {t('booking.guest_info')}</h4>
                        <div className="space-y-4">
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={t('booking.name')} className="w-full glass-input-2026 px-6 py-5 rounded-2xl text-xs" />
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t('booking.email')} className="w-full glass-input-2026 px-6 py-5 rounded-2xl text-xs" />
                          <div className="flex gap-2">
                            <select name="countryCode" value={formData.countryCode} onChange={handleInputChange} className="w-24 glass-input-2026 px-2 py-5 rounded-2xl text-[10px]">{COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}</select>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder={t('booking.phone')} className="flex-1 glass-input-2026 px-6 py-5 rounded-2xl text-xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div className="glass-2026 rounded-[40px] p-10 space-y-8">
                        <h4 className="text-[9px] font-accent text-gold-titan/40 uppercase tracking-[0.6em] flex items-center gap-4"><CreditCard className="w-3 h-3" /> {t('booking.payment_method')}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {['cash', 'pos'].map(m => (
                            <button key={m} onClick={() => setFormData(p => ({ ...p, paymentMethod: m as any }))} className={`p-6 border rounded-3xl text-[10px] uppercase tracking-widest transition-all ${formData.paymentMethod === m ? 'border-gold-titan/50 bg-gold-titan/5 text-pearl-warm' : 'border-white/5 text-platinum/20'}`}>
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="animate-fade-in max-w-2xl mx-auto space-y-12">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gold-titan/10 mb-8 border border-gold-titan/20"><Star className="w-6 h-6 text-gold-titan/60" /></div>
                      <h3 className="text-3xl font-display text-pearl-warm uppercase tracking-widest italic">{t('booking.step4_title')}</h3>
                    </div>
                    <div className="glass-2026 rounded-[40px] p-10 space-y-8 divide-y divide-white/5">
                      <div className="pb-8 grid grid-cols-2 gap-8">
                        <div><p className="text-[8px] text-platinum/20 uppercase tracking-widest mb-1">{t('booking.guest')}</p><p className="text-sm italic">{formData.name}</p></div>
                        <div className="text-right"><p className="text-[8px] text-platinum/20 uppercase tracking-widest mb-1">{t('booking.date')}</p><p className="text-sm italic">{new Date(formData.date).toLocaleDateString()} @ {formData.time}</p></div>
                      </div>
                      <div className="py-8"><p className="text-[8px] text-platinum/20 uppercase tracking-widest mb-4">{t('booking.service')}</p><p className="text-xl font-display text-gold-titan">{SERVICE_TYPES.find(s => s.id === formData.serviceType)?.name}</p></div>
                      <div className="pt-8 flex justify-between items-end">
                        <p className="text-[10px] text-gold-titan/40 uppercase tracking-[0.4em]">{t('booking.total')}</p>
                        <p className="text-5xl font-display text-gold-titan">€{formData.estimatedPrice}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="w-4 h-4 rounded-full border-white/10 bg-black text-gold-500" />
                      <label htmlFor="terms" className="text-[10px] text-gray-500 font-accent tracking-wider">{t('booking.terms_agree')} <button onClick={() => setShowTerms(true)} className="text-gold-200 underline underline-offset-4">{t('booking.terms_link')}</button></label>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/5 p-8 flex justify-between items-center bg-black/40 backdrop-blur-3xl sticky bottom-0 z-40">
                <button onClick={handlePrevStep} disabled={activeStep === 1} className={`text-[10px] uppercase tracking-[0.3em] font-accent transition-all ${activeStep === 1 ? 'opacity-0' : 'text-platinum/20 hover:text-white'}`}>Back</button>
                {activeStep < 4 ? (
                  <button onClick={handleNextStep} className="px-12 py-5 bg-gold-titan hover:bg-gold-titan/80 text-ebony-rich font-accent text-[11px] uppercase tracking-[0.4em] transition-all rounded-sm shadow-[0_0_30px_rgba(var(--gold-titan-rgb),0.2)]">Continue</button>
                ) : (
                  <button onClick={handleSubmit} disabled={isLoading || !termsAccepted} className="px-12 py-5 bg-pearl-warm hover:bg-white text-ebony-rich font-accent text-[11px] uppercase tracking-[0.4em] transition-all rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50">{isLoading ? <Loader2 className="animate-spin" /> : t('booking.request_booking')}</button>
                )}
              </div>
            </div>
          </main>

          <footer className="py-32 text-center border-t border-white/[0.03] mt-32 relative overflow-hidden">
            {/* FOOTER BACKGROUND VIBE */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-platinum/10 to-transparent"></div>

            <div className="max-w-5xl mx-auto px-12 relative z-10">
              <div className="flex justify-center gap-24 mb-24">
                {[
                  { icon: Instagram, label: `@${BUSINESS_INFO.instagram}`, href: `https://instagram.com/${BUSINESS_INFO.instagram}` },
                  { icon: MessageCircle, label: '+39 3393522164', href: 'https://wa.me/393393522164' }
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-6 transition-all duration-1000">
                    <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center group-hover:border-platinum/30 group-hover:bg-white/[0.02] transition-all duration-1000">
                      <s.icon className="w-6 h-6 text-platinum/20 group-hover:text-pearl transition-colors" strokeWidth={0.5} />
                    </div>
                    <span className="text-[10px] text-platinum/10 group-hover:text-platinum/60 tracking-[0.4em] uppercase transition-colors duration-1000">{s.label}</span>
                  </a>
                ))}
              </div>

              <div className="flex flex-col items-center gap-10">
                <div className="relative">
                  <Crown className="w-8 h-8 text-platinum/5 mb-2" strokeWidth={0.5} />
                  <div className="absolute inset-0 aura-bloom opacity-[0.02] scale-50"></div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-display text-2xl text-platinum/40 tracking-[0.6em] mb-4">{BUSINESS_INFO.name}</h4>
                  <div className="flex flex-wrap justify-center gap-10 text-[9px] uppercase tracking-[0.6em] text-platinum/10 font-accent">
                    <span>VAT: {BUSINESS_INFO.piva}</span>
                    <span>HEADQUARTERS: {BUSINESS_INFO.address.split(',')[0]}</span>
                  </div>
                </div>

                <p className="text-[8px] text-platinum/5 tracking-[1em] mt-12">&copy; {new Date().getFullYear()} INSOLITO. ARCHITECTURAL LUXURY.</p>
              </div>
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