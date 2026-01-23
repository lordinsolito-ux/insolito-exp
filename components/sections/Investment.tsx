import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { TierType } from '../../types';
import { TierSelector } from '../TierSelector';
import { useTranslation } from 'react-i18next';

interface InvestmentProps {
    selectedTier: TierType | null;
    onBookClick: () => void;
    onTierSelect: (tier: TierType) => void;
}

const Investment: React.FC<InvestmentProps> = ({ selectedTier, onBookClick, onTierSelect }) => {
    const { t } = useTranslation();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const whatsappLink = "https://wa.me/393393522164";

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleWhatsApp = (message?: string) => {
        const url = message
            ? `${whatsappLink}?text=${encodeURIComponent(message)}`
            : whatsappLink;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleTierBooking = (tier: TierType) => {
        if (onTierSelect) {
            onTierSelect(tier);
        }
        const el = document.getElementById('booking-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="investment-section" className="bg-black text-white font-sans relative overflow-hidden z-20 border-t border-white/5" style={{ padding: 'var(--space-l) var(--space-m)' }}>
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

            {/* HERO SECTION */}
            <div className="max-w-7xl mx-auto text-center space-y-8 md:space-y-12 mb-24 md:mb-32 relative z-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 md:pb-6 mb-8 md:mb-12">
                    <span className="text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] md:tracking-[0.5em]">Index.02</span>
                    <span className="text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] md:tracking-[0.5em]">Investment</span>
                </div>

                <h2
                    style={{ fontSize: 'var(--text-title-xl)' }}
                    className="font-accent uppercase font-bold tracking-tighter leading-tight"
                >
                    Il tuo tempo <br /><span className="text-[var(--milano-bronzo)]">non ha prezzo.</span>
                </h2>
                <h3 className="text-xl md:text-4xl font-display italic text-white/80">
                    Il nostro servizio sì.
                </h3>

                <div className="w-px h-16 md:h-24 bg-gradient-to-b from-[var(--milano-bronzo)] to-transparent mx-auto my-8 md:my-12"></div>

                <p className="text-lg md:text-2xl font-display italic text-white/60">
                    "Non vendiamo ore. Compriamo la tua libertà."
                </p>
            </div>

            {/* UNIFIED TIER SELECTOR */}
            <div className="max-w-7xl mx-auto mb-24 md:mb-40 relative z-10">
                <TierSelector
                    selectedTier={selectedTier}
                    onSelectTier={handleTierBooking}
                    t={t}
                />
            </div>

            {/* IL VALORE DEL TUO TEMPO - STRATEGIC COMPARISON */}
            <div className="max-w-5xl mx-auto mb-24 md:mb-40 relative z-10 border-y border-white/5 bg-white/[0.01] p-8 md:p-16 rounded-sm">
                <div className="text-center mb-12 md:mb-16">
                    <h4 className="text-[var(--milano-bronzo)] font-mono text-[10px] tracking-[0.4em] uppercase mb-4">Il Valore del Tuo Tempo</h4>
                    <h3 className="text-2xl md:text-4xl font-accent uppercase tracking-wide text-white mb-4">Perché la gestione è diversa<br />dal semplice trasporto.</h3>
                </div>

                {/* COMPARISON TABLE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
                    {/* TRASPORTO STANDARD */}
                    <div className="bg-black/40 border border-white/5 p-8 md:p-10 rounded-sm space-y-6">
                        <div className="text-center border-b border-white/10 pb-6">
                            <h5 className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/40 mb-2">Trasporto Standard</h5>
                            <p className="text-white/20 text-[9px] font-mono uppercase tracking-widest">(A → B)</p>
                        </div>
                        <ul className="space-y-4 text-[11px] md:text-[12px] font-mono text-white/50 uppercase tracking-wider">
                            <li className="flex items-start gap-3"><span className="text-white/20 shrink-0">•</span> Pura mobilità urbana</li>
                            <li className="flex items-start gap-3"><span className="text-white/20 shrink-0">•</span> Solo trasferimento da un punto all'altro</li>
                            <li className="flex items-start gap-3"><span className="text-white/20 shrink-0">•</span> Servizio basato su chilometraggio</li>
                            <li className="flex items-start gap-3"><span className="text-white/20 shrink-0">•</span> Focus: Il Mezzo</li>
                        </ul>
                        <div className="text-center pt-6 border-t border-white/5">
                            <span className="text-white/30 text-[10px] font-mono uppercase tracking-widest">~ €80 / ora</span>
                            <p className="text-white/20 text-[8px] font-mono uppercase mt-1">Tariffa media mercato</p>
                        </div>
                    </div>

                    {/* INSOLITO PRIVÉ */}
                    <div className="bg-[var(--milano-bronzo)]/[0.05] border border-[var(--milano-bronzo)]/30 p-8 md:p-10 rounded-sm space-y-6 relative">
                        <div className="text-center border-b border-[var(--milano-bronzo)]/20 pb-6">
                            <h5 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[var(--milano-bronzo)] mb-2">Insolito Privé</h5>
                            <p className="text-[var(--milano-bronzo)]/60 text-[9px] font-mono uppercase tracking-widest">(Lifestyle Management)</p>
                        </div>
                        <ul className="space-y-4 text-[11px] md:text-[12px] font-mono text-white/80 uppercase tracking-wider">
                            <li className="flex items-start gap-3"><span className="text-[var(--milano-bronzo)] shrink-0">✓</span> Coordinamento Logistico Integrato</li>
                            <li className="flex items-start gap-3"><span className="text-[var(--milano-bronzo)] shrink-0">✓</span> Gestione attiva di agenda e imprevisti</li>
                            <li className="flex items-start gap-3"><span className="text-[var(--milano-bronzo)] shrink-0">✓</span> Onorario basato su disponibilità e assistenza</li>
                            <li className="flex items-start gap-3"><span className="text-[var(--milano-bronzo)] shrink-0">✓</span> Focus: La Persona</li>
                        </ul>
                        <div className="text-center pt-6 border-t border-[var(--milano-bronzo)]/20">
                            <span className="text-[var(--milano-bronzo)] text-lg font-bold font-mono uppercase tracking-widest">€180 / ora</span>
                            <p className="text-[var(--milano-bronzo)]/60 text-[8px] font-mono uppercase mt-1">Investimento in assistenza d'élite</p>
                        </div>
                    </div>
                </div>

                {/* LEGAL DISCLAIMER */}
                <div className="text-center max-w-3xl mx-auto">
                    <p className="text-white/20 text-[9px] font-mono leading-relaxed tracking-wide">
                        Insolito Privé opera esclusivamente nell'ambito dei Servizi alla Persona (Ateco 96.99.99), fornendo assistenza logistica e consulenza lifestyle. Il supporto alla mobilità è una componente accessoria e strumentale al servizio di assistenza.
                    </p>
                </div>
            </div>

            {/* GARANZIE */}
            <div className="max-w-6xl mx-auto mb-24 md:mb-40 relative z-10">
                <div className="text-center mb-16">
                    <h3 className="text-2xl font-accent uppercase tracking-widest mb-4">Garanzie Incluse</h3>
                    <p className="text-white/40 font-mono text-[11px] uppercase tracking-[0.2em]">Sempre. In ogni tier. Senza eccezioni.</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {[
                        { title: "RC Professionale", val: "€2.000.000", desc: "Copertura totale" },
                        { title: "Privacy GDPR", val: "Blindata", desc: "NDA in ogni contratto" },
                        { title: "Puntualità", val: "-20%", desc: "Rimborso se ritardo" },
                        { title: "Pagamenti", val: "No Sorprese", desc: "Fattura immediata" }
                    ].map((item, i) => (
                        <div key={i} className="text-center p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                            <h4 className="text-[9px] md:text-[10px] uppercase tracking-widest text-[var(--milano-bronzo)] mb-2">{item.title}</h4>
                            <p className="text-lg md:text-xl font-bold text-white mb-2">{item.val}</p>
                            <p className="text-[9px] text-white/40 font-mono uppercase leading-tight">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="max-w-3xl mx-auto mb-24 md:mb-40 relative z-10">
                <h3 className="text-2xl font-accent uppercase tracking-widest text-center mb-16">Domande che <span className="text-white/40">avresti fatto.</span></h3>
                <div className="space-y-4">
                    {[
                        { q: "Perché i costi sono superiori a un normale servizio di trasporto?", a: "Non vendiamo tragitti, ma architettura del tempo e serenità logistica. Mentre un servizio standard si limita a guidare, noi coordiniamo la tua agenda, gestiamo attivamente ogni imprevisto e garantiamo una protezione totale della tua privacy." },
                        { q: "Posso richiedere un semplice trasferimento da A a B?", a: "Il nostro modello si basa sull'assistenza continuativa alla persona (Minimo 3h). Non effettuiamo corse singole 'point-to-point' poiché il nostro valore risiede nella disponibilità costante del Guardian durante l'intero periodo dell'incarico." },
                        { q: "Cosa succede in caso di imprevisti?", a: "Non possiamo controllare il mondo esterno, ma possiamo controllare la reazione ad esso. Monitoriamo costantemente ogni variabile in tempo reale. Se sorge un ostacolo, attiviamo immediatamente sistemi di backup per minimizzare l'impatto sul tuo programma. La nostra missione è che tu non debba mai preoccuparti di trovare una soluzione: l'abbiamo già trovata noi." },
                        { q: "Che tipo di veicoli utilizzate?", a: "Utilizziamo esclusivamente mezzi che garantiscano uno standard di 'Salotto in movimento', equipaggiati per il lavoro o il relax assoluto. Il veicolo è uno strumento accessorio fornito per garantire la massima riservatezza e sicurezza durante la prestazione del servizio di assistenza." },
                        { q: "Come vengono gestiti i miei dati e la mia privacy?", a: "Ogni incarico è protetto da un impegno formale di non divulgazione (NDA). La tua identità e i tuoi spostamenti sono trattati con standard di sicurezza superiori agli standard legali, perché la discrezione è il nostro prodotto principale." },
                    ].map((item, i) => (
                        <div key={i} className="border-b border-white/10">
                            <button onClick={() => toggleFaq(i)} className="w-full py-6 flex justify-between items-center text-left hover:text-[var(--milano-bronzo)] transition-colors group">
                                <span className="text-[12px] md:text-[13px] font-mono uppercase tracking-[0.1em]">{item.q}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ${openFaq === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="pb-6 text-white/60 text-sm leading-relaxed font-display italic pl-4 border-l border-[var(--milano-bronzo)]/30">{item.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FINAL CTA */}
            <div className="max-w-4xl mx-auto text-center relative z-10 py-16 md:py-32 border-y border-white/5 bg-black px-6">
                <h2
                    style={{ fontSize: 'var(--text-title-lg)', lineHeight: '1.2' }}
                    className="font-accent uppercase font-bold tracking-tighter mb-8 text-white"
                >
                    Il tuo tempo <br /> non torna indietro.
                </h2>
                <p className="text-xl font-display text-white/60 italic mb-12">
                    Puoi continuare a gestire l'ovvio. <br /> O puoi scegliere di sparire.
                </p>
                <div className="flex flex-col items-center gap-8">
                    <button
                        onClick={() => handleWhatsApp()}
                        className="w-full md:w-auto px-16 py-6 bg-white text-black text-[12px] font-mono uppercase tracking-[0.3em] hover:bg-[var(--milano-bronzo)] hover:text-white transition-all duration-500 font-bold active:scale-[0.98] touch-manipulation cursor-pointer relative z-30 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                    >
                        Parla con Michael
                    </button>
                    <div className="flex flex-col items-center gap-2">
                        <a href="https://wa.me/393393522164" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-white/30 uppercase tracking-widest hover:text-[var(--milano-bronzo)] transition-colors">+39 339 352 2164 (WhatsApp)</a>
                        <a href="mailto:info@insolitoprive.it" className="text-[10px] font-mono text-white/30 uppercase tracking-widest hover:text-[var(--milano-bronzo)] transition-colors">info@insolitoprive.it</a>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Investment;
