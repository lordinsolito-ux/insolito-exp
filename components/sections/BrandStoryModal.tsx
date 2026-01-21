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

            {/* MODAL CONTAINER - RESTORED TO 5XL ELEGANCE */}
            <div className="relative w-full h-[100dvh] md:h-auto md:max-w-5xl md:luxury-monolith overflow-y-auto md:overflow-visible bg-black md:bg-black/60 shadow-2xl animate-reveal custom-scrollbar">

                <div className="p-8 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start md:items-center">

                    {/* VISION TEXT */}
                    <div className="space-y-12 md:space-y-20 pt-20 md:pt-0">
                        <div className="space-y-6 md:space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-px bg-[var(--milano-bronzo)]/40"></div>
                                <span className="text-[var(--milano-bronzo)] font-mono text-[9px] md:text-[10px] uppercase tracking-[1em]">Fondatore & Visionario</span>
                            </div>
                            <h2 className="text-5xl md:text-8xl font-accent text-white uppercase tracking-tighter leading-tight drop-shadow-2xl">
                                Michael <br /><span className="text-[var(--milano-bronzo)]">Jara</span>
                            </h2>
                            <p className="text-white/20 font-mono text-[10px] leading-relaxed tracking-[1em] uppercase">Insolito Privé</p>
                        </div>

                        <div className="space-y-8 md:space-y-10 border-l border-[var(--milano-bronzo)]/20 pl-8 md:pl-12">
                            {BRAND_STORY.content.map((p, i) => (
                                <p
                                    key={i}
                                    className="text-white/80 text-lg md:text-2xl font-display italic leading-relaxed tracking-wide"
                                >
                                    {p}
                                </p>
                            ))}
                        </div>

                        <div className="pt-8">
                            <div className="flex items-center gap-8 md:gap-12 opacity-40">
                                <div className="h-[0.5px] w-24 bg-[var(--milano-bronzo)]"></div>
                                <span className="text-[9px] font-mono uppercase tracking-[1em]">Secret Archive</span>
                            </div>
                        </div>
                    </div>

                    {/* PORTRAIT */}
                    <div className="relative group overflow-hidden rounded-sm border border-white/5 aspect-[4/5] md:aspect-[3/4] shadow-2xl self-start lg:self-center">
                        <img
                            src="/assets/founder_michael_jara.jpg"
                            alt="Michael Jara"
                            className="w-full h-full object-cover grayscale brightness-75 md:brightness-100 md:group-hover:grayscale-0 transition-all duration-[3000ms]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                        <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 text-center bg-black/60 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none transition-all duration-700">
                            <blockquote className="text-white font-display text-lg md:text-2xl italic leading-tight tracking-wide">
                                "{BRAND_STORY.quote}"
                            </blockquote>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BrandStoryModal;
