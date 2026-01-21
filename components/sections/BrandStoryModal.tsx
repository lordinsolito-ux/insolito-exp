import React from 'react';
import { X } from 'lucide-react';
import { BRAND_STORY } from '../../legalContent';

interface BrandStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BrandStoryModal: React.FC<BrandStoryModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={onClose} />

            {/* MOBILE CLOSE BUTTON - FIXED TOP RIGHT */}
            <button
                onClick={onClose}
                className="fixed top-6 right-6 z-[300] bg-[var(--milano-bronzo)] text-black p-3 rounded-full md:hidden shadow-lg active:scale-90 transition-transform"
                aria-label="Close"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="relative w-full h-[100dvh] md:h-auto md:max-w-6xl md:luxury-monolith overflow-y-auto md:overflow-visible bg-black md:bg-black/40 animate-reveal">

                {/* DESKTOP CLOSE BUTTON */}
                <button onClick={onClose} className="absolute top-8 right-8 text-[var(--milano-bronzo)] hover:text-white transition-colors z-50 hidden md:flex items-center gap-2 group">
                    <span className="text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-mono">Chiudi</span>
                    <X className="w-8 h-8" />
                </button>

                <div className="p-8 md:p-24 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div className="space-y-12 md:space-y-16">
                        <div className="space-y-6 md:space-y-8">
                            <span className="text-[var(--milano-bronzo)] font-accent text-[9px] md:text-[10px] uppercase tracking-[1em] mb-4 block">Founder & Visionary</span>
                            <h2 className="text-5xl md:text-8xl font-display text-white italic leading-tight">Michael Jara</h2>
                            <p className="text-white/40 font-accent text-[10px] leading-relaxed tracking-[1.2em] uppercase">INSOLITO PRIVÉ</p>
                        </div>
                        <div className="space-y-6 md:space-y-8 border-l border-[var(--milano-bronzo)]/20 pl-6 md:pl-12">
                            {BRAND_STORY.content.map((p, i) => (
                                <p key={i} className="text-white/90 text-base md:text-xl font-display italic leading-relaxed tracking-wide first-letter:text-2xl first-letter:text-[var(--milano-bronzo)] first-letter:font-normal">{p}</p>
                            ))}
                        </div>
                        <div className="pt-6 md:pt-12">
                            <div className="flex items-center gap-8 md:gap-12">
                                <div className="h-[0.5px] w-12 md:w-24 bg-[var(--milano-bronzo)]"></div>
                                <span className="text-[9px] md:text-[10px] text-[var(--milano-bronzo)] font-accent uppercase tracking-[0.8em]">L'Eccellenza della Riservatezza</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative group overflow-hidden rounded-sm border border-white/10 aspect-[3/4] md:aspect-[3/4] mb-12 lg:mb-0">
                        <img src="/assets/founder_michael_jara.jpg" alt="Michael Jara" className="w-full h-full object-cover grayscale md:group-hover:grayscale-0 transition-all duration-[2000ms]" />
                        <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 text-center bg-gradient-to-t from-black via-black/80 to-transparent">
                            <blockquote className="text-white font-display text-lg md:text-2xl italic leading-tight tracking-wide opacity-90">"{BRAND_STORY.quote}"</blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandStoryModal;
