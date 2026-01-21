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
    <div className={`fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-[2000ms] ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <audio ref={audioRef} src={audioSrc} preload="auto" />
      <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>

      {!playShow && (
        <div className={`flex flex-col items-center transition-all duration-[1500ms] ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Crown className="w-12 h-12 text-white/10 mb-12" strokeWidth={0.5} />
          <h1 className="text-5xl md:text-7xl font-display text-white tracking-[0.4em] mb-16 italic opacity-90">
            INSOLITO
          </h1>
          <button
            onClick={handleEnter}
            className="group relative px-16 py-6 bg-transparent transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 border border-white/10 group-hover:border-white/40 transition-colors duration-700"></div>
            <span className="relative z-10 text-white/40 font-accent tracking-[0.6em] text-[10px] uppercase group-hover:text-white transition-colors duration-700">
              {t('hero.cta')}
            </span>
          </button>
        </div>
      )}

      {playShow && (
        <div className="relative z-10 flex flex-col items-center text-center px-12 animate-elite-fade">
          <p className="text-white/20 font-accent text-[10px] uppercase tracking-[1em] mb-8">Architectural Luxury Assistance</p>
          <h2 className="text-3xl md:text-5xl font-display text-white leading-tight tracking-[0.1em] italic mb-12 border-l border-white/20 pl-10 max-w-2xl text-left">
            "Il tempo è l'ultimo lusso.<br />Noi ne siamo i custodi."
          </h2>
          <div className="w-12 h-px bg-white/20 mb-20"></div>
          <h1 className="text-7xl md:text-[10rem] font-display text-white tracking-[0.4em] leading-none mb-4 opacity-95">
            INSOLITO
          </h1>
          <span className="text-[11px] font-accent text-white/30 tracking-[1.4em] uppercase">
            {t('hero.subtitle')}
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
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />

      <div className="relative w-full max-w-6xl max-h-full overflow-y-auto luxury-monolith p-12 md:p-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center animate-elite-fade border-white/10 shadow-3xl">
        <button onClick={onClose} className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-16">
          <div className="space-y-8">
            <span className="text-white/20 font-accent text-[10px] uppercase tracking-[1.2em] mb-4 block">Founder & Visionary</span>
            <h2 className="text-6xl md:text-8xl font-display text-white tracking-[0.1em] leading-tight opacity-95">
              Michael Jara
            </h2>
            <p className="text-white/40 font-accent text-[11px] leading-relaxed tracking-[1.5em] uppercase pl-1">
              Architect of Experiences
            </p>
          </div>

          <div className="space-y-10 border-l border-white/5 pl-12">
            {BRAND_STORY.content.map((p, i) => (
              <p key={i} className="text-white/60 text-[15px] md:text-base font-light font-display italic leading-relaxed tracking-widest">
                {p}
              </p>
            ))}
          </div>

          <div className="pt-12">
            <div className="flex items-center gap-12">
              <div className="h-[0.5px] w-24 bg-white/10"></div>
              <span className="text-[10px] text-white/20 font-accent uppercase tracking-[1em]">Signature of Excellence</span>
            </div>
          </div>
        </div>

        <div className="relative group hidden lg:block overflow-hidden">
          <div className="aspect-[4/6] rounded-sm overflow-hidden border border-white/5 relative bg-white/[0.02] grayscale contrast-125">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
              alt="Michael Jara"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[6000ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
            <div className="absolute inset-x-0 bottom-16 px-16 text-center">
              <blockquote className="text-white font-display text-3xl italic leading-tight tracking-wide opacity-90 drop-shadow-2xl">
                "{BRAND_STORY.quote}"
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
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
        <div className={`min-h-screen bg-[#030303] text-pearl font-sans relative overflow-x-hidden transition-opacity duration-[2000ms] ${showIntro ? 'opacity-0' : 'opacity-100'}`} ref={containerRef}>
          {/* CINEMATIC DYNAMIC BACKGROUND */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[#030303]"></div>

            {/* VIBRANT LIGHT LAYERS */}
            <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] aura-bloom opacity-[0.07] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] aura-bloom opacity-[0.04] animate-pulse-slow" style={{ background: 'radial-gradient(circle, var(--champagne), transparent 70%)' }}></div>

            {/* REFINED GRAIN & LEAKS */}
            <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>

            <img src="https://img.freepik.com/free-photo/reflective-photography-string-lights-river_413556-2.jpg?semt=ais_hybrid&amp;w=740&amp;q=80" alt="Milan" className="absolute inset-0 w-full h-full object-cover opacity-[0.03] grayscale mix-blend-soft-light" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]"></div>
          </div>

          <header className="relative z-10 pt-48 pb-32 text-center overflow-hidden">
            <div className="flex items-center justify-between px-16 absolute top-12 left-0 w-full">
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setShowAdminLogin(true)}>
                <Crown className="w-4 h-4 text-white/20 group-hover:text-white transition-all duration-700" strokeWidth={1} />
                <span className="text-[9px] text-white/10 uppercase tracking-[0.6em] group-hover:text-white/40 transition-all duration-700">Management</span>
              </div>
              <div className="flex items-center gap-12">
                <button onClick={() => setShowHistory(true)} className="text-white/20 hover:text-white transition-all duration-700 underline underline-offset-8 decoration-white/5 hover:decoration-white/20 text-[10px] uppercase tracking-widest">Archive</button>
                <LanguageSwitcher />
              </div>
            </div>

            <div className="relative inline-block mb-12">
              <h1 className="text-8xl md:text-[13rem] font-display text-white tracking-[0.4em] leading-none opacity-95">
                INSOLITO
              </h1>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            <p className="text-[11px] md:text-sm font-accent text-white/30 tracking-[1.8em] uppercase mt-8 pl-[1.8em]">Private Concierge & Elite Management</p>
          </header>

          <main className="max-w-4xl mx-auto px-6 pb-48 relative z-10">
            {/* THE MONOLITH: A Single, Sweeping Experience */}
            <div ref={formCardRef} className="luxury-monolith rounded-sm overflow-hidden animate-elite-fade">
              <StepIndicator currentStep={activeStep} />

              <div className="p-12 md:p-20">
                {activeStep === 1 && (
                  <div className="animate-fade-in space-y-20">
                    <div className="space-y-6">
                      <h3 className="text-5xl md:text-7xl font-display text-white tracking-[0.2em] uppercase italic">{t('booking.step1_title')}</h3>
                      <p className="text-[10px] text-white/20 font-accent uppercase tracking-[1em]">{t('booking.step1_subtitle')}</p>
                    </div>

                    <div className="space-y-4">
                      {SERVICE_TYPES.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => handleServiceSelect(service.id)}
                          className="w-full elite-selector p-10 flex flex-col md:flex-row items-center justify-between text-left group"
                        >
                          <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-all duration-700">
                              <service.icon strokeWidth={0.5} className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h4 className="font-display text-3xl text-white tracking-widest mb-1">{t(`services.name_${service.id}`)}</h4>
                              <p className="text-[11px] text-white/30 font-accent uppercase tracking-widest">{t(`services.desc_${service.id}`)}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-6 h-6 text-white/10 group-hover:text-white group-hover:translate-x-2 transition-all duration-700 hidden md:block" strokeWidth={0.5} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="animate-fade-in space-y-20">
                    <div className="space-y-6">
                      <h3 className="text-5xl md:text-6xl font-display text-white tracking-widest italic">Experience Details</h3>
                      <div className="silver-line"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                      <div className="space-y-12">
                        <h4 className="text-[9px] font-accent text-white/20 uppercase tracking-[1em] mb-4">Itinerary</h4>
                        <div className="space-y-6">
                          <input type="text" value={formData.pickupLocation} onChange={(e) => handleLocationSearch('pickup', e.target.value)} onBlur={handleInputBlur} placeholder={t('booking.pickup')} className="w-full px-8 py-6 elite-input text-[11px] tracking-widest uppercase" />
                          <input type="text" value={formData.destination} onChange={(e) => handleLocationSearch('destination', e.target.value)} onBlur={handleInputBlur} placeholder={t('booking.destination')} className="w-full px-8 py-6 elite-input text-[11px] tracking-widest uppercase" />
                        </div>
                      </div>
                      <div className="space-y-12">
                        <h4 className="text-[9px] font-accent text-white/20 uppercase tracking-[1em] mb-4">Precision Schedule</h4>
                        <div className="space-y-6">
                          <input type="date" name="date" value={formData.date} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} className="w-full px-8 py-6 elite-input text-[11px] tracking-widest" style={{ colorScheme: 'dark' }} />
                          <select name="time" value={formData.time} onChange={handleInputChange} disabled={!formData.date} className="w-full px-8 py-6 elite-input text-[11px] tracking-widest uppercase appearance-none">
                            <option value="">{t('booking.time')}</option>
                            {availableSlots.map(s => <option key={s} value={s}>{s} {isNightService(s) ? '(Night)' : ''}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="animate-fade-in space-y-20">
                    <div className="space-y-6">
                      <h3 className="text-5xl md:text-6xl font-display text-white tracking-widest italic">{t('booking.guest_info')}</h3>
                      <div className="silver-line"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                      <div className="space-y-8">
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={t('booking.name')} className="w-full px-8 py-6 elite-input text-[11px] tracking-widest uppercase" />
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t('booking.email')} className="w-full px-8 py-6 elite-input text-[11px] tracking-widest" />
                        <div className="flex gap-4">
                          <select name="countryCode" value={formData.countryCode} onChange={handleInputChange} className="w-32 px-4 py-6 elite-input text-[11px]">
                            {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                          </select>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder={t('booking.phone')} className="flex-1 px-8 py-6 elite-input text-[11px] tracking-widest" />
                        </div>
                      </div>
                      <div className="space-y-12">
                        <h4 className="text-[9px] font-accent text-white/20 uppercase tracking-[1em] mb-4">Settlement</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {['cash', 'pos'].map(m => (
                            <button key={m} onClick={() => setFormData(p => ({ ...p, paymentMethod: m as any }))} className={`py-6 border text-[9px] uppercase tracking-[0.4em] transition-all ${formData.paymentMethod === m ? 'border-white text-white' : 'border-white/5 text-white/20'}`}>
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="animate-fade-in space-y-20 text-center">
                    <div className="space-y-8">
                      <Star className="w-12 h-12 text-white/20 mx-auto" strokeWidth={0.5} />
                      <h3 className="text-5xl font-display text-white uppercase tracking-[0.3em] italic">{t('booking.step4_title')}</h3>
                    </div>

                    <div className="max-w-xl mx-auto space-y-12 py-12 border-y border-white/5 font-display">
                      <div className="flex justify-between items-center text-white/40 uppercase tracking-widest text-[10px]">
                        <span>Guest</span>
                        <span className="text-white text-xl">{formData.name}</span>
                      </div>
                      <div className="flex justify-between items-center text-white/40 uppercase tracking-widest text-[10px]">
                        <span>Experience</span>
                        <span className="text-white text-xl tracking-widest">{SERVICE_TYPES.find(s => s.id === formData.serviceType)?.name}</span>
                      </div>
                      <div className="flex justify-between items-end pt-12">
                        <span className="text-white/20 text-[10px] uppercase tracking-[1em]">Estimated Total</span>
                        <span className="text-7xl text-white">€{formData.estimatedPrice}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                      <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="w-4 h-4 rounded-none border-white/20 bg-transparent text-white focus:ring-0" />
                      <label htmlFor="terms" className="text-[10px] text-white/30 font-accent tracking-widest uppercase">
                        {t('booking.terms_agree')} <button onClick={() => setShowTerms(true)} className="text-white hover:underline transition-colors">{t('booking.terms_link')}</button>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BAR */}
              <div className="p-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <button onClick={handlePrevStep} disabled={activeStep === 1} className={`text-[9px] uppercase tracking-[0.5em] text-white/20 hover:text-white transition-all ${activeStep === 1 ? 'opacity-0' : 'opacity-100'}`}>
                  Retrace Steps
                </button>
                <div className="flex gap-4">
                  {activeStep < 4 ? (
                    <button onClick={handleNextStep} className="btn-monumental">Continue</button>
                  ) : (
                    <button onClick={handleSubmit} disabled={isLoading || !termsAccepted} className="btn-monumental disabled:opacity-20">
                      {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Request Assistance"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>

          <footer className="py-48 text-center border-t border-white/[0.03] mt-24">
            <div className="max-w-4xl mx-auto px-16 space-y-32">
              <div className="flex justify-center gap-24">
                {[
                  { icon: Instagram, label: 'INSTAGRAM', href: `https://instagram.com/${BUSINESS_INFO.instagram}` },
                  { icon: MessageCircle, label: 'WHATSAPP', href: 'https://wa.me/393393522164' }
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/20 hover:text-white tracking-[0.5em] uppercase transition-colors duration-700">
                    {s.label}
                  </a>
                ))}
              </div>

              <div className="space-y-12">
                <h4 className="font-display text-5xl text-white tracking-[0.5em] opacity-90">{BUSINESS_INFO.name}</h4>
                <div className="flex justify-center gap-12 text-[9px] uppercase tracking-[0.8em] text-white/40">
                  <span>VAT: {BUSINESS_INFO.piva}</span>
                  <span className="hidden md:inline">MILAN HQ: {BUSINESS_INFO.address.split(',')[0]}</span>
                </div>
                <button onClick={() => setShowBrandStory(true)} className="btn-outline-elite mt-12">
                  Meet The Architect
                </button>
              </div>

              <p className="text-[9px] text-white/10 tracking-[1.4em] uppercase">&copy; {new Date().getFullYear()} INSOLITO experiencias ARCHITECTURAL ASSISTANCE</p>
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