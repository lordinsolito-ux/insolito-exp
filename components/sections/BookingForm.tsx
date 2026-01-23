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
    AlertCircle,
    Paperclip,
    FileText,
    Music,
    Video,
    Image as ImageIcon,
    X
} from 'lucide-react';
import { BookingFormData, ValidationErrors, ServiceTypeId, TierType, PaymentMethod } from '../../types';
import { StepIndicator } from '../StepIndicator';
import { getTierRates } from '../../services/tierHelpers';
import { TierSelector } from '../TierSelector';

interface BookingFormProps {
    isOpen: boolean;
    onClose: () => void;
    activeStep: number;
    formData: BookingFormData;
    validationErrors: ValidationErrors;
    availableSlots: string[];
    termsAccepted: boolean;
    isLoading: boolean;
    t: (key: string) => string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onLocationSearch: (type: 'pickup' | 'destination' | 'stop', value: string, index?: number) => void;
    onInputBlur: () => void;
    onPaymentMethodChange: (method: PaymentMethod) => void;
    onToggleTerms: (accepted: boolean) => void;
    onShowTerms: () => void;
    onPrevStep: () => void;
    onNextStep: () => void;
    onSelectTier: (tier: TierType) => void;
    onAddAttachments: (files: File[]) => void;
    onRemoveAttachment: (index: number) => void;
    onSubmit: (e: React.FormEvent) => void;
    isNightService: (time: string) => boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
    isOpen,
    onClose,
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
    onAddAttachments,
    onRemoveAttachment,
    onSubmit,
    isNightService
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Scroll lock and focus
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            onAddAttachments(files);
            // Clear input so same file can be selected again
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return <FileText className="w-4 h-4" />;
        if (type.includes('audio')) return <Music className="w-4 h-4" />;
        if (type.includes('video')) return <Video className="w-4 h-4" />;
        if (type.includes('image')) return <ImageIcon className="w-4 h-4" />;
        return <Paperclip className="w-4 h-4" />;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-start justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8 overflow-y-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className={`relative w-[92vw] md:w-full max-w-3xl mt-16 md:mt-20 rounded-lg overflow-hidden transition-all duration-1000 shadow-2xl mb-8 ${activeStep >= 2 ? 'pearl-monolith border-none border-2 border-black/5' : 'luxury-monolith border border-white/10'}`}
                    >
                        {/* CLOSE BUTTON - ARCHITECTURAL PRECISION */}
                        <button
                            onClick={onClose}
                            className={`absolute top-3 right-3 md:top-4 md:right-4 z-[210] p-2 group transition-all duration-700 ${activeStep >= 2 ? 'text-black/40 hover:text-black' : 'text-white/40 hover:text-white'}`}
                        >
                            <X className="w-5 h-5 transition-transform group-hover:rotate-90 duration-700" strokeWidth={1} />
                        </button>

                        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

                        <div className="relative z-10 w-full">
                            <StepIndicator currentStep={activeStep} />

