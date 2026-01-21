import React from 'react';
import { Crown, X } from 'lucide-react';

interface VisionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VisionModal: React.FC<VisionModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[var(--perla-dorata)]/95 backdrop-blur-3xl" onClick={onClose} />
            <div className="relative w-full max-w-4xl luxury-monolith p-12 md:p-20 animate-reveal border-[var(--oro-lucido)]/10 shadow-3xl bg-white/95 rounded-sm">
                <button onClick={onClose} className="absolute top-8 right-8 text-[var(--oro-lucido)]/40 hover:text-[var(--oro-lucido)] transition-colors">
                    <X className="w-5 h-5" />
                </button>
                <div className="space-y-12">
                    <div className="space-y-4">
                        <span className="text-[var(--oro-lucido)]/40 font-accent text-[9px] uppercase tracking-[1em]">Our Vision</span>
                        <h2 className="text-5xl md:text-7xl font-display text-gold italic">L'Eccellenza Silenziosa.</h2>
                    </div>
                    <div className="space-y-8 font-sans text-lg text-[var(--bronzo-profondo)]/80 leading-relaxed max-w-2xl">
                        <p>Non costruiamo semplici spostamenti. Progettiamo momenti di assoluta sospensione dal mondo, dove il comfort diventa un'ombra invisibile che ti segue con precisione millimetrica.</p>
                        <p>La nostra visione a Milano è ridefinire il concetto di assistenza personale: non più un servizio, ma un'architettura del tempo dedicata a proteggere il tuo prestigio e la tua pace.</p>
                    </div>
                    <div className="pt-8 border-t border-[var(--oro-lucido)]/10">
                        <div className="flex items-center gap-4 text-[var(--oro-lucido)]">
                            <Crown className="w-4 h-4" />
                            <span className="text-[10px] font-accent uppercase tracking-[0.6em]">Reserved for Excellence</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisionModal;
