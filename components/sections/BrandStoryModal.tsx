import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { BRAND_STORY } from '../../legalContent';

interface BrandStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BrandStoryModal: React.FC<BrandStoryModalProps> = ({ isOpen, onClose }) => {
    // Imperial Scroll Lock
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-pointer"
                onClick={onClose}
            />

            {/* CLOSE BUTTON */}
            <button
                onClick={onClose}
                className="fixed top-8 right-8 z-[600] flex items-center gap-4 group bg-[var(--milano-bronzo)] md:bg-transparent p-3 md:p-0 rounded-full md:rounded-none transition-all duration-500 hover:scale-110 active:scale-95"
                title="Chiudi"
            >
                <span className="hidden md:block text-[10px] uppercase font-mono tracking-[0.5em] text-[var(--milano-bronzo)] group-hover:text-white transition-colors">
                    Chiudi
                </span>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-black md:border-[var(--milano-bronzo)] rounded-full text-black md:text-[var(--milano-bronzo)] group-hover:bg-[var(--milano-bronzo)] group-hover:text-black transition-all">
                    <X className="w-6 h-6" strokeWidth={1.5} />
                </div>
            </button>

            {/* MODAL CONTAINER */}
            <div className="relative w-full h-[100dvh] md:h-auto md:max-w-5xl md:max-h-[90vh] md:luxury-monolith overflow-y-auto bg-black md:bg-black/80 shadow-2xl animate-reveal custom-scrollbar">

                {/* EDITORIAL LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[100dvh] md:min-h-0">

                    {/* PORTRAIT - LEFT */}
                    <div className="relative overflow-hidden aspect-[3/4] lg:aspect-auto lg:h-full order-2 lg:order-1">
                        <img
                            src="/assets/founder_michael_jara.jpg"
                            alt="Michael Jara"
                            className="w-full h-full object-cover grayscale brightness-90 transition-all duration-[3000ms]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 lg:opacity-60"></div>

                        {/* QUOTE - MOBILE ONLY */}
                        <div className="absolute inset-x-0 bottom-0 p-8 lg:hidden">
                            <blockquote className="text-white font-display text-lg italic leading-tight text-center">
                                "{BRAND_STORY.quote}"
                            </blockquote>
                        </div>
                    </div>

                    {/* TEXT - RIGHT */}
                    <div className="p-8 md:p-12 lg:p-14 flex flex-col order-1 lg:order-2 pt-24 lg:pt-14">

                        {/* HEADER */}
                        <div className="space-y-3 mb-10">
                            <h2 className="text-4xl md:text-5xl font-accent text-white uppercase tracking-tighter leading-[0.9]">
                                Michael<br /><span className="text-[var(--milano-bronzo)]">Jara.</span>
                            </h2>
                            <p className="text-[var(--milano-bronzo)] font-mono text-[9px] uppercase tracking-[0.5em]">
                                {BRAND_STORY.subtitle}
                            </p>
                        </div>

                        {/* BODY */}
                        <div className="space-y-5 mb-10 border-l border-[var(--milano-bronzo)]/20 pl-6">
                            {BRAND_STORY.content.map((p, i) => (
                                <p key={i} className="text-white/80 text-sm md:text-base font-display italic leading-relaxed">
                                    {p}
                                </p>
                            ))}
                        </div>

                        {/* QUOTE - DESKTOP */}
                        <div className="hidden lg:block mb-10 border-t border-white/5 pt-6">
                            <blockquote className="text-white/50 font-display text-lg italic">
                                "{BRAND_STORY.quote}"
                            </blockquote>
                        </div>

                        {/* LEGAL SHIELD - TWO COLUMNS */}
                        <div className="mt-auto pt-8 border-t border-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                {/* LEFT: RESPONSABILITÀ */}
                                <div className="space-y-2">
                                    <p className="text-[8px] font-mono text-[var(--milano-bronzo)]/50 uppercase tracking-[0.2em]">
                                        {BRAND_STORY.legalDisclaimer?.title}
                                    </p>
                                    <p className="text-[8px] text-white/20 font-sans leading-relaxed">
                                        {BRAND_STORY.legalDisclaimer?.content}
                                    </p>
                                </div>

                                {/* RIGHT: PRIVACY & NDA */}
                                <div className="space-y-2">
                                    <p className="text-[8px] font-mono text-[var(--milano-bronzo)]/50 uppercase tracking-[0.2em]">
                                        {BRAND_STORY.privacyNda?.title}
                                    </p>
                                    <p className="text-[8px] text-white/20 font-sans leading-relaxed">
                                        {BRAND_STORY.privacyNda?.content}
                                    </p>
                                </div>
                            </div>

                            {/* FOUNDER SEAL */}
                            <div className="pt-4 border-t border-white/5 text-[8px] font-mono text-white/15 uppercase tracking-widest text-center space-y-0.5">
                                <p>{BRAND_STORY.founderInfo?.fullName}</p>
                                <p>{BRAND_STORY.founderInfo?.piva} • {BRAND_STORY.founderInfo?.address}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandStoryModal;
