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
            {/* Backdrop with extreme blur and dark tint */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-pointer"
                onClick={onClose}
            />

            {/* THE GUARANTEED CLOSE BUTTON - ALWAYS VISIBLE, ALWAYS ON TOP */}
            <button
                onClick={onClose}
                className="fixed top-8 right-8 z-[600] flex items-center gap-4 group bg-[var(--milano-bronzo)] md:bg-transparent p-3 md:p-0 rounded-full md:rounded-none transition-all duration-500 hover:scale-110 active:scale-95"
                title="Chiudi / Close"
            >
                <span className="hidden md:block text-[10px] uppercase font-mono tracking-[0.5em] text-[var(--milano-bronzo)] group-hover:text-white transition-colors">
                    Chiudi
                </span>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-black md:border-[var(--milano-bronzo)] rounded-full text-black md:text-[var(--milano-bronzo)] group-hover:bg-[var(--milano-bronzo)] group-hover:text-black transition-all">
                    <X className="w-6 h-6" strokeWidth={1.5} />
                </div>
            </button>

            {/* MODAL CONTAINER - EDITORIAL INTERVIEW STYLE */}
            <div className="relative w-full h-[100dvh] md:h-auto md:max-w-5xl md:luxury-monolith overflow-y-auto md:overflow-visible bg-black md:bg-black/80 shadow-2xl animate-reveal custom-scrollbar">

                {/* EDITORIAL LAYOUT: PHOTO LEFT, TEXT RIGHT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[100dvh] md:min-h-0">

                    {/* PORTRAIT - FULL HEIGHT LEFT */}
                    <div className="relative overflow-hidden aspect-[3/4] lg:aspect-auto lg:h-full order-2 lg:order-1">
                        <img
                            src="/assets/founder_michael_jara.jpg"
                            alt="Michael Jara"
                            className="w-full h-full object-cover grayscale brightness-90 md:brightness-100 transition-all duration-[3000ms]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 lg:opacity-60"></div>

                        {/* QUOTE OVERLAY ON IMAGE */}
                        <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 lg:hidden">
                            <blockquote className="text-white font-display text-lg italic leading-tight tracking-wide text-center">
                                "{BRAND_STORY.quote}"
                            </blockquote>
                        </div>
                    </div>

                    {/* TEXT CONTENT - RIGHT SIDE */}
                    <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center order-1 lg:order-2 pt-24 lg:pt-16">

                        {/* HEADER */}
                        <div className="space-y-4 mb-12">
                            <h2 className="text-4xl md:text-6xl font-accent text-white uppercase tracking-tighter leading-[0.9]">
                                Michael<br /><span className="text-[var(--milano-bronzo)]">Jara.</span>
                            </h2>
                            <p className="text-[var(--milano-bronzo)] font-mono text-[10px] uppercase tracking-[0.5em]">
                                {BRAND_STORY.subtitle}
                            </p>
                        </div>

                        {/* BODY TEXT */}
                        <div className="space-y-6 mb-12 border-l border-[var(--milano-bronzo)]/20 pl-6 md:pl-8">
                            {BRAND_STORY.content.map((p, i) => (
                                <p
                                    key={i}
                                    className="text-white/80 text-base md:text-lg font-display italic leading-relaxed tracking-wide"
                                >
                                    {p}
                                </p>
                            ))}
                        </div>

                        {/* QUOTE - DESKTOP ONLY */}
                        <div className="hidden lg:block mb-12 border-t border-white/5 pt-8">
                            <blockquote className="text-white/60 font-display text-xl italic leading-relaxed tracking-wide">
                                "{BRAND_STORY.quote}"
                            </blockquote>
                        </div>

                        {/* LEGAL DISCLAIMER */}
                        <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
                            <p className="text-[10px] font-mono text-[var(--milano-bronzo)]/60 uppercase tracking-[0.3em]">
                                {BRAND_STORY.legalDisclaimer?.title}
                            </p>
                            <p className="text-[9px] text-white/30 font-sans leading-relaxed">
                                {BRAND_STORY.legalDisclaimer?.content}
                            </p>

                            {/* FOUNDER FISCAL DATA */}
                            <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-white/20 uppercase tracking-widest space-y-1">
                                <p>{BRAND_STORY.founderInfo?.fullName}</p>
                                <p>{BRAND_STORY.founderInfo?.piva}</p>
                                <p>{BRAND_STORY.founderInfo?.address}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandStoryModal;
