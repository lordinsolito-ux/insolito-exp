import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import {
  SERVICE_TYPES,
  COUNTRY_CODES
} from './constants';
import {
  BookingFormData,
  VehicleTypeId,
  ValidationErrors,
  LocationSuggestion,
  RouteInfo,
  ServiceTypeId,
  BookingRecord,
  TierType
} from './types';

// Existing Components
import LanguageSwitcher from './components/LanguageSwitcher';
import LegalModal from './components/LegalModal';
import { TermsModal } from './components/TermsModal';
import { BookingConfirmation } from './components/BookingConfirmation';
import { BookingHistoryModal } from './components/BookingHistoryModal';
import { AdminDashboard } from './components/AdminDashboard';
import { RouteModal } from './components/RouteModal';
import { AdminLoginModal } from './components/AdminLoginModal';

// Extracted Sections
import IntroSplash from './components/sections/IntroSplash';
import VisionModal from './components/sections/VisionModal';
import BrandStoryModal from './components/sections/BrandStoryModal';
import FloatingHeader from './components/sections/FloatingHeader';
import Hero from './components/sections/Hero';
import NarrativeSpread from './components/sections/NarrativeSpread';
import AntiLuxury from './components/sections/AntiLuxury';
// import ServiceSelection from './components/sections/ServiceSelection'; // Removed Legacy Cards
import BookingForm from './components/sections/BookingForm';
import Footer from './components/sections/Footer';
import GhostModeOverlay from './components/sections/GhostModeOverlay';
import TheGuardian from './components/sections/TheGuardian';
import Investment from './components/sections/Investment';
import { TierSelector } from './components/TierSelector';

// Services
import { searchLocations, calculateRoute, calculatePrice } from './services/googleMapsService';
import { getCachedRoute, cacheRoute } from './services/routeCache';
import { generateTimeSlots, checkAvailability, checkBookingConflict, saveBooking, fetchAllBookings } from './services/bookingService';
import { getTierRates } from './services/tierHelpers';
import { LEGAL_CONTENT } from './legalContent';

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
  attachments: [],
  priceBreakdown: { total: 0, baseFare: 0, distanceFare: 0, nightSurcharge: 0, petFee: 0, stopFee: 0, serviceMultiplier: 1 }
};

