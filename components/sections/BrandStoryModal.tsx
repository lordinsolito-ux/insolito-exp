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
            <div className="absolute inset-0 bg-[var(--perla-dorata)]/95 backdrop-blur-3xl" onClick={onClose} />
            <div className="relative w-full max-w-6xl luxury-monolith p-12 md:p-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center animate-reveal border-[var(--oro-lucido)]/10 shadow-3xl bg-white/95 rounded-sm">
                <button onClick={onClose} className="absolute top-10 right-10 text-[var(--oro-lucido)]/40 hover:text-[var(--oro-lucido)] transition-colors">
                    <X className="w-6 h-6" />
                </button>
                <div className="space-y-16">
                    <div className="space-y-8">
                        <span className="text-[var(--oro-lucido)]/40 font-accent text-[10px] uppercase tracking-[1.2em] mb-4 block">Founder & Visionary</span>
                        <h2 className="text-6xl md:text-8xl font-display text-gold italic leading-tight">Michael Jara</h2>
                        <p className="text-[var(--oro-lucido)] font-accent text-[11px] leading-relaxed tracking-[1.5em] uppercase pl-1">INSOLITO PRIVÉ</p>
                    </div>
                    <div className="space-y-10 border-l border-[var(--oro-lucido)]/10 pl-12">
                        {BRAND_STORY.content.map((p, i) => (
                            <p key={i} className="text-[var(--bronzo-profondo)] text-[15px] md:text-base font-light font-display italic leading-relaxed tracking-widest">{p}</p>
                        ))}
                    </div>
                    <div className="pt-12">
                        <div className="flex items-center gap-12">
                            <div className="h-[0.5px] w-24 bg-[var(--oro-lucido)]/20"></div>
                            <span className="text-[10px] text-[var(--oro-lucido)]/40 font-accent uppercase tracking-[1em]">L'Eccellenza della Riservatezza</span>
                        </div>
                    </div>
                </div>
                <div className="relative group hidden lg:block overflow-hidden rounded-sm border border-[var(--oro-lucido)]/10">
                    <img src="/assets/founder_michael_jara.jpg" alt="Michael Jara" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8000ms]" />
                    <div className="absolute inset-x-0 bottom-16 px-16 text-center">
                        <blockquote className="text-[var(--bronzo-profondo)] font-display text-3xl italic leading-tight tracking-wide opacity-90">"{BRAND_STORY.quote}"</blockquote>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandStoryModal;
