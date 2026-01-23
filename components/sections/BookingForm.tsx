import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    Target,
    Star,
    Check,
    ArrowRight,
    ArrowLeft,
    ShieldCheck,
    MapPin,
    AlertCircle
} from 'lucide-react';
import { FormData, ValidationErrors, ServiceTypeId, TierType, PaymentMethod } from '../../types';
import { StepIndicator } from '../StepIndicator';
import { getTierRates } from '../../services/tierHelpers';
import { TierSelector } from '../TierSelector';

interface BookingFormProps {
    activeStep: number;
    formData: FormData;
    validationErrors: ValidationErrors;
    availableSlots: string[];
    termsAccepted: boolean;
    isLoading: boolean;
    t: (key: string) => string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onLocationSearch: (field: 'pickupLocation' | 'dropoffLocation', query: string) => void;
    onInputBlur: () => void;
    onPaymentMethodChange: (method: PaymentMethod) => void;
    onToggleTerms: (accepted: boolean) => void;
    onShowTerms: () => void;
    onPrevStep: () => void;
    onNextStep: () => void;
    onSelectTier: (tier: TierType) => void;
    onSubmit: (e: React.FormEvent) => void;
    isNightService: (time: string) => boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
    activeStep,
    formData,
    validationErrors,
    availableSlots,
    termsAccepted,
    isLoading,
    t,
    onInputChange,
    onLocationSearch,
    onInputBlur,
    onPaymentMethodChange,
    onToggleTerms,
    onShowTerms,
    onPrevStep,
    onNextStep,
    onSelectTier,
    onSubmit,
    isNightService
}) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <section id="booking-section" className="relative py-24 md:py-32 overflow-hidden bg-black">
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div ref={ref} className={`rounded-sm overflow-hidden transition-all duration-1000 ${activeStep >= 2 ? 'pearl-monolith' : 'luxury-monolith shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] bg-black/40 border-white/10'}`}>
                    <StepIndicator currentStep={activeStep} />

                    <div className="p-8 md:p-20">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: PROTOCOLLO (TIER) */}
                            {activeStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-12"
                                >
                                    <TierSelector
                                        selectedTier={formData.tier}
                                        onSelectTier={onSelectTier}
                                        t={t}
                                    />
                                    {validationErrors.tier && (
                                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-sm">
                                            <AlertCircle className="w-5 h-5" />
                                            <p className="text-[10px] font-mono uppercase tracking-widest">{validationErrors.tier}</p>
                                        </div>
                                    )}
                                    <div className="flex justify-end pt-8">
                                        <button
                                            onClick={onNextStep}
                                            className="btn-monumental"
                                        >
                                            Prosegui
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: MISSIONE */}
                            {activeStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-16"
                                >
                                    <div className="space-y-6 text-center md:text-left">
                                        <h3 className={`text-5xl md:text-7xl font-display tracking-tight ${activeStep >= 2 ? 'pearl-title' : 'text-white italic'}`}>
                                            Missione <span className="text-[var(--milano-bronzo)]">Fiduciaria</span>
                                        </h3>
                                        <div className={`h-px w-24 bg-gradient-to-r ${activeStep >= 2 ? 'from-[var(--milano-bronzo)] to-white' : 'from-[var(--milano-bronzo)] to-transparent'} mx-auto md:mx-0`}></div>
                                    </div>

                                    <div className="space-y-16">
                                        {/* MISSION DESCRIPTION - NOW DOMINANT */}
                                        <div className="space-y-10">
                                            <div className="flex items-center gap-4 mb-2">
                                                <Target className="w-4 h-4 text-[var(--milano-bronzo)]" />
                                                <h4 className={`text-[10px] font-mono uppercase tracking-[0.5em] ${activeStep >= 2 ? 'pearl-content' : 'opacity-40'}`}>Obiettivi Operativi</h4>
                                            </div>
                                            <div className="group relative">
                                                <label className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-4 block ${activeStep >= 2 ? 'pearl-content opacity-60' : 'opacity-40'}`}>
                                                    Dettagli della Missione *
                                                </label>
                                                <textarea
                                                    value={formData.assistanceDescription || ''}
                                                    onChange={(e) => onInputChange(e)}
                                                    name="assistanceDescription"
                                                    onBlur={onInputBlur}
                                                    placeholder="Specifichi qui, con la massima precisione, gli obiettivi e le necessità dell'incarico fiduciario. L'eccellenza risiede nel dettaglio."
                                                    className="pearl-input min-h-[400px] resize-none text-[15px] leading-relaxed shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
                                                    rows={12}
                                                />
                                                {validationErrors.assistanceDescription && (
                                                    <p className="text-red-600/90 text-[10px] mt-4 font-mono uppercase tracking-widest font-bold">
                                                        {validationErrors.assistanceDescription}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                                            {/* SCHEDULE & DURATION */}
                                            <div className="space-y-10">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <Calendar className="w-4 h-4 text-[var(--milano-bronzo)]" />
                                                    <h4 className={`text-[10px] font-mono uppercase tracking-[0.5em] ${activeStep >= 2 ? 'pearl-content' : 'opacity-40'}`}>Finestra Operativa</h4>
                                                </div>
                                                <div className="space-y-8">
                                                    <div className="group relative">
                                                        <label className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-2 block ${activeStep >= 2 ? 'pearl-content opacity-60' : 'opacity-40'}`}>Data di Attivazione</label>
                                                        <input
                                                            type="date"
                                                            name="date"
                                                            value={formData.date}
                                                            onChange={onInputChange}
                                                            min={new Date().toISOString().split('T')[0]}
                                                            className="pearl-input"
                                                            style={{ colorScheme: 'light' }}
                                                        />
                                                        {validationErrors.date && <p className="text-red-600 text-[10px] mt-2 font-mono uppercase tracking-widest font-bold">{validationErrors.date}</p>}
                                                    </div>
                                                    <div className="group relative">
                                                        <label className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-2 block ${activeStep >= 2 ? 'pearl-content opacity-60' : 'opacity-40'}`}>Debutto Temporale del Presidio</label>
                                                        <select
                                                            name="time"
                                                            value={formData.time}
                                                            onChange={onInputChange}
                                                            disabled={!formData.date}
                                                            className={`pearl-input ${!formData.date ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                        >
                                                            <option value="">
                                                                {!formData.date ? 'SBLOCCA FINESTRA SCEGLIENDO DATA' : 'DEFINISCI DEBUTTO'}
                                                            </option>
                                                            {availableSlots.map(s => <option key={s} value={s}>{s} {isNightService(s) ? '(NIGHT)' : ''}</option>)}
                                                        </select>
                                                        <div className="absolute right-4 top-[70%] -translate-y-1/2 pointer-events-none">
                                                            <Clock className={`w-4 h-4 ${!formData.date ? 'opacity-5' : 'text-[var(--milano-bronzo)]/40'}`} />
                                                        </div>
                                                        {validationErrors.time && <p className="text-red-600 text-[10px] mt-2 font-mono uppercase tracking-widest font-bold">{validationErrors.time}</p>}
                                                    </div>
                                                </div>

                                                {/* TIER RECAP */}
                                                <div className="space-y-10">
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <Star className="w-4 h-4 text-[var(--milano-bronzo)]" />
                                                        <h4 className={`text-[10px] font-mono uppercase tracking-[0.5em] ${activeStep >= 2 ? 'pearl-content' : 'opacity-40'}`}>Protocollo Selezionato</h4>
                                                    </div>
                                                    {formData.tier && (
                                                        <div className="p-10 border-2 border-[var(--milano-bronzo)]/30 bg-black/[0.02] shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
                                                            <div className="flex items-start gap-8">
                                                                <div className="w-16 h-16 rounded-full border-2 border-[var(--milano-bronzo)] flex items-center justify-center shrink-0">
                                                                    <Check className="w-8 h-8 text-[var(--milano-bronzo)]" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-mono text-[var(--milano-bronzo)] uppercase tracking-[0.4em] font-bold mb-2">Status: Confermato</p>
                                                                    <p className="text-4xl font-accent text-[var(--antracite-elite)] uppercase tracking-tight">
                                                                        {formData.tier}
                                                                    </p>
                                                                    <p className="text-[11px] font-mono text-black/70 uppercase tracking-widest mt-4 leading-relaxed font-bold">
                                                                        {formData.tier === 'elite' ? 'Copertura Mensile Illimitata' : `${getTierRates(formData.tier as TierType).minHours} ore di assistenza incluse`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between gap-6 pt-12 border-t border-black/5">
                                            <button
                                                onClick={onPrevStep}
                                                className="flex items-center justify-center gap-3 px-10 py-5 text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-black/40 hover:text-black transition-colors"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                                Indietro
                                            </button>
                                            <button
                                                onClick={onNextStep}
                                                className="btn-monumental"
                                            >
                                                Prosegui
                                            </button>
                                        </div>
                                </motion.div>
                            )}

                            {/* STEP 3: PROFILO (USER INFO) */}
                            {activeStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-16"
                                >
                                    <div className="space-y-6 text-center md:text-left">
                                        <h3 className="text-4xl md:text-6xl font-display pearl-title tracking-tight">
                                            Profilo <span className="text-[var(--milano-bronzo)]">Fiduciario</span>
                                        </h3>
                                        <div className="h-px w-24 bg-gradient-to-r from-[var(--milano-bronzo)] to-white mx-auto md:mx-0"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                                        <div className="space-y-10">
                                            <div className="group relative">
                                                <label className="text-[9px] font-mono pearl-content opacity-60 uppercase tracking-[0.3em] mb-2 block">Nome & Cognome *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={onInputChange}
                                                    placeholder="NOME COMPLETO"
                                                    className="pearl-input"
                                                />
                                                {validationErrors.name && <p className="text-red-500/80 text-[9px] mt-2 font-mono uppercase tracking-widest">{validationErrors.name}</p>}
                                            </div>
                                            <div className="group relative">
                                                <label className="text-[9px] font-mono pearl-content opacity-60 uppercase tracking-[0.3em] mb-2 block">E-mail Fiduciaria *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={onInputChange}
                                                    placeholder="EMAIL@ESCLUSIVA.COM"
                                                    className="pearl-input"
                                                />
                                                {validationErrors.email && <p className="text-red-500/80 text-[9px] mt-2 font-mono uppercase tracking-widest">{validationErrors.email}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="group relative">
                                                <label className="text-[9px] font-mono pearl-content opacity-60 uppercase tracking-[0.3em] mb-2 block">Recapito Telefonico *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={onInputChange}
                                                    placeholder="+39 000 000 0000"
                                                    className="pearl-input"
                                                />
                                                {validationErrors.phone && <p className="text-red-500/80 text-[9px] mt-2 font-mono uppercase tracking-widest">{validationErrors.phone}</p>}
                                            </div>
                                            <div className="group relative">
                                                <label className="text-[9px] font-mono pearl-content opacity-60 uppercase tracking-[0.3em] mb-2 block">Metodo di Versamento</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {(['credit_card', 'stripe'] as PaymentMethod[]).map(method => (
                                                        <button
                                                            key={method}
                                                            type="button"
                                                            onClick={() => onPaymentMethodChange(method)}
                                                            className={`py-5 text-[10px] font-mono uppercase tracking-[0.2em] border transition-all duration-500 ${formData.paymentMethod === method ? 'bg-black text-white border-black' : 'border-black/10 text-black/40 hover:border-black/30'}`}
                                                        >
                                                            {method.replace('_', ' ')}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-between gap-6 pt-12 border-t border-black/5">
                                        <button
                                            onClick={onPrevStep}
                                            className="flex items-center justify-center gap-3 px-10 py-5 text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-black/40 hover:text-black transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Indietro
                                        </button>
                                        <button
                                            onClick={onNextStep}
                                            className="btn-monumental"
                                        >
                                            Revisione Finale
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: REVISIONE */}
                            {activeStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-16"
                                >
                                    <div className="space-y-6 text-center md:text-left">
                                        <h3 className="text-4xl md:text-6xl font-display pearl-title tracking-tight">
                                            Revisione <span className="text-[var(--milano-bronzo)]">Incarico</span>
                                        </h3>
                                        <div className="h-px w-24 bg-gradient-to-r from-[var(--milano-bronzo)] to-white mx-auto md:mx-0"></div>
                                    </div>

                                    <div className="p-12 border-2 border-[var(--milano-bronzo)]/30 bg-black/[0.02] shadow-[0_40px_100px_rgba(0,0,0,0.05)] space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                            <div className="space-y-4">
                                                <p className="text-[9px] font-mono text-[var(--milano-bronzo)] uppercase tracking-[0.4em] font-bold">Identità</p>
                                                <p className="text-xl font-accent text-black uppercase">{formData.name}</p>
                                                <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">{formData.email}</p>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[9px] font-mono text-[var(--milano-bronzo)] uppercase tracking-[0.4em] font-bold">Protocollo</p>
                                                <p className="text-xl font-accent text-black uppercase">{formData.tier}</p>
                                                <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">ASSISTENZA ATTIVA</p>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[9px] font-mono text-[var(--milano-bronzo)] uppercase tracking-[0.4em] font-bold">Attivazione</p>
                                                <p className="text-xl font-accent text-black uppercase">{formData.date} - {formData.time}</p>
                                                <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">DEBUTTO MISSIONE</p>
                                            </div>
                                        </div>

                                        <div className="pt-12 border-t border-black/5 space-y-6">
                                            <p className="text-[9px] font-mono text-[var(--milano-bronzo)] uppercase tracking-[0.4em] font-bold text-center">Sommario della Missione</p>
                                            <p className="text-[11px] font-mono text-black/60 leading-relaxed uppercase tracking-wider text-center max-w-3xl mx-auto">
                                                "{formData.assistanceDescription}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-10">
                                        <label className="flex items-center gap-4 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={termsAccepted}
                                                onChange={(e) => onToggleTerms(e.target.checked)}
                                                className="hidden"
                                            />
                                            <div className={`w-6 h-6 border-2 flex items-center justify-center transition-all duration-500 ${termsAccepted ? 'bg-black border-black' : 'border-black/20 group-hover:border-black/40'}`}>
                                                {termsAccepted && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                            <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest group-hover:text-black transition-colors">
                                                Accetto il <button onClick={onShowTerms} className="text-[var(--milano-bronzo)] hover:underline">Protocollo Legale d'Élite</button>
                                            </span>
                                        </label>

                                        <div className="flex flex-col md:flex-row gap-6 w-full">
                                            <button
                                                onClick={onPrevStep}
                                                className="flex-1 px-10 py-6 text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-black/40 border border-black/5 hover:bg-black/5 transition-all"
                                            >
                                                Rivedi Dati
                                            </button>
                                            <button
                                                onClick={onSubmit}
                                                disabled={!termsAccepted || isLoading}
                                                className={`flex-[2] btn-monumental ${(!termsAccepted || isLoading) ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                                            >
                                                {isLoading ? 'SINCRONIZZAZIONE...' : 'INVIA RICHIESTA FIDUCIARIA'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingForm;
