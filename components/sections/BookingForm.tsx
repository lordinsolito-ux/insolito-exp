import React, { forwardRef } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { StepIndicator } from '../StepIndicator';
import { SERVICE_TYPES, COUNTRY_CODES } from '../../constants';
import { BookingFormData, ValidationErrors } from '../../types';

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
    onSubmit,
    isNightService
}, ref) => {
    if (activeStep <= 1) return null;

    return (
        <div className={`transition-all duration-1000 pb-24 opacity-100 translate-y-0`}>
            <div className="max-w-4xl mx-auto px-6">
                <div ref={ref} className="luxury-monolith rounded-sm overflow-hidden border border-white/10 shadow-3xl bg-black/80 backdrop-blur-xl">
                    <StepIndicator currentStep={activeStep} />
                    <div className="p-12 md:p-20">
                        {activeStep === 2 && (
                            <div className="animate-reveal space-y-16">
                                <div className="space-y-6">
                                    <h3 className="text-5xl md:text-6xl font-display text-white tracking-widest italic">{t('booking.details')}</h3>
                                    <div className="gold-line"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <h4 className="text-[9px] font-accent text-[var(--milano-bronzo)]/40 uppercase tracking-[1em] mb-4">Itinerary</h4>
                                        <div className="space-y-4">
                                            <input type="text" value={formData.pickupLocation} onChange={(e) => onLocationSearch('pickup', e.target.value)} onBlur={onInputBlur} placeholder={t('booking.pickup')} className="w-full px-8 py-5 elite-input text-[11px] tracking-widest uppercase" />
                                            {validationErrors.pickupLocation && <p className="text-red-500 text-[10px] mt-1">{validationErrors.pickupLocation}</p>}
                                            <input type="text" value={formData.destination} onChange={(e) => onLocationSearch('destination', e.target.value)} onBlur={onInputBlur} placeholder={t('booking.destination')} className="w-full px-8 py-5 elite-input text-[11px] tracking-widest uppercase" />
                                            {validationErrors.destination && <p className="text-red-500 text-[10px] mt-1">{validationErrors.destination}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <h4 className="text-[9px] font-accent text-[var(--milano-bronzo)]/40 uppercase tracking-[1em] mb-4">Reserved Schedule</h4>
                                        <div className="space-y-4">
                                            <input type="date" name="date" value={formData.date} onChange={onInputChange} min={new Date().toISOString().split('T')[0]} className="w-full px-8 py-5 elite-input text-[11px] tracking-widest" style={{ colorScheme: 'dark' }} />
                                            {validationErrors.date && <p className="text-red-500 text-[10px] mt-1">{validationErrors.date}</p>}
                                            <select name="time" value={formData.time} onChange={onInputChange} disabled={!formData.date} className="w-full px-8 py-5 elite-input text-[11px] tracking-widest uppercase appearance-none bg-black/20 text-white">
                                                <option value="" className="bg-black">{t('booking.time')}</option>
                                                {availableSlots.map(s => <option key={s} value={s} className="bg-black">{s} {isNightService(s) ? '(Night)' : ''}</option>)}
                                            </select>
                                            {validationErrors.time && <p className="text-red-500 text-[10px] mt-1">{validationErrors.time}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeStep === 3 && (
                            <div className="animate-reveal space-y-16">
                                <div className="space-y-6">
                                    <h3 className="text-5xl md:text-6xl font-display text-white tracking-widest italic">{t('booking.guest_info')}</h3>
                                    <div className="gold-line"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <input type="text" name="name" value={formData.name} onChange={onInputChange} placeholder={t('booking.name')} className="w-full px-8 py-5 elite-input text-[11px] tracking-widest uppercase" />
                                        {validationErrors.name && <p className="text-red-500 text-[10px] mt-1">{validationErrors.name}</p>}
                                        <input type="email" name="email" value={formData.email} onChange={onInputChange} placeholder={t('booking.email')} className="w-full px-8 py-5 elite-input text-[11px] tracking-widest" />
                                        {validationErrors.email && <p className="text-red-500 text-[10px] mt-1">{validationErrors.email}</p>}
                                        <div className="flex gap-4">
                                            <select name="countryCode" value={formData.countryCode} onChange={onInputChange} className="w-32 px-4 py-5 elite-input text-[11px] bg-black/20 text-white">
                                                {COUNTRY_CODES.map(c => <option key={c.code} value={c.code} className="bg-black">{c.code}</option>)}
                                            </select>
                                            <input type="tel" name="phone" value={formData.phone} onChange={onInputChange} placeholder={t('booking.phone')} className="flex-1 px-8 py-5 elite-input text-[11px] tracking-widest" />
                                            {validationErrors.phone && <p className="text-red-500 text-[10px] mt-1">{validationErrors.phone}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <h4 className="text-[9px] font-accent text-[var(--milano-bronzo)]/40 uppercase tracking-[1em] mb-4">Reserved Settlement</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['cash', 'pos'].map(m => (
                                                <button key={m} onClick={() => onPaymentMethodChange(m as any)} className={`py-5 border text-[9px] uppercase tracking-[0.4em] transition-all ${formData.paymentMethod === m ? 'border-[var(--milano-bronzo)] text-[var(--milano-bronzo)] bg-[var(--milano-bronzo)]/5 font-bold' : 'border-white/10 text-white/40 hover:border-white/30'}`}>
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
                                    <Star className="w-12 h-12 text-[var(--milano-bronzo)]/30 mx-auto" strokeWidth={0.5} />
                                    <h3 className="text-5xl font-display text-white uppercase tracking-[0.3em] italic">{t('booking.step4_title')}</h3>
                                </div>
                                <div className="max-w-xl mx-auto space-y-10 py-10 border-y border-[var(--milano-bronzo)]/10 font-display">
                                    <div className="flex justify-between items-center text-[var(--milano-bronzo)]/60 uppercase tracking-widest text-[10px]">
                                        <span>Guest Member</span>
                                        <span className="text-white text-xl font-accent">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[var(--milano-bronzo)]/60 uppercase tracking-widest text-[10px]">
                                        <span>Reserved Experience</span>
                                        <span className="text-white text-xl tracking-widest uppercase font-accent">{SERVICE_TYPES.find(s => s.id === formData.serviceType)?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-8">
                                        <span className="text-[var(--milano-bronzo)]/30 text-[10px] uppercase tracking-[1em]">Estimated Excellence</span>
                                        <span className="text-7xl text-gold">€{formData.estimatedPrice}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-6">
                                    <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => onToggleTerms(e.target.checked)} className="w-4 h-4 rounded-none border-[var(--milano-bronzo)]/20 bg-transparent text-[var(--milano-bronzo)] focus:ring-0" />
                                    <label htmlFor="terms" className="text-[10px] text-white/40 font-accent tracking-widest uppercase">
                                        {t('booking.terms_agree')} <button onClick={onShowTerms} className="text-[var(--milano-bronzo)] hover:underline transition-colors">{t('booking.terms_link')}</button>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ACTION BAR */}
                    <div className="p-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-black/40">
                        <button
                            onClick={onPrevStep}
                            className={`text-[9px] uppercase tracking-[0.5em] text-white/40 hover:text-white transition-all ${activeStep > 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                            Indietro
                        </button>
                        <div className="flex gap-4">
                            {activeStep < 4 ? (
                                <button onClick={onNextStep} className="btn-monumental">Prosegui</button>
                            ) : (
                                <button onClick={onSubmit} disabled={isLoading || !termsAccepted} className="btn-monumental disabled:opacity-20">
                                    {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Richiedi Accesso Privé"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

BookingForm.displayName = 'BookingForm';

export default BookingForm;
