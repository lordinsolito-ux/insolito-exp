import React, { forwardRef } from 'react';
import {
    Star,
    Loader2,
    Calendar,
    MapPin,
    Clock,
    CreditCard,
    ShieldCheck,
    Target,
    User,
    Phone,
    Mail,
    ChevronRight,
    ChevronLeft,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepIndicator } from '../StepIndicator';
import { TierSelector } from '../TierSelector';
import { SERVICE_TYPES, COUNTRY_CODES } from '../../constants';
import { BookingFormData, ValidationErrors, TierType } from '../../types';
import { getTierRates } from '../../services/tierHelpers';

interface BookingFormProps {
    activeStep: number;
    formData: BookingFormData;
    validationErrors: ValidationErrors;
    availableSlots: string[];
    termsAccepted: boolean;
    isLoading: boolean;
    t: (key: string) => string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onLocationSearch: (type: 'pickup' | 'destination' | 'stop', value: string, index?: number) => void;
    onInputBlur: () => void;
    onPaymentMethodChange: (method: 'cash' | 'pos') => void;
    onToggleTerms: (checked: boolean) => void;
    onShowTerms: () => void;
    onPrevStep: () => void;
    onNextStep: () => void;
    onSelectTier: (tier: TierType) => void;
    onSubmit: () => void;
    isNightService: (time: string) => boolean;
}