                            <div className="p-4 md:p-8 lg:p-10">
                                <AnimatePresence mode="wait">
                                    {/* STEP 1: PROTOCOLLO (TIER) */}
                                    {activeStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <TierSelector
                                                selectedTier={formData.tier || undefined}
                                                onSelectTier={onSelectTier}
                                                t={t}
                                            />
                                            <div className="flex justify-between pt-4 border-t border-black/10">
                                                <button onClick={onClose} className="text-[10px] font-mono uppercase tracking-widest text-black/80 hover:text-black transition-colors font-bold">Indietro</button>
                                                <button onClick={onNextStep} className="btn-monumental scale-90 px-12">Prosegui</button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 2: MISSIONE & ALLEGATI */}
                                    {activeStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6 md:space-y-8"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-4">
                                                <h3
                                                    className="text-2xl font-display pearl-title tracking-tighter leading-tight text-black"
                                                >
                                                    Missione <span className="text-[var(--milano-bronzo)]">Fiduciaria</span>
                                                </h3>
                                                <span className="text-[8px] font-mono text-black/30 uppercase tracking-[0.4em]">Servizio Scelto: {formData.tier}</span>
                                            </div>

                                            <div className="space-y-6">
                                                {/* RECTANGULAR TEXTAREA - COMPACT */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <Target className="w-3.5 h-3.5 text-[var(--milano-bronzo)]" />
                                                        <h4 className="text-[9px] font-mono uppercase tracking-[0.4em] text-black font-bold">Obiettivi Operativi</h4>
                                                    </div>
                                                    <textarea
                                                        value={formData.assistanceDescription || ''}
                                                        onChange={(e) => onInputChange(e)}
                                                        name="assistanceDescription"
                                                        onBlur={onInputBlur}
                                                        placeholder="Specifichi gli obiettivi..."
                                                        className={`pearl-input w-full min-h-[100px] text-[13px] leading-relaxed bg-black/[0.02] border focus:bg-white focus:border-[var(--milano-bronzo)] transition-all shadow-inner text-black p-4 ${validationErrors.assistanceDescription ? 'border-red-500 bg-red-50/10' : 'border-black/10'}`}
                                                    />
                                                    {validationErrors.assistanceDescription && (
                                                        <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" /> {validationErrors.assistanceDescription}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                                    {/* FINESTRA TEMPORALE */}
                                                    <div className="space-y-4 p-5 bg-black/[0.03] border border-black/5 rounded-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-3.5 h-3.5 text-[var(--milano-bronzo)]" />
                                                            <h4 className="text-[9px] font-mono uppercase tracking-[0.4em] text-black font-bold">Finestra</h4>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                <input type="date" name="date" value={formData.date} onChange={onInputChange} className={`pearl-input !p-2.5 !text-[11px] !bg-white text-black shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer w-full ${validationErrors.date ? 'border-red-500' : 'border-black/10'}`} style={{ colorScheme: 'light' }} />
                                                                {validationErrors.date && <p className="text-[8px] font-mono text-red-500 uppercase">Richiesto</p>}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <select name="time" value={formData.time} onChange={onInputChange} disabled={!formData.date} className={`pearl-input !p-2.5 !text-[11px] !bg-white text-black shadow-sm w-full ${validationErrors.time ? 'border-red-500' : 'border-black/10'}`}>
                                                                    <option value="">DEBUTTO</option>
                                                                    {availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
                                                                </select>
                                                                {validationErrors.time && <p className="text-[8px] font-mono text-red-500 uppercase">Richiesto</p>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* CAVEAU ALLEGATI */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-2">
                                                            <ShieldCheck className="w-3.5 h-3.5 text-[var(--milano-bronzo)]" />
                                                            <h4 className="text-[9px] font-mono uppercase tracking-[0.4em] text-black font-bold">Caveau</h4>
                                                        </div>
                                                        <div
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="pearl-vault !py-5 !px-4 cursor-pointer border-dashed border-2 border-black/10 hover:border-[var(--milano-bronzo)] transition-all bg-black/[0.01] flex items-center gap-3 group"
                                                        >
                                                            <Paperclip className="w-4 h-4 text-black/40 group-hover:text-[var(--milano-bronzo)] transition-colors" />
                                                            <div className="text-left flex flex-col">
                                                                <span className="text-[9px] font-mono uppercase tracking-widest text-black font-bold">Allega Media</span>
                                                                <span className="text-[7px] font-mono text-black/30 uppercase">PDF, Video, Foto, Audio</span>
                                                            </div>
                                                            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {formData.attachments?.slice(0, 3).map((file, idx) => (
                                                                <div key={idx} className="attachment-chip !px-2 !py-1 text-[8px] bg-black/5 border border-black/10 text-black flex items-center gap-1.5 shadow-sm">
                                                                    <span className="truncate max-w-[80px] font-medium">{file.name}</span>
                                                                    <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-500" onClick={(e) => { e.stopPropagation(); onRemoveAttachment(idx); }} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-6 border-t border-black/10">
                                                <button onClick={onPrevStep} className="text-[10px] font-mono uppercase tracking-widest text-black/80 hover:text-black transition-colors font-bold">Indietro</button>
                                                <button onClick={onNextStep} className="btn-monumental !bg-black !text-white hover:!bg-[var(--milano-bronzo)] transition-all shadow-xl px-14 py-4">Prosegui</button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3: PROFILO */}
                                    {activeStep === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6 md:space-y-8"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-4">
                                                <h3
                                                    className="text-2xl font-display pearl-title tracking-tighter leading-tight text-black"
                                                >
                                                    Profilo <span className="text-[var(--milano-bronzo)]">Fiduciario</span>
                                                </h3>
                                                <span className="text-[8px] font-mono text-black/30 uppercase tracking-[0.4em]">Identità Digitale</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <div className="space-y-4">
                                                    <input type="text" name="name" value={formData.name} onChange={onInputChange} placeholder="NOME COMPLETO" className="pearl-input !py-3 !text-[12px] bg-black/[0.02] border-black/10 focus:bg-white transition-all shadow-sm" />
                                                    <input type="email" name="email" value={formData.email} onChange={onInputChange} placeholder="EMAIL@ESCLUSIVA.COM" className="pearl-input !py-3 !text-[12px] bg-black/[0.02] border-black/10 focus:bg-white transition-all shadow-sm" />
                                                </div>
                                                <div className="space-y-4">
                                                    <input type="tel" name="phone" value={formData.phone} onChange={onInputChange} placeholder="RECAPITO TELEFONICO" className="pearl-input !py-3 !text-[12px] bg-black/[0.02] border-black/10 focus:bg-white transition-all shadow-sm" />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {(['credit_card', 'stripe'] as PaymentMethod[]).map(method => (
                                                            <button key={method} type="button" onClick={() => onPaymentMethodChange(method)} className={`py-3 text-[8px] font-mono border transition-all ${formData.paymentMethod === method ? 'bg-black text-white border-black shadow-md' : 'border-black/10 text-black/30 hover:border-black/20'}`}>
                                                                {method.toUpperCase()}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-6 border-t border-black/10">
                                                <button onClick={onPrevStep} className="text-[10px] font-mono uppercase tracking-widest text-black/80 hover:text-black transition-colors font-bold">Indietro</button>
                                                <button onClick={onNextStep} className="btn-monumental !bg-black !text-white hover:!bg-[var(--milano-bronzo)] transition-all shadow-xl px-14 py-4">Revisione</button>
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
                                            className="space-y-6 md:space-y-8"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-4">
                                                <h3
                                                    className="text-2xl font-display pearl-title tracking-tighter leading-tight text-black"
                                                >
                                                    Revisione <span className="text-[var(--milano-bronzo)]">Incarico</span>
                                                </h3>
                                                <span className="text-[8px] font-mono text-black/30 uppercase tracking-[0.4em]">Riassunto Finale</span>
                                            </div>

                                            <div className="p-6 border border-[var(--milano-bronzo)]/30 bg-black/[0.02] rounded-sm space-y-6 shadow-sm">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-mono text-[var(--milano-bronzo)] uppercase tracking-widest font-bold">Identità</p>
                                                        <p className="text-[12px] font-accent text-black uppercase truncate font-bold">{formData.name}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-mono text-[var(--milano-bronzo)] uppercase tracking-widest font-bold">Piano</p>
                                                        <p className="text-[12px] font-accent text-black uppercase font-bold">{formData.tier}</p>
                                                    </div>
                                                    <div className="space-y-1 md:col-span-2">
                                                        <p className="text-[8px] font-mono text-[var(--milano-bronzo)] uppercase tracking-widest font-bold">Attivazione</p>
                                                        <p className="text-[12px] font-accent text-black uppercase font-bold">{formData.date} — {formData.time}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center gap-6 pt-2">
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="checkbox" checked={termsAccepted} onChange={(e) => onToggleTerms(e.target.checked)} className="hidden" />
                                                    <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${termsAccepted ? 'bg-black border-black/10 shadow-md' : 'border-black/20 group-hover:border-black/40'}`}>
                                                        {termsAccepted && <Check className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                    <span className="text-[9px] font-mono text-black/60 uppercase tracking-[0.2em] group-hover:text-black transition-colors font-bold">Accetto l'Impegno di Riservatezza</span>
                                                </label>

                                                <button
                                                    onClick={onSubmit}
                                                    disabled={!termsAccepted || isLoading}
                                                    className="btn-monumental !bg-black !text-white hover:!bg-[var(--milano-bronzo)] w-full md:w-auto px-16 py-4 shadow-2xl active:scale-[0.98] transition-all"
                                                >
                                                    {isLoading ? 'INVIO...' : 'RICHIEDI DISPONIBILITÀ'}
                                                </button>

                                                <button onClick={onPrevStep} className="text-[10px] font-mono uppercase tracking-widest text-black/80 hover:text-black transition-colors font-bold">Modifica Dati</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BookingForm;