const App: React.FC = () => {
  const { t } = useTranslation();

  // UI States
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Form States
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_STATE);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [hasShownRouteModal, setHasShownRouteModal] = useState(false);
  const [bookingConflictError, setBookingConflictError] = useState<string | null>(null);
  const [isThankYouPage, setIsThankYouPage] = useState(false);
  const [thankYouData, setThankYouData] = useState<{ name?: string, tier?: string, price?: string }>({});
  // Startup log for verification
  useEffect(() => {
    console.log("%cINSOLITO PRIVÉ - VIRAL READY 1.0", "color: #8B7355; font-size: 20px; font-weight: bold;");
    console.log("Shadow Parallax & Cinematic Grain: ACTIVE");

    // SPA Routing for /grazie
    const path = window.location.pathname;
    if (path === '/grazie') {
      const params = new URLSearchParams(window.location.search);
      setThankYouData({
        name: params.get('name') || undefined,
        tier: params.get('tier') || undefined,
        price: params.get('price') || undefined
      });
      setIsThankYouPage(true);
      setShowIntro(false);
    }
  }, []);

  const [preselectedTier, setPreselectedTier] = useState<TierType | null>(null);

  // Refs
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const investmentRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  // Activity Monitor (Ghost Mode)
  useEffect(() => {
    const handleActivity = () => {
      setIsGhostMode(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (!showIntro && !isBookingConfirmed) setIsGhostMode(true);
      }, 30000);
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    handleActivity();
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [showIntro, isBookingConfirmed]);

  // Scroll Lock during Intro
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
      // Ensure we are at the top when starting
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showIntro]);

  // Scroll Monitor
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Step Transitions
  useEffect(() => {
    if (isBookingConfirmed) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeStep > 1) {
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeStep, isBookingConfirmed]);

  // Price Calculation
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
    } else if (formData.serviceType && !routeInfo) {
      // Only reset for legacy service types that REQUIRE a route
      setFormData(prev => ({ ...prev, estimatedPrice: 25, duration: 0 }));
    }
  }, [formData.serviceType, formData.vehiclePreference, routeInfo, formData.time, formData.hasPets, formData.stops.length, formData.date]);

  // Availability Fetch
  useEffect(() => {
    let isMounted = true;
    const fetchSlots = async () => {
      if (formData.date) {
        const theoreticalSlots = generateTimeSlots(formData.date);
        try {
          const busySlots = await checkAvailability(formData.date, formData.duration || 60);
          if (isMounted) {
            const finalSlots = theoreticalSlots.filter(t => !busySlots.includes(t));
            setAvailableSlots(finalSlots);
            if (formData.time && !finalSlots.includes(formData.time)) {
              setFormData(prev => ({ ...prev, time: '' }));
            }
          }
        } catch (e) {
          if (isMounted) setAvailableSlots(theoreticalSlots);
        }
      }
    };
    fetchSlots();
    return () => { isMounted = false; };
  }, [formData.date, formData.duration]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (bookingConflictError) {
      setBookingConflictError(null);
    }
  };

  const handleLocationSearch = async (type: 'pickup' | 'destination' | 'stop', value: string, index?: number) => {
    if (type === 'stop' && index !== undefined) {
      const newStops = [...formData.stops];
      newStops[index] = value;
      setFormData(prev => ({ ...prev, stops: newStops }));
    } else {
      setFormData(prev => ({ ...prev, [type === 'pickup' ? 'pickupLocation' : 'destination']: value }));
    }
    // Search logic simplified for refactor; ideally separate hook
    if (value.length > 2) {
      const results = await searchLocations(value);
      // Suggestions logic would go here or via child components
    }
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

  const validateStep = (step: number): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (step === 1 && !formData.tier && !formData.serviceType) {
      errors.tier = 'Seleziona un tier di servizio';
      isValid = false;
    }
    else if (step === 2) {
      if (formData.tier) {
        // Tier-based validation
        if (!formData.assistanceDescription?.trim()) {
          errors.assistanceDescription = 'Descrivi la natura dell\'incarico';
          isValid = false;
        } else if (formData.assistanceDescription.length < 10) {
          errors.assistanceDescription = 'La descrizione deve essere di almeno 10 caratteri per garantire un servizio d\'eccellenza';
          isValid = false;
        }
      } else {
        // Legacy validation
        if (!formData.pickupLocation) { errors.pickupLocation = t('validation.required'); isValid = false; }
        if (!formData.destination) { errors.destination = t('validation.required'); isValid = false; }
      }
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

  const handleTierSelect = (tier: TierType) => {
    const { hourlyRate, minHours } = getTierRates(tier);
    setFormData(prev => ({
      ...prev,
      tier: tier,
      hours: minHours,
      hourlyRate: hourlyRate,
      estimatedPrice: minHours * hourlyRate,
      duration: minHours * 60,
      priceBreakdown: {
        ...prev.priceBreakdown,
        total: minHours * hourlyRate,
        baseFare: minHours * hourlyRate,
        serviceMultiplier: 1
      }
    }));
    setActiveStep(2);
    setPreselectedTier(null);
    setIsBookingModalOpen(true);
    setBookingConflictError(null);
  };

  const handleAddAttachments = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...files]
    }));
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index)
    }));
  };

  const handleResetApp = () => { setIsBookingConfirmed(false); setActiveStep(1); setFormData(INITIAL_FORM_STATE); setRouteInfo(null); setTermsAccepted(false); };

  const handleHoursChange = (hours: number) => {
    setFormData(prev => {
      const rate = prev.hourlyRate || 0;
      return {
        ...prev,
        hours: hours,
        duration: hours * 60,
        estimatedPrice: hours * rate,
        priceBreakdown: {
          ...prev.priceBreakdown,
          total: hours * rate,
          baseFare: hours * rate
        }
      };
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const existingBookings = await fetchAllBookings();
      if (checkBookingConflict(formData, existingBookings)) {
        setBookingConflictError(t('booking.conflict_error'));
        setIsLoading(false);
        return;
      }
      const newBooking: BookingRecord = { ...formData, id: Date.now().toString(), timestamp: new Date().toISOString(), status: 'requested' };
      await saveBooking(newBooking, true);

      // WhatsApp redirect removed to keep user in-app as requested
      // The admin will receive an email automatically via the saveBooking -> sendBookingUpdateNotification flow

      setIsBookingConfirmed(true);
      setIsBookingModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isNightService = (time: string): boolean => {
    if (!time) return false;
    const [h, m] = time.split(':').map(Number);
    return (h < 6) || (h === 6 && m <= 30);
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[999] cinematic-grain"></div>
      {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}

      {/* Modals */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <BookingHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <AdminLoginModal isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} onLoginSuccess={() => setShowAdminDashboard(true)} />
      <AdminDashboard isOpen={showAdminDashboard} onClose={() => setShowAdminDashboard(false)} />
      <RouteModal isOpen={showRouteModal} onClose={() => setShowRouteModal(false)} origin={formData.pickupLocation} destination={formData.destination} routeInfo={routeInfo} isCalculating={isCalculatingRoute} />
      <VisionModal isOpen={isVisionOpen} onClose={() => setIsVisionOpen(false)} />
      <BrandStoryModal isOpen={showBrandStory} onClose={() => setShowBrandStory(false)} />
      <LegalModal isOpen={showLegalModal} onClose={() => setShowLegalModal(false)} title={currentLegalContent.title} content={currentLegalContent.content} />

      <FloatingHeader
        isScrolled={isScrolled}
        onPhilosophy={() => document.getElementById('essence')?.scrollIntoView({ behavior: 'smooth' })}
        onVision={() => setIsVisionOpen(true)}
        onServices={() => investmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onInquire={() => investmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />

      {isThankYouPage ? (
        <div className="fixed inset-0 bg-black z-[1000] flex items-center justify-center p-6">
          <div className="relative bg-[#050505] border border-[var(--milano-bronzo)]/20 rounded-sm shadow-[0_40px_100px_rgba(0,0,0,1)] max-w-[500px] w-full p-12 text-center animate-reveal">
            <div className="flex justify-center mb-10">
              <div className="w-20 h-20 rounded-full bg-white/[0.01] border border-[var(--milano-bronzo)]/30 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[var(--milano-bronzo)]" strokeWidth={1} />
              </div>
            </div>

            <h1 className="text-3xl font-display text-white italic mb-4 tracking-tight">Mandato Perfezionato</h1>
            <div className="inline-block bg-[var(--milano-bronzo)]/10 text-[var(--milano-bronzo)] border border-[var(--milano-bronzo)]/20 px-6 py-2 rounded-sm text-[9px] uppercase font-bold tracking-[0.5em] mb-10">
              Protocollo Fiduciario Attivo
            </div>

            <div className="text-gray-300 font-light leading-relaxed font-sans uppercase tracking-[0.15em] text-[11px] mb-12">
              Egregio <span className="text-white font-bold italic">{thankYouData.name || 'Michael'}</span>, <br />
              Il Suo mandato {thankYouData.tier ? <span className="text-[var(--milano-bronzo)] font-bold">{thankYouData.tier.toUpperCase()}</span> : ''} è stato attivato con successo. <br />
              Abbiamo ricevuto l&apos;onorario di <span className="text-white font-bold italic">€{thankYouData.price || '---'}</span> e la Sua pratica è ora in fase di esecuzione impeccabile.
            </div>

            <div className="bg-white/[0.03] p-8 rounded-sm border border-white/5 mb-10 text-left">
              <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Prossimi Passaggi:</p>
              <ul className="space-y-4 text-[10px] text-gray-400 font-light uppercase tracking-widest">
                <li className="flex gap-4"><span className="text-[var(--milano-bronzo)]">01.</span> Il Suo Lifestyle Guardian La contatterà in via riservata.</li>
                <li className="flex gap-4"><span className="text-[var(--milano-bronzo)]">02.</span> Riceverà via email il Certificato di Presa in Carico.</li>
                <li className="flex gap-4"><span className="text-[var(--milano-bronzo)]">03.</span> La logistica operativa è ora silenziata a Suo favore.</li>
              </ul>
            </div>

            <button
              onClick={() => { window.location.href = '/'; }}
              className="w-full py-5 bg-[var(--milano-bronzo)] text-white font-accent text-[10px] uppercase tracking-[0.5em] hover:brightness-110 transition-all shadow-2xl mb-4"
            >
              Ritorna alla Digital Hall
            </button>
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Insolito Privé - Milano - London - Dubai</p>
          </div>
        </div>
      ) : isBookingConfirmed ? (
        <BookingConfirmation formData={formData} onReset={handleResetApp} />
      ) : (
        <div className={`min-h-screen bg-black text-[#F8F8F8] font-sans relative overflow-x-hidden transition-opacity duration-[2000ms] ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-black"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(58,58,58,0.2),_transparent_70%)]"></div>
            <div className="absolute inset-0 bg-noise opacity-[0.05]"></div>
          </div>

          <Hero
            isScrolled={isScrolled}
            onAdminLogin={() => setShowAdminLogin(true)}
            onArchiveClick={() => setShowHistory(true)}
            onEnterClick={() => investmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
          />

          <main className="bg-transparent relative z-10">
            {/* <ServiceSelection ref={servicesRef} onServiceSelect={handleServiceSelect} /> - REMOVED LEGACY */}
            <NarrativeSpread />
            <TheGuardian onStoryClick={() => setShowBrandStory(true)} />
            <AntiLuxury />
            <div ref={investmentRef}>
              <Investment
                selectedTier={formData.tier || null}
                onBookClick={() => {
                  setActiveStep(1);
                  setIsBookingModalOpen(true);
                }}
                onTierSelect={(tier) => {
                  handleTierSelect(tier);
                }}
              />
            </div>

            <BookingForm
              isOpen={isBookingModalOpen}
              onClose={() => setIsBookingModalOpen(false)}
              activeStep={activeStep}
              formData={formData}
              validationErrors={validationErrors}
              availableSlots={availableSlots}
              termsAccepted={termsAccepted}
              isLoading={isLoading}
              t={t}
              onInputChange={handleInputChange}
              onLocationSearch={handleLocationSearch}
              onInputBlur={triggerRouteCalc}
              onPaymentMethodChange={(m) => setFormData(p => ({ ...p, paymentMethod: m }))}
              onToggleTerms={setTermsAccepted}
              onShowTerms={() => setShowTerms(true)}
              onPrevStep={handlePrevStep}
              onNextStep={handleNextStep}
              onSelectTier={handleTierSelect}
              onHoursChange={handleHoursChange}
              onAddAttachments={handleAddAttachments}
              onRemoveAttachment={handleRemoveAttachment}
              onSubmit={handleSubmit}
              isNightService={isNightService}
              conflictError={bookingConflictError}
            />
          </main>

          <Footer
            onBrandStoryClick={() => setShowBrandStory(true)}
            onVisionClick={() => setIsVisionOpen(true)}
            onLegalClick={(title, content) => { setCurrentLegalContent({ title, content }); setShowLegalModal(true); }}
            onHistoryClick={() => setShowHistory(true)}
            onAdminLoginClick={() => setShowAdminLogin(true)}
          />

          {isGhostMode && (
            <GhostModeOverlay onDismiss={() => setIsGhostMode(false)} />
          )}
        </div>
      )}
    </>
  );
};

export default App;