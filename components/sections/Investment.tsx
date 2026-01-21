import React, { useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';

interface InvestmentProps {
    onBookClick: () => void;
}

const Investment: React.FC<InvestmentProps> = ({ onBookClick }) => {
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

    const handleBookNow = () => {
        if (onBookClick) {
            onBookClick();
        } else {
            const el = document.getElementById('booking-section');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <section id="investment-section" className="bg-black text-white py-20 md:py-32 px-6 md:px-12 lg:px-24 font-sans relative overflow-hidden z-20 border-t border-white/5">
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

            {/* HERO SECTION */}
            <div className="max-w-7xl mx-auto text-center space-y-8 md:space-y-12 mb-24 md:mb-32 relative z-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 md:pb-6 mb-8 md:mb-12">
                    <span className="text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] md:tracking-[0.5em]">Index.02</span>
                    <span className="text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] md:tracking-[0.5em]">Investment</span>
                </div>

                <h2 className="text-4xl md:text-7xl font-accent uppercase font-bold tracking-tighter leading-tight">
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

            {/* TIERS */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24 md:mb-40 relative z-10">

                {/* TIER 1 - ESSENTIALS */}
                <div className="bg-white/[0.02] border border-white/10 p-8 md:p-10 hover:border-[var(--milano-bronzo)]/30 transition-all duration-500 group relative overflow-hidden rounded-sm flex flex-col justify-between">
                    <div className="absolute top-0 right-0 bg-[var(--milano-bronzo)] text-black text-[9px] font-bold px-3 py-1 uppercase tracking-widest z-10">
                        ⚡ First Time -30%
                    </div>
                    <div>
                        <div className="mb-8">
                            <span className="inline-block py-1 px-3 bg-white/5 text-[9px] font-mono tracking-widest text-white/60 uppercase rounded-sm mb-4">Start Here</span>
                            <h3 className="text-2xl md:text-3xl font-accent uppercase tracking-wide mb-2">Essentials</h3>
                            <p className="text-[10px] md:text-[11px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">Per Chi Inizia a Capire Cosa Vuol Dire Non Guidare.</p>
                        </div>

                        <div className="mb-8 p-6 bg-black/40 border border-white/5 text-center">
                            <span className="block text-2xl md:text-3xl font-bold text-white mb-1">€180/ora</span>
                            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40">Minimo 3h consecutive</span>
                        </div>

                        <ul className="space-y-4 mb-12">
                            <li className="flex items-start gap-3 text-xs md:text-sm text-white/70"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Assistenza logistica coordinata</li>
                            <li className="flex items-start gap-3 text-xs md:text-sm text-white/70"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Prenotazione 24h anticipo</li>
                            <li className="flex items-start gap-3 text-xs md:text-sm text-white/70"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Comunicazione diretta Michael</li>
                            <li className="flex items-start gap-3 text-xs md:text-sm text-white/30 italic"><X className="w-4 h-4 text-red-500/50 mt-0.5 shrink-0" /> No Night Estremo</li>
                        </ul>
                    </div>

                    <button
                        onClick={handleBookNow}
                        className="w-full py-5 border border-white/20 text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 active:bg-white active:text-black touch-manipulation font-bold"
                    >
                        Prenota Essential
                    </button>
                </div>

                {/* TIER 2 - SIGNATURE */}
                <div className="bg-[var(--milano-bronzo)]/[0.05] border border-[var(--milano-bronzo)]/30 p-8 md:p-10 relative lg:transform lg:-translate-y-6 shadow-[0_0_50px_-20px_rgba(139,115,85,0.2)] rounded-sm flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-2">
                        <span className="text-[8px] font-mono bg-[var(--milano-bronzo)] text-black px-2 py-1 uppercase tracking-widest font-bold">💎 73% Clienti</span>
                    </div>
                    <div>
                        <div className="mb-8">
                            <h3 className="text-2xl md:text-3xl font-accent uppercase tracking-wide mb-2 text-[var(--milano-bronzo)]">Signature</h3>
                            <p className="text-[10px] md:text-[11px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">Per Chi Ha Capito Che l'Imprevisto Costa Più del Previsto.</p>
                        </div>

                        <div className="mb-8 p-6 bg-black/60 border border-[var(--milano-bronzo)]/20 text-center">
                            <span className="block text-2xl md:text-3xl font-bold text-[var(--milano-bronzo)] mb-1">€280/ora</span>
                            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40">Minimo 4h consecutive</span>
                        </div>

                        <ul className="space-y-4 mb-12">
                            <li className="flex items-start gap-3 text-xs md:text-sm text-white"><Check className="w-4 h-4 text-[var(--milano-bronzo)] mt-0.5 shrink-0" /> <strong>Tutto di Essentials, più:</strong></li>
                            <li className="flex items-start gap-3 text-xs md:text-sm text-white/80"><Check className="w-4 h-4 text-[var(--milano-bronzo)] mt-0.5 shrink-0" /> Last-minute fino 4h prima</li>
                            <li className="flex items-start gap-3 text-xs md:text-sm text-white/80"><Check className="w-4 h-4 text-[var(--milano-bronzo)] mt-0.5 shrink-0" /> Backup plan automatico</li>
                            <li className="flex items-start gap-3 text-xs md:text-sm text-white/80"><Check className="w-4 h-4 text-[var(--milano-bronzo)] mt-0.5 shrink-0" /> Notturna estesa</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleBookNow}
                            className="w-full py-5 bg-[var(--milano-bronzo)] text-black text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-white transition-all duration-500 font-bold active:bg-white touch-manipulation"
                        >
                            Prenota Signature
                        </button>
                        <p className="text-[8px] md:text-[9px] text-center text-white/30 font-mono uppercase tracking-wider">
                            *Code: FIRSTINSOLITO per -30% <button onClick={handleBookNow} className="underline hover:text-white ml-2">Inseriscilo Qui</button>
                        </p>
                    </div>
                </div>

                {/* TIER 3 - ELITE RETAINER */}
                <div className="bg-white/[0.02] border border-white/10 p-8 md:p-10 hover:border-[var(--milano-bronzo)]/30 transition-all duration-500 rounded-sm flex flex-col justify-between">
                    <div>
                        <div className="mb-8">
                            <span className="inline-block py-1 px-3 bg-white/5 text-[9px] font-mono tracking-widest text-[var(--milano-bronzo)] uppercase rounded-sm mb-4">👑 Invitation Only</span>
                            <h3 className="text-2xl md:text-3xl font-accent uppercase tracking-wide mb-2">Elite Retainer</h3>
                            <p className="text-[10px] md:text-[11px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">Per Chi Non Vuole Più Pensare a "Posso Chiamarlo?".</p>
                        </div>

                        <div className="mb-8 p-6 bg-black/40 border border-white/5 text-center">
                            <span className="block text-2xl md:text-3xl font-bold text-white mb-1">€6.000/mese</span>
                            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40">24/7/365 Illimitato</span>
                        </div>

                        <ul className="space-y-4 mb-12">
                            <li className="flex items-start gap-3 text-xs md:text-sm text-white/90"><Check className="w-4 h-4 text-white mt-0.5 shrink-0" /> Linea diretta prioritaria H24</li>
                            <li className="flex items-start gap-3 text-xs md:text-sm text-white/90"><Check className="w-4 h-4 text-white mt-0.5 shrink-0" /> Nessun limite di ore</li>
                            <li className="flex items-start gap-3 text-xs md:text-sm text-white/90"><Check className="w-4 h-4 text-white mt-0.5 shrink-0" /> Coordinamento team dedicato</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => handleWhatsApp("Sono interessato al Tier ELITE RETAINER.")}
                            className="w-full py-5 border border-white/20 text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 active:bg-white active:text-black touch-manipulation font-bold"
                        >
                            Richiedi Elite
                        </button>
                        <p className="text-[8px] md:text-[9px] text-center text-white/30 font-mono uppercase tracking-wider">Disponibili: 7 Slot</p>
                    </div>
                </div>
            </div>

            {/* VALUE COMPARISON - ROI ANALYSIS */}
            <div className="max-w-4xl mx-auto mb-24 md:mb-40 relative z-10 border-y border-white/5 bg-white/[0.01] p-8 md:p-16 rounded-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                    <div className="space-y-6 flex-1">
                        <h4 className="text-[var(--milano-bronzo)] font-mono text-[10px] tracking-[0.4em] uppercase">Market Reality Check</h4>
                        <h3 className="text-3xl font-accent uppercase tracking-wide text-white">Perché Insolito<br />costa il doppio?</h3>
                        <p className="text-white/60 text-sm md:text-base font-display italic leading-relaxed">
                            Un NCC standard ti porta da A a B. Noi ti restituiamo il tempo che perdi nel mezzo. Se il tuo tempo vale €200/ora, con noi sei già in profitto.
                        </p>
                    </div>

                    <div className="w-full md:w-auto flex-1 bg-black/40 border border-white/5 p-8 space-y-6 rounded-sm">
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest border-b border-white/10 pb-4">
                            <span className="text-white/40">NCC Standard</span>
                            <span className="text-white/40">~€80/ora</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-widest pb-2 text-[var(--milano-bronzo)] bold">
                            <span>INSOLITO Essentials</span>
                            <span>€180/ora</span>
                        </div>
                        <ul className="space-y-3 text-[10px] text-white/60 font-mono uppercase tracking-wider pl-4 border-l border-[var(--milano-bronzo)]/30">
                            <li>+ Assistenza Logistica</li>
                            <li>+ Coordinamento Pre-Arrivo</li>
                            <li>+ Gestione Comunicazioni</li>
                            <li>+ Puntualità Garantita</li>
                        </ul>
                    </div>
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
                        { q: "Posso pagare in contanti?", a: "No. Solo fattura elettronica. Questo è un business regolare, non un servizio in nero." },
                        { q: "Che auto guidate?", a: "Non guidiamo limousine bianche. Guidiamo veicoli professionali, discreti, puliti. Se cerchi ostentazione, hai sbagliato indirizzo." },
                        { q: "E se devo cancellare?", a: "Essentials/Signature: Rimborso 100% 24h prima. Elite: Illimitate." },
                        { q: "Perché voi e non Uber Black?", a: "Uber è un'app, io sono un custode. Io proteggo il tuo tempo e la tua privacy. Se per te è lo stesso, prendi Uber." },
                    ].map((item, i) => (
                        <div key={i} className="border-b border-white/10">
                            <button onClick={() => toggleFaq(i)} className="w-full py-6 flex justify-between items-center text-left hover:text-[var(--milano-bronzo)] transition-colors">
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
                <h2 className="text-4xl md:text-6xl font-accent uppercase font-bold tracking-tighter mb-8 text-white">
                    Il tuo tempo <br /> non torna indietro.
                </h2>
                <p className="text-xl font-display text-white/60 italic mb-12">
                    Puoi continuare a gestire l'ovvio. <br /> O puoi scegliere di sparire.
                </p>
                <div className="flex flex-col items-center gap-8">
                    <button
                        onClick={() => handleWhatsApp()}
                        className="w-full md:w-auto px-16 py-6 bg-white text-black text-[12px] font-mono uppercase tracking-[0.3em] hover:bg-[var(--milano-bronzo)] hover:text-white transition-all duration-500 font-bold active:bg-[var(--milano-bronzo)] touch-manipulation"
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
