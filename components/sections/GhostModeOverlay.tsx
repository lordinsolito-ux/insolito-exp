import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GhostModeOverlayProps {
    onDismiss: () => void;
}

const GhostModeOverlay: React.FC<GhostModeOverlayProps> = ({ onDismiss }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-8 md:bottom-12 right-6 md:right-12 z-[100]"
            >
                <div className="luxury-monolith p-8 md:p-10 border-[var(--milano-bronzo)]/30 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] bg-black/95 rounded-sm max-w-[320px] md:max-w-md relative overflow-hidden group">
                    {/* Animated Scanning Line (Viral Detail) */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--milano-bronzo)]/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[3000ms] ease-in-out"></div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--milano-bronzo)] animate-pulse"></div>
                        <span className="text-[8px] font-mono text-[var(--milano-bronzo)] tracking-[0.4em] uppercase">Ghost Protocol Active</span>
                    </div>

                    <p className="text-[13px] md:text-[15px] font-display text-white leading-relaxed italic mb-8">
                        "Il silenzio è l'unico lusso che nessuno può rubarti.<br />
                        <span className="text-white/40">Stai cercando qualcosa... o vuoi semplicemente sparire con noi?"</span>
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center pt-6 border-t border-white/5">
                        <button
                            onClick={onDismiss}
                            className="text-[9px] font-accent text-white/30 hover:text-white tracking-[0.3em] uppercase transition-all duration-500 hover:translate-x-1"
                        >
                            Continua a Navigare
                        </button>
                        <a
                            href="https://wa.me/393393522164?text=Protocollo%20Ghost.%20Desidero%20sparire."
                            className="text-[9px] font-accent text-[var(--milano-bronzo)] hover:text-white tracking-[0.3em] uppercase transition-all duration-500 flex items-center gap-2 group/link"
                        >
                            Parliamo in Privato
                            <span className="w-4 h-[1px] bg-[var(--milano-bronzo)] group-hover/link:w-8 transition-all duration-500"></span>
                        </a>
                    </div>

                    {/* Subtle numbering for archive feel */}
                    <span className="absolute bottom-4 right-4 text-[7px] font-mono text-white/5 uppercase tracking-widest">A-24. Ghost.v2</span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GhostModeOverlay;