const BookingForm = forwardRef<HTMLDivElement, BookingFormProps>(({
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
}, ref) => {

    return (
        <section id="booking-section" className="relative py-24 md:py-32 overflow-hidden bg-black">
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div ref={ref} className="luxury-monolith rounded-sm overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] bg-black/40 backdrop-blur-3xl">
                    <StepIndicator currentStep={activeStep} />

                    <div className="p-8 md:p-20">
                        <AnimatePresence mode="wait">
                            {activeStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <TierSelector
                                        selectedTier={formData.tier as TierType}
                                        onSelectTier={onSelectTier}
                                        t={t}
                                    />
                                </motion.div>
                            )}

                            {activeStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                                    className="space-y-16"
                                >
                                    <div className="space-y-6 text-center md:text-left">
                                        <h3 className="text-4xl md:text-6xl font-display text-white tracking-tight italic">
                                            Missione <span className="text-[var(--milano-bronzo)]">Fiduciaria</span>
                                        </h3>
                                        <div className="h-px w-24 bg-gradient-to-r from-[var(--milano-bronzo)] to-transparent mx-auto md:mx-0"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                                        {/* MISSION DESCRIPTION */}
                                        <div className="space-y-10">
                                            <div className="flex items-center gap-4 mb-2">
                                                <Target className="w-4 h-4 text-[var(--milano-bronzo)]" />
                                                <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em]">Protocollo di Missione</h4>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="group relative">
                                                    <label className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-4 block">
                                                        Obiettivi dell'Incarico *
                                                    </label>
                                                    <textarea
                                                        value={formData.assistanceDescription || ''}
                                                        onChange={(e) => onInputChange(e)}
                                                        name="assistanceDescription"
                                                        onBlur={onInputBlur}
                                                        placeholder="Specifichi gli obiettivi della missione: coordinamento agende, assistenza fiduciaria, presidio logistico o gestione di variabili operative complesse. L'eccellenza risiede nei dettagli della Sua richiesta."
                                                        className="elite-input min-h-[160px] resize-none text-[11px]"
                                                        rows={6}
                                                    />
                                                    {validationErrors.assistanceDescription && (
                                                        <p className="text-red-500/80 text-[9px] mt-2 font-mono uppercase tracking-widest">
                                                            {validationErrors.assistanceDescription}
                                                        </p>
                                                    )}
                                                    <p className="text-[8px] text-white/20 mt-4 leading-relaxed font-mono uppercase tracking-tight">
                                                        Focus: L'accuratezza della descrizione definisce la qualità del presidio logistico.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SCHEDULE & DURATION */}
                                        <div className="space-y-10">
                                            <div className="flex items-center gap-4 mb-2">
                                                <Calendar className="w-4 h-4 text-[var(--milano-bronzo)]" />
                                                <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em]">Finestra Operativa</h4>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="group relative">
                                                    <label className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 block">Data di Attivazione</label>
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        value={formData.date}
                                                        onChange={onInputChange}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="elite-input"
                                                        style={{ colorScheme: 'dark' }}
                                                    />
                                                    {validationErrors.date && <p className="text-red-500/80 text-[9px] mt-2 font-mono uppercase tracking-widest">{validationErrors.date}</p>}
                                                </div>
                                                <div className="group relative">
                                                    <label className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 block">Debutto Temporale del Presidio</label>
                                                    <select
                                                        name="time"
                                                        value={formData.time}
                                                        onChange={onInputChange}
                                                        disabled={!formData.date}
                                                        className={`elite-input ${!formData.date ? 'opacity-30 cursor-not-allowed' : 'bg-[#0a0a0a]'}`}
                                                    >
                                                        <option value="" className="bg-[#0a0a0a]">
                                                            {!formData.date ? 'SBLOCCA FINESTRA SCEGLIENDO DATA' : 'DEFINISCI DEBUTTO'}
                                                        </option>
                                                        {availableSlots.map(s => <option key={s} value={s} className="bg-[#0a0a0a]">{s} {isNightService(s) ? '(NIGHT)' : ''}</option>)}
                                                    </select>
                                                    <div className="absolute right-4 top-[70%] -translate-y-1/2 pointer-events-none">
                                                        <Clock className={`w-4 h-4 ${!formData.date ? 'text-white/5' : 'text-[var(--milano-bronzo)]/40'}`} />
                                                    </div>
                                                    {validationErrors.time && <p className="text-red-500/80 text-[9px] mt-2 font-mono uppercase tracking-widest">{validationErrors.time}</p>}
                                                </div>

                                                {formData.tier && (
                                                    <div className="p-6 bg-[var(--milano-bronzo)]/10 border border-[var(--milano-bronzo)]/30 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.05)]">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-[var(--milano-bronzo)]/20 flex items-center justify-center shrink-0">
                                                                <Star className="w-5 h-5 text-[var(--milano-bronzo)]" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-mono text-[var(--milano-bronzo)] uppercase tracking-[0.3em] font-bold mb-1">Protocollo Attivo</p>
                                                                <p className="text-lg font-accent text-white uppercase tracking-wider">
                                                                    {formData.tier}
                                                                </p>
                                                                <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest mt-1">
                                                                    {formData.tier === 'elite' ? 'Copertura Mensile Illimitata' : `${getTierRates(formData.tier as TierType).minHours} ore di assistenza incluse`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.8 }}
                                    className="space-y-16"
                                >
                                    <div className="space-y-6 text-center md:text-left">
                                        <h3 className="text-4xl md:text-6xl font-display text-white tracking-tight italic">
                                            Profilo <span className="text-[var(--milano-bronzo)]">Membro</span>
                                        </h3>
                                        <div className="h-px w-24 bg-gradient-to-r from-[var(--milano-bronzo)] to-transparent mx-auto md:mx-0"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                                        <div className="space-y-8">
                                            <input type="text" name="name" value={formData.name} onChange={onInputChange} placeholder="NOME E COGNOME" className="elite-input" />
                                            {validationErrors.name && <p className="text-red-500 text-[10px] uppercase font-mono">{validationErrors.name}</p>}

                                            <input type="email" name="email" value={formData.email} onChange={onInputChange} placeholder="EMAIL" className="elite-input" />
                                            {validationErrors.email && <p className="text-red-500 text-[10px] uppercase font-mono">{validationErrors.email}</p>}

                                            <div className="flex gap-4">
                                                <select name="countryCode" value={formData.countryCode} onChange={onInputChange} className="w-32 elite-input">
                                                    {COUNTRY_CODES.map(c => <option key={c.code} value={c.code} className="bg-[#0a0a0a]">{c.code}</option>)}
                                                </select>
                                                <input type="tel" name="phone" value={formData.phone} onChange={onInputChange} placeholder="TELEFONO" className="flex-1 elite-input" />
                                            </div>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="flex items-center gap-4 mb-2">
                                                <CreditCard className="w-4 h-4 text-[var(--milano-bronzo)]" />
                                                <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em]">Canale di Regolamento</h4>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="py-6 border border-[var(--milano-bronzo)]/30 bg-[var(--milano-bronzo)]/5 text-center px-4">
                                                    <p className="text-[10px] font-mono text-white uppercase tracking-[0.2em] mb-2 font-bold">Stripe Secure Payment Link</p>
                                                    <p className="text-[8px] text-white/40 font-mono uppercase tracking-widest leading-relaxed">
                                                        Riceverà un link di pagamento dedicato via email <br /> a seguito dell'accettazione fiduciaria dell'incarico.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-4 border border-white/5 bg-white/[0.01]">
                                                <p className="text-[7px] font-mono text-white/25 uppercase leading-relaxed text-center italic">
                                                    *Non accettiamo pagamenti diretti in contanti per garantire la massima tracciabilità e sicurezza delle transazioni fiduciarie d'élite.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1 }}
                                    className="space-y-16 text-center"
                                >
                                    <div className="space-y-8">
                                        <Star className="w-12 h-12 text-[var(--milano-bronzo)]/20 mx-auto animate-pulse-slow" strokeWidth={0.5} />
                                        <h3 className="text-3xl md:text-5xl font-display text-white italic tracking-tight">
                                            Protocollo di <span className="text-[var(--milano-bronzo)]">Revisione</span>
                                        </h3>
                                    </div>

                                    <div className="max-w-xl mx-auto space-y-12 py-12 border-y border-white/5 bg-white/[0.01] backdrop-blur-sm px-8 md:px-16">
                                        <div className="flex justify-between items-center group">
                                            <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Membro</span>
                                            <span className="text-white text-xl font-accent uppercase tracking-widest">{formData.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Protocollo Selezionato</span>
                                            <span className="text-[var(--milano-bronzo)] text-xl tracking-widest uppercase font-accent">
                                                {formData.tier ? `TIER ${formData.tier}` : 'LIFESTYLE MANAGEMENT'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2 pt-8">
                                            <span className="text-[10px] font-mono text-white/20 uppercase tracking-[1em]">Investimento Previsto</span>
                                            <span className="text-7xl md:text-8xl font-accent text-white tracking-tighter">€{formData.estimatedPrice}</span>
                                        </div>
                                    </div>

                                    <div className="max-w-xs mx-auto space-y-8">
                                        <input
                                            type="text"
                                            placeholder="CODICE PROMO (OPZIONALE)"
                                            className="w-full bg-transparent border-b border-white/10 text-center text-[11px] font-mono uppercase tracking-[0.3em] py-4 text-[var(--milano-bronzo)] focus:border-[var(--milano-bronzo)] outline-none"
                                        />

                                        <div className="flex items-start gap-4 text-left">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={termsAccepted}
                                                onChange={e => onToggleTerms(e.target.checked)}
                                                className="mt-1 w-4 h-4 border-white/10 bg-transparent text-[var(--milano-bronzo)] focus:ring-0 rounded-none"
                                            />
                                            <label htmlFor="terms" className="text-[10px] text-white/30 font-mono tracking-widest uppercase leading-relaxed">
                                                Accetto il <button onClick={onShowTerms} className="text-[var(--milano-bronzo)] hover:text-white transition-colors underline underline-offset-4">Contratto di Lifestyle Management</button> e dichiaro di essere a conoscenza che questo <span className="text-white/60">NON è un servizio NCC</span>.
                                            </label>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ACTION BAR */}
                    <div className="px-8 md:px-20 py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 bg-black/60 relative z-20">
                        <button
                            onClick={onPrevStep}
                            className={`text-[10px] font-mono uppercase tracking-[0.5em] text-white/20 hover:text-white transition-all duration-500 ${activeStep > 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                            &larr; Indietro
                        </button>

                        <div className="w-full md:w-auto">
                            {activeStep === 4 && (
                                <div className="mb-8 p-5 bg-black/40 border border-[var(--milano-bronzo)]/20 rounded-lg backdrop-blur-sm text-left">
                                    <div className="flex items-start gap-3">
                                        <div className="text-[var(--milano-bronzo)] mt-0.5 font-bold">⚖️</div>
                                        <div>
                                            <h4 className="text-[11px] uppercase tracking-widest text-[var(--milano-bronzo)] font-bold mb-3 flex items-center gap-2">
                                                Informativa Contrattuale
                                                <span className="text-[8px] text-gray-500 font-normal ml-2">(Art. 2222 C.C.)</span>
                                            </h4>
                                            <p className="text-[9px] leading-relaxed text-gray-300">
                                                La presente richiesta costituisce conferimento di incarico per la prestazione di servizi di <strong className="text-white">assistenza personale, coordinamento logistico e supporto fiduciario</strong>, regolati dalle norme sul <a href="https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:codice.civile:1942-03-16~art2222!" target="_blank" rel="noopener noreferrer" className="underline text-[var(--milano-bronzo)] hover:text-white transition-colors"><strong>Contratto d'Opera (Art. 2222 e seguenti C.C.)</strong></a>. Il prestatore opera come <strong className="text-white">consulente gestionale e assistente lifestyle</strong>. Eventuali supporti alla mobilità sono da intendersi come <strong className="text-white">accessori e strumentali</strong> all'esecuzione della missione richiesta. L'accettazione dell'incarico è soggetta a conferma.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeStep < 4 ? (
                                <button
                                    onClick={onNextStep}
                                    className="w-full md:w-auto px-16 py-6 bg-white text-black font-accent text-[11px] uppercase tracking-[0.4em] hover:bg-[var(--milano-bronzo)] hover:text-white transition-all duration-700 active:scale-[0.98] shadow-2xl"
                                >
                                    Prosegui
                                </button>
                            ) : (
                                <button
                                    onClick={onSubmit}
                                    disabled={isLoading || !termsAccepted}
                                    className="w-full md:w-auto px-16 py-6 bg-[var(--milano-bronzo)] text-white font-accent text-[11px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-700 disabled:opacity-20 active:scale-[0.98] shadow-[0_20px_50px_rgba(139,115,85,0.3)]"
                                >
                                    {isLoading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Richiedi Accesso Privé"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* FOOTER CUE */}
                <div className="mt-12 text-center">
                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.5em]">
                        Private Access &bull; Secured Connection &bull; 24/7 Availability
                    </p>
                </div>
            </div>
        </section>
    );
});

BookingForm.displayName = 'BookingForm';

export default BookingForm;
