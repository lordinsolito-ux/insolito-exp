import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Shield, Eye } from 'lucide-react';

interface VisionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VisionModal: React.FC<VisionModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6"
                >
                    {/* Dark backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
                        onClick={onClose}
                    />

                    {/* Main content container */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-4xl bg-[#0a0a0a] border border-[var(--milano-bronzo)]/20 p-8 md:p-16 lg:p-20 shadow-[0_0_100px_rgba(139,115,85,0.1)] overflow-hidden"
                    >
                        {/* Noise texture overlay */}
                        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

                        {/* Subtle gold glow at top */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-[var(--milano-bronzo)]/50 to-transparent"></div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 md:top-8 md:right-8 text-white/20 hover:text-[var(--milano-bronzo)] transition-all duration-500 group"
                        >
                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" strokeWidth={1} />
                        </button>

                        {/* Content */}
                        <div className="relative z-10 space-y-10 md:space-y-14">
                            {/* Header */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Eye className="w-4 h-4 text-[var(--milano-bronzo)]/60" strokeWidth={1} />
                                    <span className="text-[var(--milano-bronzo)]/60 font-mono text-[9px] uppercase tracking-[0.5em]">La Nostra Visione</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl lg:text-7xl font-display text-[var(--milano-bronzo)] italic leading-[0.9] tracking-tight">
                                    L'Eccellenza<br />
                                    <span className="text-white/90">Silenziosa.</span>
                                </h2>
                            </div>

                            {/* Body text */}
                            <div className="space-y-6 max-w-2xl">
                                <p className="text-white/50 text-sm md:text-base leading-relaxed font-light">
                                    Non costruiamo semplici spostamenti. Progettiamo momenti di assoluta sospensione dal mondo,
                                    dove il comfort diventa un'ombra invisibile che ti segue con <span className="text-white/80 font-medium">precisione millimetrica</span>.
                                </p>
                                <p className="text-white/50 text-sm md:text-base leading-relaxed font-light">
                                    La nostra visione a Milano è ridefinire il concetto di assistenza personale:
                                    non più un servizio, ma <span className="text-[var(--milano-bronzo)]">un'architettura del tempo</span> dedicata
                                    a proteggere il tuo prestigio e la tua pace.
                                </p>
                            </div>

                            {/* Quote section */}
                            <div className="border-l-2 border-[var(--milano-bronzo)]/30 pl-6 py-2">
                                <p className="text-white/30 text-xs md:text-sm italic font-light leading-relaxed">
                                    "Il vero lusso non è farsi notare, ma avere la certezza che ogni variabile
                                    sia già stata prevista e gestita."
                                </p>
                                <p className="text-[var(--milano-bronzo)]/60 text-[10px] uppercase tracking-[0.3em] mt-3 font-mono">
                                    — Michael Jara, Founder
                                </p>
                            </div>

                            {/* Footer with seal */}
                            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-4 text-[var(--milano-bronzo)]">
                                    <Crown className="w-4 h-4" strokeWidth={1} />
                                    <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Reserved for Excellence</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Shield className="w-3 h-3 text-white/20" strokeWidth={1} />
                                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">Milano · Bergamo · Lecco</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VisionModal;

