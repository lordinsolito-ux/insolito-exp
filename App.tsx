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
  Lock
} from 'lucide-react';
import LegalModal from './components/LegalModal';
import { LEGAL_CONTENT, BUSINESS_INFO } from './legalContent';
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
    const timer = setTimeout(() => setShowButton(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = async () => {
    setShowButton(false);
    setPlayShow(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      try {
        await audioRef.current.play();
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    }

    setTimeout(() => {
      setIsExiting(true);
      setTimeout(onFinish, 1500);
    }, 3000);
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1500 ease-in-out ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <audio ref={audioRef} src={audioSrc} preload="auto" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-900/30 via-black to-black"></div>
      <div className="absolute inset-0 bg-noise opacity-50"></div>

      {!playShow && (
        <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-700 ${showButton ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-3xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-b from-gold-100 to-gold-500 tracking-[0.2em] mb-12 drop-shadow-2xl animate-fade-in opacity-90">
            {t('hero.title')}
          </h1>
          <button
            onClick={handleEnter}
            className="group relative px-10 py-5 bg-transparent overflow-hidden transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="absolute inset-0 border border-gold-500/20 group-hover:border-gold-500/60 transition-colors duration-700"></div>
            <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/5 transition-colors duration-700"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gold-500/50 group-hover:w-full transition-all duration-700"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gold-500/50 group-hover:w-full transition-all duration-700"></div>
            <div className="flex flex-col items-center gap-2">
              <span className="relative z-10 text-gold-100 font-display tracking-[0.3em] text-xs md:text-sm uppercase group-hover:text-white transition-colors">
                {t('hero.cta')}
              </span>
            </div>
            <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-gold-500/20 opacity-40 group-hover:animate-shimmer" />
          </button>
        </div>
      )}

      {playShow && (
        <div className="relative z-10 w-full max-w-7xl px-8 flex flex-col md:flex-row items-end justify-between gap-12">
          <div className="md:w-1/2 text-left animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-gold-200/40 font-accent text-[10px] uppercase tracking-[0.6em] mb-4">The Vision</p>
            <h2 className="text-3xl md:text-5xl font-display text-gold-100/90 leading-tight tracking-wide italic mb-8">
              "Il tempo è l'ultimo lusso. Noi ne siamo i custodi."
            </h2>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gold-500/30"></div>
              <span className="text-[9px] text-gold-500/60 uppercase tracking-[0.4em] font-medium">M.S. Jara • Founder</span>
            </div>
          </div>
          <div className="md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
            <div className="relative mb-6 animate-zoom-out">
              <div className="absolute inset-0 bg-gold-400 blur-[120px] opacity-20 animate-pulse-slow"></div>
              <Crown className="w-20 h-20 md:w-24 md:h-24 text-gold-400/80 drop-shadow-[0_0_50px_rgba(212,175,55,0.2)]" strokeWidth={0.5} />
            </div>
            <h1 className="text-6xl md:text-9xl font-display text-transparent bg-clip-text bg-gradient-to-b from-gold-100 via-gold-300/80 to-gold-600/40 tracking-[0.25em] leading-none mb-4 drop-shadow-2xl">
              INSOLITO
            </h1>
            <div className="flex flex-col items-center md:items-end gap-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <span className="text-xs md:text-sm font-accent text-gold-200/50 tracking-[0.8em] uppercase">
                {t('hero.subtitle')}
              </span>
            </div>
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
        <div className={`min-h-screen bg-black text-gray-200 font-sans relative overflow-x-hidden transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`} ref={containerRef}>
          {/* CINEMATIC BACKGROUND */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-black/60"></div>
            <img src="https://img.freepik.com/free-photo/reflective-photography-string-lights-river_413556-2.jpg?semt=ais_hybrid&w=740&q=80" alt="Milan" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
          </div>

          <header className="relative z-10 pt-28 pb-20 text-center">
            <div className="flex items-center justify-between px-8 absolute top-8 left-0 w-full">
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setShowAdminLogin(true)}>
                <Crown className="w-4 h-4 text-gold-500/30 group-hover:text-gold-400" />
                <span className="text-[8px] text-gray-600 uppercase tracking-[0.4em]">Elite Access</span>
              </div>
              <div className="flex items-center gap-6">
                <button onClick={() => setShowHistory(true)} className="text-gold-400/40 hover:text-white p-2"><History className="w-4 h-4" /></button>
                <LanguageSwitcher />
              </div>
            </div>
            <h1 className="text-7xl md:text-9xl font-display text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-200 to-gold-600/50 tracking-[0.3em] drop-shadow-2xl mb-8">INSOLITO</h1>
            <h2 className="text-[10px] md:text-xs font-accent text-gold-200/60 tracking-[0.8em] uppercase italic">{t('hero.subtitle')}</h2>
          </header>

          <main className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
            <div className="mb-12 flex justify-center">
              <div className="glass-2026 px-6 py-2 rounded-full border border-gold-500/20 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></div>
                <span className="text-[9px] text-gold-200/60 uppercase tracking-[0.4em]">Referral System Active</span>
              </div>
            </div>

            <div ref={formCardRef} className="glass-2026 rounded-[40px] shadow-2xl overflow-hidden relative border border-white/5 max-w-5xl mx-auto">
              <StepIndicator currentStep={activeStep} />
              <div className="p-8 md:p-14">
                {activeStep === 1 && (
                  <div className="animate-fade-in space-y-16">
                    <div className="text-center">
                      <h3 className="text-4xl md:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-[0.2em] uppercase italic leading-tight">{t('booking.step1_title')}</h3>
                      <p className="text-[10px] text-gold-500/40 font-accent uppercase tracking-[0.5em] mt-4">{t('booking.step1_subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {SERVICE_TYPES.map(service => (
                        <button key={service.id} onClick={() => handleServiceSelect(service.id)} className="group glass-2026 p-10 rounded-[40px] border border-white/5 hover:border-gold-500/40 transition-all duration-1000 flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-10 group-hover:text-gold-400 group-hover:scale-110 transition-all">
                            <service.icon strokeWidth={0.5} />
                          </div>
                          <h4 className="font-display text-2xl text-gold-100 mb-4">{t(`services.name_${service.id}`)}</h4>
                          <p className="text-[11px] text-gray-500 italic leading-relaxed">{t(`services.desc_${service.id}`)}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-8">
                      <div className="glass-2026 rounded-[40px] p-10 space-y-12">
                        <h4 className="text-[9px] font-accent text-gold-500/40 uppercase tracking-[0.6em] flex items-center gap-4"><Map className="w-3 h-3" /> {t('booking.route_details')}</h4>
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
                        <h4 className="text-[9px] font-accent text-gold-500/40 uppercase tracking-[0.6em] flex items-center gap-4"><Calendar className="w-3 h-3" /> {t('booking.schedule_guests')}</h4>
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
                        <h4 className="text-[9px] font-accent text-gold-500/40 uppercase tracking-[0.6em] flex items-center gap-4"><User className="w-3 h-3" /> {t('booking.guest_info')}</h4>
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
                        <h4 className="text-[9px] font-accent text-gold-500/40 uppercase tracking-[0.6em] flex items-center gap-4"><CreditCard className="w-3 h-3" /> {t('booking.payment_method')}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {['cash', 'pos'].map(m => (
                            <button key={m} onClick={() => setFormData(p => ({ ...p, paymentMethod: m as any }))} className={`p-6 border rounded-3xl text-[10px] uppercase tracking-widest transition-all ${formData.paymentMethod === m ? 'border-gold-500/50 bg-gold-500/5 text-gold-100' : 'border-white/5 text-gray-600'}`}>
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
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gold-500/10 mb-8 border border-gold-500/20"><Star className="w-6 h-6 text-gold-400" /></div>
                      <h3 className="text-3xl font-display text-gold-100 uppercase tracking-widest italic">{t('booking.step4_title')}</h3>
                    </div>
                    <div className="glass-2026 rounded-[40px] p-10 space-y-8 divide-y divide-white/5">
                      <div className="pb-8 grid grid-cols-2 gap-8">
                        <div><p className="text-[8px] text-gray-700 uppercase tracking-widest mb-1">{t('booking.guest')}</p><p className="text-sm italic">{formData.name}</p></div>
                        <div className="text-right"><p className="text-[8px] text-gray-700 uppercase tracking-widest mb-1">{t('booking.date')}</p><p className="text-sm italic">{new Date(formData.date).toLocaleDateString()} @ {formData.time}</p></div>
                      </div>
                      <div className="py-8"><p className="text-[8px] text-gray-700 uppercase tracking-widest mb-4">{t('booking.service')}</p><p className="text-xl font-display text-gold-400">{SERVICE_TYPES.find(s => s.id === formData.serviceType)?.name}</p></div>
                      <div className="pt-8 flex justify-between items-end">
                        <p className="text-[10px] text-gold-500/40 uppercase tracking-[0.4em]">{t('booking.total')}</p>
                        <p className="text-5xl font-display text-gold-400">€{formData.estimatedPrice}</p>
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
                <button onClick={handlePrevStep} disabled={activeStep === 1} className={`text-[10px] uppercase tracking-[0.3em] font-accent transition-all ${activeStep === 1 ? 'opacity-0' : 'text-gray-500 hover:text-white'}`}>Back</button>
                {activeStep < 4 ? (
                  <button onClick={handleNextStep} className="px-12 py-5 bg-gold-600 hover:bg-gold-500 text-black font-accent text-[11px] uppercase tracking-[0.4em] transition-all rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.2)]">Continue</button>
                ) : (
                  <button onClick={handleSubmit} disabled={isLoading || !termsAccepted} className="px-12 py-5 bg-white hover:bg-gray-100 text-black font-accent text-[11px] uppercase tracking-[0.4em] transition-all rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50">{isLoading ? <Loader2 className="animate-spin" /> : t('booking.request_booking')}</button>
                )}
              </div>
            </div>
          </main>

          <footer className="py-24 text-center border-t border-white/5 mt-20">
            <div className="max-w-4xl mx-auto px-6">
              <div className="flex justify-center gap-16 mb-20">
                {[{ icon: Instagram, label: `@${BUSINESS_INFO.instagram}`, href: `https://instagram.com/${BUSINESS_INFO.instagram}` }, { icon: MessageCircle, label: '+39 3393522164', href: 'https://wa.me/393393522164' }].map((s, i) => (
                  <a key={i} href={s.href} className="group flex flex-col items-center gap-4 transition-all">
                    <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:border-gold-500/40 group-hover:scale-110 transition-all"><s.icon className="w-5 h-5 opacity-40 group-hover:opacity-100" strokeWidth={1} /></div>
                    <span className="text-[10px] text-gray-600 group-hover:text-gold-500 tracking-[0.2em] transition-colors">{s.label}</span>
                  </a>
                ))}
              </div>
              <div className="flex flex-col items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
                <Crown className="w-6 h-6 text-gold-500/20" />
                <h4 className="font-display text-gold-100 tracking-[0.5em]">{BUSINESS_INFO.name}</h4>
                <div className="flex flex-wrap justify-center gap-6 text-[9px] uppercase tracking-widest text-gray-500">
                  <span>P.IVA: {BUSINESS_INFO.piva}</span>
                  <span>HQ: {BUSINESS_INFO.address}</span>
                </div>
                <p className="text-[8px] text-gray-700">&copy; {new Date().getFullYear()} INSOLITO. ALL RIGHTS RESERVED.</p>
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