import React from 'react';

interface GhostModeOverlayProps {
    onDismiss: () => void;
}

const GhostModeOverlay: React.FC<GhostModeOverlayProps> = ({ onDismiss }) => {
    return (
        <div className="fixed bottom-12 right-12 z-[100] animate-reveal">
            <div className="luxury-monolith p-8 border-[var(--milano-bronzo)]/20 shadow-2xl bg-black/90 rounded-sm">
                <p className="text-[10px] font-mono text-white/60 tracking-[0.5em] uppercase mb-6 italic">
                    "Stai cercando qualcosa?<br />O stai solo... scomparendo un attimo?"
                </p>
                <div className="flex gap-4">
                    <button onClick={onDismiss} className="text-[8px] font-accent text-white/40 hover:text-white tracking-widest uppercase border-b border-white/10 pb-1">Continua a Navigare</button>
                    <a href="https://wa.me/393393522164?text=Ciao%20Michael,%20stavo%20navigando%20e%20ho%20trovato%20il%20Ghost%20Mode.%20Voglio%20saperne%20di%20più%20su%20INSOLITO." className="text-[8px] font-accent text-[var(--milano-bronzo)] hover:text-white tracking-widest uppercase border-b border-[var(--milano-bronzo)]/10 pb-1">Parliamo in Privato</a>
                </div>
            </div>
        </div>
    );
};

export default GhostModeOverlay;
