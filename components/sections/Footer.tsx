import React from 'react';
import { Crown, Instagram, MessageCircle, Mail } from 'lucide-react';
import { BUSINESS_INFO, LEGAL_CONTENT } from '../../legalContent';

interface FooterProps {
    onBrandStoryClick: () => void;
    onVisionClick: () => void;
    onLegalClick: (title: string, content: string) => void;
    onHistoryClick: () => void;
    onAdminLoginClick: () => void;
}

const Footer: React.FC<FooterProps> = ({
    onBrandStoryClick,
    onVisionClick,
    onLegalClick,
    onHistoryClick,
    onAdminLoginClick
}) => {
    return (
        <footer className="relative py-12 px-12 md:px-24 bg-transparent border-t border-[var(--milano-bronzo)]/10 overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-[0.05]"></div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Crown className="w-5 h-5 text-gold" strokeWidth={1} />
                        <span className="text-lg font-display text-white tracking-[0.2em]">INSOLITO</span>
                    </div>
                    <p className="text-white/40 text-[10px] leading-relaxed tracking-widest uppercase font-accent">
                        Architettura del Tempo & Discrezione Assoluta. Milano.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-[var(--milano-bronzo)]/40 hover:text-gold transition-colors"><Instagram className="w-4 h-4" strokeWidth={1} /></a>
                        <a href="#" className="text-[var(--milano-bronzo)]/40 hover:text-gold transition-colors"><MessageCircle className="w-4 h-4" strokeWidth={1} /></a>
                        <a href="#" className="text-[var(--milano-bronzo)]/40 hover:text-gold transition-colors"><Mail className="w-4 h-4" strokeWidth={1} /></a>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[9px] font-accent text-gold tracking-[0.8em] uppercase opacity-60">Maison</h4>
                    <div className="flex flex-col gap-3">
                        <button onClick={onBrandStoryClick} className="text-[10px] text-white/40 hover:text-[var(--milano-bronzo)] tracking-widest uppercase transition-colors text-left">Our Story</button>
                        <button onClick={onVisionClick} className="text-[10px] text-white/40 hover:text-[var(--milano-bronzo)] tracking-widest uppercase transition-colors text-left">The Vision</button>
                        <button onClick={() => onLegalClick(LEGAL_CONTENT.privacy.title, LEGAL_CONTENT.privacy.content)} className="text-[10px] text-white/40 hover:text-[var(--milano-bronzo)] tracking-widest uppercase transition-colors text-left">Privacy</button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[9px] font-accent text-gold tracking-[0.8em] uppercase opacity-60">Concierge</h4>
                    <div className="flex flex-col gap-3">
                        <a href={`tel:${BUSINESS_INFO.phone}`} className="text-[10px] text-white/40 hover:text-[var(--milano-bronzo)] tracking-widest uppercase transition-colors text-left">Direct Line</a>
                        <a href={`https://wa.me/${BUSINESS_INFO.whatsapp}`} className="text-[10px] text-white/40 hover:text-[var(--milano-bronzo)] tracking-widest uppercase transition-colors text-left">WhatsApp Privé</a>
                        <button onClick={onHistoryClick} className="text-[10px] text-white/40 hover:text-[var(--milano-bronzo)] tracking-widest uppercase transition-colors text-left">Reserved Archive</button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[9px] font-accent text-gold tracking-[0.8em] uppercase opacity-60">Direct Inquiries</h4>
                    <div className="space-y-4">
                        <p className="text-[10px] text-white/40 tracking-widest uppercase leading-tight">{BUSINESS_INFO.address}</p>
                        <p className="text-[10px] text-white/40 tracking-widest uppercase">{BUSINESS_INFO.email}</p>
                        <button
                            onClick={onAdminLoginClick}
                            className="text-[8px] font-accent text-gold/20 hover:text-gold transition-colors tracking-[0.4em] uppercase"
                        >
                            Member Login
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-6 border-t border-[var(--milano-bronzo)]/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                <span className="text-[8px] font-accent text-white/20 tracking-[0.8em] uppercase">© 2026 Insolito Privé. All Rights Reserved.</span>
                <div className="flex gap-8">
                    <span className="text-[8px] font-accent text-white/20 tracking-[0.4em] uppercase">Milano</span>
                    <span className="text-[8px] font-accent text-white/20 tracking-[0.4em] uppercase">Bergamo</span>
                    <span className="text-[8px] font-accent text-white/20 tracking-[0.4em] uppercase">Lecco</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
