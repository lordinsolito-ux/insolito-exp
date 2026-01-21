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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={onClose} />
            <div className="relative w-full max-w-6xl luxury-monolith p-12 md:p-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center animate-reveal border border-white/10 shadow-3xl bg-black rounded-sm">
                <button onClick={onClose} className="absolute top-8 right-8 text-[var(--milano-bronzo)] hover:text-white transition-colors z-50 flex items-center gap-2 group">
                    <span className="text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-mono">Chiudi</span>
                    <X className="w-8 h-8" />
                </button>
                <div className="space-y-16">
                    <div className="space-y-8">
                        <span className="text-[var(--milano-bronzo)] font-accent text-[10px] uppercase tracking-[1.2em] mb-4 block">Founder & Visionary</span>
                        <h2 className="text-6xl md:text-8xl font-display text-white italic leading-tight">Michael Jara</h2>
                        <p className="text-white/40 font-accent text-[11px] leading-relaxed tracking-[1.5em] uppercase pl-1">INSOLITO PRIVÉ</p>
                    </div>
                    <div className="space-y-8 border-l border-[var(--milano-bronzo)]/20 pl-8 md:pl-12">
                        {BRAND_STORY.content.map((p, i) => (
                            <p key={i} className="text-white/90 text-lg md:text-xl font-display italic leading-relaxed tracking-wide first-letter:text-3xl first-letter:text-[var(--milano-bronzo)] first-letter:font-normal">{p}</p>
                        ))}
                    </div>
                    <div className="pt-12">
                        <div className="flex items-center gap-12">
                            <div className="h-[0.5px] w-24 bg-[var(--milano-bronzo)]"></div>
                            <span className="text-[10px] text-[var(--milano-bronzo)] font-accent uppercase tracking-[1em]">L'Eccellenza della Riservatezza</span>
                        </div>
                    </div>
                </div>
                <div className="relative group hidden lg:block overflow-hidden rounded-sm border border-white/10 aspect-[3/4]">
                    <img src="/assets/founder_michael_jara.jpg" alt="Michael Jara" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms]" />
                    <div className="absolute inset-x-0 bottom-0 p-12 text-center bg-gradient-to-t from-black via-black/80 to-transparent">
                        <blockquote className="text-white font-display text-2xl italic leading-tight tracking-wide opacity-90">"{BRAND_STORY.quote}"</blockquote>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandStoryModal;
