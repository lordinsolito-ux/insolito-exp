import React, { useState } from 'react';
import { Check, X, ChevronDown, ArrowRight } from 'lucide-react';

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
        window.open(url, '_blank');
    };

    return (
        <section className="bg-black text-white py-24 px-6 md:px-12 lg:px-24 font-sans relative overflow-hidden z-20 border-t border-white/5">
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

            {/* HERO SECTION */}
            <div className="max-w-7xl mx-auto text-center space-y-12 mb-32 relative z-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-12">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Index.02</span>
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Investment</span>
                </div>

                <h2 className="text-4xl md:text-7xl font-accent uppercase font-bold tracking-tighter leading-tight">
                    Il tuo tempo <br /><span className="text-[var(--milano-bronzo)]">non ha prezzo.</span>
                </h2>
                <h3 className="text-2xl md:text-4xl font-display italic text-white/80">
                    Il nostro servizio sì.
                </h3>

                <div className="w-px h-24 bg-gradient-to-b from-[var(--milano-bronzo)] to-transparent mx-auto my-12"></div>

                <p className="text-xl md:text-2xl font-display italic text-white/60">
                    "Non vendiamo ore. Compriamo la tua libertà."
                </p>
            </div>

            {/* INTRO - ANTI-SCUSE */}
            <div className="max-w-4xl mx-auto text-center space-y-12 mb-32 relative z-10">
                <div className="border border-white/10 p-12 bg-white/[0.02] backdrop-blur-sm">
                    <h3 className="text-2xl font-accent uppercase tracking-widest mb-8">Prezzi Chiari. <span className="text-[var(--milano-bronzo)]">Zero Bullshit.</span></h3>
                    <p className="text-white/60 font-display text-lg leading-relaxed italic mb-6">
                        Odio i siti che dicono "Contattaci per un preventivo". <br /><br />
                        Se devo chiederti il prezzo, probabilmente non posso permettermelo. O peggio: tu non sai quanto vale il tuo servizio. <br />
                        Noi sappiamo quanto valiamo.
                    </p>
                    <p className="text-white font-bold text-lg">Ecco i numeri. Senza filtri.</p>
                </div>
            </div>

            {/* TIERS */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32 relative z-10">

                {/* TIER 1 - ESSENTIALS */}
                <div className="bg-white/[0.02] border border-white/10 p-8 hover:border-[var(--milano-bronzo)]/30 transition-all duration-500 group">
                    <div className="mb-8">
                        <span className="inline-block py-1 px-3 bg-white/5 text-[9px] font-mono tracking-widest text-green-400 uppercase rounded-sm mb-4">🌱 Entry Point</span>
                        <h3 className="text-3xl font-accent uppercase tracking-wide mb-2">Essentials</h3>
                        <p className="text-[11px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">Per Chi Inizia a Capire Cosa Vuol Dire Non Guidare.</p>
                    </div>

                    <div className="mb-8 p-6 bg-black/40 border border-white/5 text-center">
                        <span className="block text-3xl font-bold text-white mb-1">€180/ora</span>
                        <span className="text-[10px] uppercase tracking-widest text-white/40">Minimo 3h consecutive</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3 text-sm text-white/70"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Assistenza logistica coordinata</li>
                        <li className="flex items-start gap-3 text-sm text-white/70"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Prenotazione 24h anticipo</li>
                        <li className="flex items-start gap-3 text-sm text-white/70"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Comunicazione diretta Michael</li>
                        <li className="flex items-start gap-3 text-sm text-white/70"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Puntualità millimetrica</li>
                        <li className="flex items-start gap-3 text-sm text-white/30 italic"><X className="w-4 h-4 text-red-500/50 mt-0.5 shrink-0" /> No Last-Minute (sotto 24h)</li>
                        <li className="flex items-start gap-3 text-sm text-white/30 italic"><X className="w-4 h-4 text-red-500/50 mt-0.5 shrink-0" /> No Night Estremo (post 02:00)</li>
                    </ul>

                    <button
                        onClick={onBookClick}
                        className="w-full py-4 border border-white/20 text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500"
                    >
                        Prenota Essential
                    </button>
                </div>

                {/* TIER 2 - SIGNATURE */}
                <div className="bg-[var(--milano-bronzo)]/[0.05] border border-[var(--milano-bronzo)]/30 p-8 relative transform md:-translate-y-4 shadow-[0_0_50px_-20px_rgba(139,115,85,0.2)]">
                    <div className="absolute top-0 right-0 p-2">
                        <span className="text-[8px] font-mono bg-[var(--milano-bronzo)] text-black px-2 py-1 uppercase tracking-widest font-bold">💎 73% Clienti</span>
                    </div>
                    <div className="mb-8">
                        <h3 className="text-3xl font-accent uppercase tracking-wide mb-2 text-[var(--milano-bronzo)]">Signature</h3>
                        <p className="text-[11px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">Per Chi Ha Capito Che l'Imprevisto Costa Più del Previsto.</p>
                    </div>

                    <div className="mb-8 p-6 bg-black/60 border border-[var(--milano-bronzo)]/20 text-center">
                        <span className="block text-3xl font-bold text-[var(--milano-bronzo)] mb-1">€280/ora</span>
                        <span className="text-[10px] uppercase tracking-widest text-white/40">Minimo 4h consecutive</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3 text-sm text-white"><Check className="w-4 h-4 text-[var(--milano-bronzo)] mt-0.5 shrink-0" /> <strong>Tutto di Essentials, più:</strong></li>
                        <li className="flex items-start gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-[var(--milano-bronzo)] mt-0.5 shrink-0" /> Last-minute fino 4h prima</li>
                        <li className="flex items-start gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-[var(--milano-bronzo)] mt-0.5 shrink-0" /> Backup plan automatico</li>
                        <li className="flex items-start gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-[var(--milano-bronzo)] mt-0.5 shrink-0" /> Gestione imprevisti inclusa</li>
                        <li className="flex items-start gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-[var(--milano-bronzo)] mt-0.5 shrink-0" /> Attesa illimitata (zero extra)</li>
                        <li className="flex items-start gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-[var(--milano-bronzo)] mt-0.5 shrink-0" /> Notturna estesa (fino 04:00)</li>
                    </ul>

                    <button
                        onClick={onBookClick}
                        className="w-full py-4 bg-[var(--milano-bronzo)] text-black text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-white transition-all duration-500 font-bold"
                    >
                        Prenota Signature
                    </button>
                    <p className="mt-4 text-[9px] text-center text-white/30 font-mono uppercase tracking-wider">*Code: FIRSTSILENCE per -€50</p>
                </div>

                {/* TIER 3 - ELITE RETAINER */}
                <div className="bg-white/[0.02] border border-white/10 p-8 hover:border-[var(--milano-bronzo)]/30 transition-all duration-500">
                    <div className="mb-8">
                        <span className="inline-block py-1 px-3 bg-white/5 text-[9px] font-mono tracking-widest text-gold uppercase rounded-sm mb-4">👑 Invitation Only</span>
                        <h3 className="text-3xl font-accent uppercase tracking-wide mb-2">Elite Retainer</h3>
                        <p className="text-[11px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">Per Chi Non Vuole Più Pensare a "Posso Chiamarlo?".</p>
                    </div>

                    <div className="mb-8 p-6 bg-black/40 border border-white/5 text-center">
                        <span className="block text-3xl font-bold text-white mb-1">€6.000/mese</span>
                        <span className="text-[10px] uppercase tracking-widest text-white/40">24/7/365 Illimitato</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3 text-sm text-white/90"><Check className="w-4 h-4 text-gold mt-0.5 shrink-0" /> Linea diretta prioritaria H24</li>
                        <li className="flex items-start gap-3 text-sm text-white/90"><Check className="w-4 h-4 text-gold mt-0.5 shrink-0" /> Nessun limite di ore</li>
                        <li className="flex items-start gap-3 text-sm text-white/90"><Check className="w-4 h-4 text-gold mt-0.5 shrink-0" /> Assistant personale dedicato</li>
                        <li className="flex items-start gap-3 text-sm text-white/90"><Check className="w-4 h-4 text-gold mt-0.5 shrink-0" /> Accesso rete partner d'élite</li>
                        <li className="flex items-start gap-3 text-sm text-white/90"><Check className="w-4 h-4 text-gold mt-0.5 shrink-0" /> Coordinamento famiglia/team</li>
                    </ul>

                    <button
                        onClick={() => handleWhatsApp("Sono interessato al Tier ELITE RETAINER.")}
                        className="w-full py-4 border border-white/20 text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500"
                    >
                        Richiedi Elite
                    </button>
                    <p className="mt-4 text-[9px] text-center text-white/30 font-mono uppercase tracking-wider">Disponibili: 7 Slot</p>
                </div>
            </div>

            {/* SPECIAL SERVICES */}
            <div className="max-w-7xl mx-auto space-y-12 mb-32 border-t border-white/10 pt-24 relative z-10">
                <h3 className="text-3xl font-accent uppercase tracking-widest text-center mb-16">Servizi <span className="text-[var(--milano-bronzo)]">Speciali</span></h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-white/[0.02] p-8 border border-white/5">
                        <h4 className="text-xl font-accent uppercase mb-4">Privé Wedding</h4>
                        <p className="text-[10px] font-mono text-[var(--milano-bronzo)] uppercase tracking-widest mb-6">Da €3.500/Evento</p>
                        <p className="text-white/60 mb-6 italic font-display">Logistica fantasma per matrimoni d'élite. Coordinamento arrivi, fleet management, nessuna preoccupazione.</p>
                        <button
                            onClick={() => handleWhatsApp("Vorrei informazioni per il servizio PRIVÉ WEDDING.")}
                            className="text-[10px] font-mono uppercase tracking-widest border-b border-white/20 hover:text-[var(--milano-bronzo)] transition-colors pb-1"
                        >
                            Richiedi Wedding
                        </button>
                    </div>
                    <div className="bg-white/[0.02] p-8 border border-white/5">
                        <h4 className="text-xl font-accent uppercase mb-4">Privé Executive</h4>
                        <p className="text-[10px] font-mono text-[var(--milano-bronzo)] uppercase tracking-widest mb-6">Da €12.000/Anno</p>
                        <p className="text-white/60 mb-6 italic font-display">Contratti aziendali per C-Level. Priorità coordinata, fatturazione unica, discrezione totale.</p>
                        <button
                            onClick={() => handleWhatsApp("Vorrei informazioni per il servizio PRIVÉ EXECUTIVE.")}
                            className="text-[10px] font-mono uppercase tracking-widest border-b border-white/20 hover:text-[var(--milano-bronzo)] transition-colors pb-1"
                        >
                            Richiedi Corporate
                        </button>
                    </div>
                </div>
            </div>

            {/* GARANZIE */}
            <div className="max-w-5xl mx-auto mb-32 relative z-10">
                <div className="text-center mb-16">
                    <h3 className="text-2xl font-accent uppercase tracking-widest mb-4">Garanzie Incluse</h3>
                    <p className="text-white/40 font-mono text-[11px] uppercase tracking-[0.2em]">Sempre. In ogni tier. Senza eccezioni.</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "RC Professionale", val: "€2.000.000", desc: "Copertura totale Allianz" },
                        { title: "Privacy GDPR", val: "Blindata", desc: "NDA in ogni contratto" },
                        { title: "Puntualità", val: "-20%", desc: "Rimborso se ritardo nostro" },
                        { title: "Pagamenti", val: "No Sorprese", desc: "Fattura immediata" }
                    ].map((item, i) => (
                        <div key={i} className="text-center p-6 border border-white/5 bg-white/[0.01]">
                            <h4 className="text-[10px] uppercase tracking-widest text-[var(--milano-bronzo)] mb-2">{item.title}</h4>
                            <p className="text-xl font-bold text-white mb-2">{item.val}</p>
                            <p className="text-[10px] text-white/40 font-mono uppercase">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="max-w-3xl mx-auto mb-32 relative z-10">
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
                                <span className="text-[12px] font-mono uppercase tracking-[0.1em]">{item.q}</span>
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
            <div className="max-w-4xl mx-auto text-center relative z-10 py-24 border-y border-white/5 bg-black">
                <h2 className="text-4xl md:text-6xl font-accent uppercase font-bold tracking-tighter mb-8 text-white">
                    Il tuo tempo <br /> non torna indietro.
                </h2>
                <p className="text-xl font-display text-white/60 italic mb-12">
                    Puoi continuare a gestire l'ovvio. <br /> O puoi scegliere di sparire.
                </p>
                <button
                    onClick={() => handleWhatsApp()}
                    className="px-12 py-6 bg-white text-black text-[12px] font-mono uppercase tracking-[0.3em] hover:bg-[var(--milano-bronzo)] hover:text-white transition-all duration-500 font-bold"
                >
                    Parla con Michael
                </button>
                <div className="mt-12 space-y-2">
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">+39 339 352 2164 (WhatsApp)</p>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">info@insolitoprive.it</p>
                </div>
            </div>

        </section>
    );
};

export default Investment;
