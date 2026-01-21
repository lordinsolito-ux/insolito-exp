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
        <footer className="relative py-24 px-12 md:px-24 bg-transparent border-t border-[var(--milano-bronzo)]/10 overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-[0.05]"></div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-24 relative z-10">
                <div className="space-y-12">
                    <div className="flex items-center gap-4">
                        <Crown className="w-6 h-6 text-gold" strokeWidth={1} />
                        <span className="text-xl font-display text-white tracking-[0.2em]">INSOLITO</span>
                    </div>
                    <p className="text-white/40 text-[11px] leading-loose tracking-widest uppercase font-accent">
                        Architettura del Tempo & Discrezione Assoluta. Milano.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-[var(--milano-bronzo)]/40 hover:text-gold transition-colors"><Instagram className="w-5 h-5" strokeWidth={1} /></a>
                        <a href="#" className="text-[var(--milano-bronzo)]/40 hover:text-gold transition-colors"><MessageCircle className="w-5 h-5" strokeWidth={1} /></a>
                        <a href="#" className="text-[var(--milano-bronzo)]/40 hover:text-gold transition-colors"><Mail className="w-5 h-5" strokeWidth={1} /></a>
                    </div>
                </div>
                <div className="space-y-8">
                    <h4 className="text-[10px] font-accent text-gold tracking-[1em] uppercase">Maison</h4>
                    <div className="flex flex-col gap-6">
                        <button onClick={onBrandStoryClick} className="text-[11px] text-white/40 hover:text-[var(--milano-bronzo)] tracking-widest uppercase transition-colors text-left">Our Story</button>
                        <button onClick={onVisionClick} className="text-[11px] text-white/40 hover:text-[var(--milano-bronzo)] tracking-widest uppercase transition-colors text-left">The Vision</button>
                        <button onClick={() => onLegalClick(LEGAL_CONTENT.privacy.title, LEGAL_CONTENT.privacy.content)} className="text-[11px] text-white/40 hover:text-[var(--milano-bronzo)] tracking-widest uppercase transition-colors text-left">Privacy</button>
                    </div>
                </div>
                <div className="space-y-8">
                    <h4 className="text-[10px] font-accent text-gold tracking-[1em] uppercase">Concierge</h4>
                    <div className="flex flex-col gap-6">
                        <a href={`tel:${BUSINESS_INFO.phone}`} className="text-[11px] text-white/40 hover:text-[var(--milano-bronzo)] tracking-widest uppercase transition-colors text-left">Direct Line</a>
                        <a href={`https://wa.me/${BUSINESS_INFO.whatsapp}`} className="text-[11px] text-white/40 hover:text-[var(--milano-bronzo)] tracking-widest uppercase transition-colors text-left">WhatsApp Privé</a>
                        <button onClick={onHistoryClick} className="text-[11px] text-white/40 hover:text-[var(--milano-bronzo)] tracking-widest uppercase transition-colors text-left">Reserved Archive</button>
                    </div>
                </div>
                <div className="space-y-8">
                    <h4 className="text-[10px] font-accent text-gold tracking-[1em] uppercase">Direct Inquiries</h4>
                    <div className="space-y-6">
                        <p className="text-[11px] text-white/40 tracking-widest uppercase">{BUSINESS_INFO.address}</p>
                        <p className="text-[11px] text-white/40 tracking-widest uppercase">{BUSINESS_INFO.email}</p>
                        <div className="pt-4">
                            <button
                                onClick={onAdminLoginClick}
                                className="text-[9px] font-accent text-gold/20 hover:text-gold transition-colors tracking-[0.5em] uppercase"
                            >
                                Member Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-24 pt-12 border-t border-[var(--milano-bronzo)]/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <span className="text-[9px] font-accent text-white/20 tracking-[1em] uppercase">© 2024 Insolito Privé. All Rights Reserved.</span>
                <div className="flex gap-12">
                    <span className="text-[9px] font-accent text-white/20 tracking-[0.5em] uppercase">Milano</span>
                    <span className="text-[9px] font-accent text-white/20 tracking-[0.5em] uppercase">Paris</span>
                    <span className="text-[9px] font-accent text-white/20 tracking-[0.5em] uppercase">London</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
