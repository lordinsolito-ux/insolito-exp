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
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-6 lg:p-12 overflow-y-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className={`relative w-full max-w-3xl min-h-[80vh] md:min-h-0 rounded-none md:rounded-lg overflow-hidden transition-all duration-1000 shadow-2xl ${activeStep >= 2 ? 'pearl-monolith border-none' : 'luxury-monolith border border-white/10'}`}
                    >
                        {/* CLOSE BUTTON - ARCHITECTURAL PRECISION */}
                        <button
                            onClick={onClose}
                            className={`absolute top-4 right-4 md:top-6 md:right-6 z-[210] p-2 group transition-all duration-700 ${activeStep >= 2 ? 'text-black/20 hover:text-black' : 'text-white/20 hover:text-white'}`}
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-90 duration-700" strokeWidth={1} />
                        </button>

                        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

                        <div className="relative z-10 w-full">
                            <StepIndicator currentStep={activeStep} />

                            <div className="p-6 md:p-10 lg:p-12">
                                <AnimatePresence mode="wait">
                                    {/* STEP 1: PROTOCOLLO (TIER) */}
                                    {activeStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <TierSelector
                                                selectedTier={formData.tier || undefined}
                                                onSelectTier={onSelectTier}
                                                t={t}
                                            />
                                            <div className="flex justify-end pt-4">
                                                <button onClick={onNextStep} className="btn-monumental scale-90">Prosegui</button>
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
                                            className="space-y-8 md:space-y-12"
                                        >
                                            <div className="space-y-4 text-center md:text-left border-b border-black/5 pb-6">
                                                <h3
                                                    style={{ fontSize: 'var(--text-title-md)' }}
                                                    className="font-display pearl-title tracking-tighter leading-tight"
                                                >
                                                    Missione <span className="text-[var(--milano-bronzo)]">Fiduciaria</span>
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                                <div className="lg:col-span-12 space-y-10">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3">
                                                            <Target className="w-4 h-4 text-[var(--milano-bronzo)]" />
                                                            <h4 className="text-[9px] font-mono uppercase tracking-[0.4em] pearl-content">Obiettivi Operativi</h4>
                                                        </div>
                                                        <textarea
                                                            value={formData.assistanceDescription || ''}
                                                            onChange={(e) => onInputChange(e)}
                                                            name="assistanceDescription"
                                                            onBlur={onInputBlur}
                                                            placeholder="Specifichi gli obiettivi..."
                                                            className="pearl-input min-h-[180px] text-[13px] leading-relaxed bg-black/[0.01] border border-black/5 focus:bg-white transition-all shadow-inner"
                                                            style={{ padding: 'var(--space-s)' }}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-6 p-6 bg-black/[0.02] border border-black/5 rounded-sm">
                                                            <div className="flex items-center gap-3">
                                                                <Calendar className="w-4 h-4 text-[var(--milano-bronzo)]" />
                                                                <h4 className="text-[9px] font-mono uppercase tracking-[0.4em] pearl-content">Finestra</h4>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <input type="date" name="date" value={formData.date} onChange={onInputChange} className="pearl-input !p-3 !text-[11px]" style={{ colorScheme: 'light' }} />
                                                                <select name="time" value={formData.time} onChange={onInputChange} disabled={!formData.date} className="pearl-input !p-3 !text-[11px]">
                                                                    <option value="">DEBUTTO</option>
                                                                    {availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-3">
                                                                <ShieldCheck className="w-4 h-4 text-[var(--milano-bronzo)]" />
                                                                <h4 className="text-[9px] font-mono uppercase tracking-[0.4em] pearl-content">Caveau</h4>
                                                            </div>
                                                            <div onClick={() => fileInputRef.current?.click()} className="pearl-vault !p-6 cursor-pointer">
                                                                <Paperclip className="w-5 h-5 text-black/20" />
                                                                <span className="text-[8px] font-mono uppercase tracking-widest text-black/40">Allega Media</span>
                                                                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {formData.attachments?.slice(0, 3).map((file, idx) => (
                                                                    <div key={idx} className="attachment-chip !px-2 !py-1 text-[8px]">
                                                                        <span className="truncate max-w-[80px]">{file.name}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-8 border-t border-black/5">
                                                <button onClick={onPrevStep} className="text-[9px] font-mono uppercase tracking-widest text-black/30 hover:text-black transition-colors">Indietro</button>
                                                <button onClick={onNextStep} className="btn-monumental scale-90 px-12">Prosegui</button>
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
                                            className="space-y-8 md:space-y-12"
                                        >
                                            <div className="space-y-4 text-center md:text-left border-b border-black/5 pb-6">
                                                <h3
                                                    style={{ fontSize: 'var(--text-title-md)' }}
                                                    className="font-display pearl-title tracking-tight text-black"
                                                >
                                                    Profilo <span className="text-[var(--milano-bronzo)]">Fiduciario</span>
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                                <div className="space-y-6">
                                                    <input type="text" name="name" value={formData.name} onChange={onInputChange} placeholder="NOME COMPLETO" className="pearl-input !py-4 !text-[12px]" />
                                                    <input type="email" name="email" value={formData.email} onChange={onInputChange} placeholder="EMAIL@ESCLUSIVA.COM" className="pearl-input !py-4 !text-[12px]" />
                                                </div>
                                                <div className="space-y-6">
                                                    <input type="tel" name="phone" value={formData.phone} onChange={onInputChange} placeholder="RECAPITO TELEFONICO" className="pearl-input !py-4 !text-[12px]" />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {(['credit_card', 'stripe'] as PaymentMethod[]).map(method => (
                                                            <button key={method} type="button" onClick={() => onPaymentMethodChange(method)} className={`py-4 text-[9px] font-mono border transition-all ${formData.paymentMethod === method ? 'bg-black text-white border-black shadow-lg' : 'border-black/10 text-black/30 hover:border-black/20'}`}>
                                                                {method.toUpperCase()}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-8 border-t border-black/5">
                                                <button onClick={onPrevStep} className="text-[9px] font-mono uppercase tracking-widest text-black/30 hover:text-black transition-colors">Indietro</button>
                                                <button onClick={onNextStep} className="btn-monumental scale-90 px-12">Revisione</button>
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
                                            className="space-y-8 md:space-y-10"
                                        >
                                            <div className="space-y-4 text-center md:text-left border-b border-black/5 pb-6">
                                                <h3
                                                    style={{ fontSize: 'var(--text-title-md)' }}
                                                    className="font-display pearl-title tracking-tight text-black"
                                                >
                                                    Revisione <span className="text-[var(--milano-bronzo)]">Incarico</span>
                                                </h3>
                                            </div>

                                            <div className="p-8 border border-[var(--milano-bronzo)]/20 bg-black/[0.01] rounded-sm space-y-8">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-mono text-[var(--milano-bronzo)] uppercase tracking-widest font-bold">Identità</p>
                                                        <p className="text-[13px] font-accent text-black uppercase truncate">{formData.name}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-mono text-[var(--milano-bronzo)] uppercase tracking-widest font-bold">Piano</p>
                                                        <p className="text-[13px] font-accent text-black uppercase">{formData.tier}</p>
                                                    </div>
                                                    <div className="space-y-1 md:col-span-2">
                                                        <p className="text-[8px] font-mono text-[var(--milano-bronzo)] uppercase tracking-widest font-bold">Attivazione</p>
                                                        <p className="text-[13px] font-accent text-black uppercase">{formData.date} — {formData.time}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center gap-8 pt-4">
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="checkbox" checked={termsAccepted} onChange={(e) => onToggleTerms(e.target.checked)} className="hidden" />
                                                    <div className={`w-5 h-5 border flex items-center justify-center transition-all ${termsAccepted ? 'bg-black border-black shadow-lg' : 'border-black/20 group-hover:border-black/40'}`}>
                                                        {termsAccepted && <Check className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="text-[9px] font-mono text-black/30 uppercase tracking-[0.2em] group-hover:text-black transition-colors">Accetto il Protocollo Legale</span>
                                                </label>

                                                <button
                                                    onClick={onSubmit}
                                                    disabled={!termsAccepted || isLoading}
                                                    className="btn-monumental scale-95 w-full md:w-auto px-16 py-5 shadow-2xl active:scale-[0.98]"
                                                >
                                                    {isLoading ? 'INVIO...' : 'INVIA RICHIESTA FIDUCIARIA'}
                                                </button>
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
