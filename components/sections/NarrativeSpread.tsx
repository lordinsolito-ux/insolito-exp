import React from 'react';

const NarrativeSpread: React.FC = () => {
    return (
        <section id="essence" className="py-16 px-12 md:px-24 space-y-16 bg-transparent relative z-20 overflow-hidden">
            {/* Spread 1: The Vision */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
                <div className="lg:col-span-12 xl:col-span-5 space-y-10 animate-reveal">
                    <div className="space-y-4">
                        <span className="text-[var(--milano-bronzo)] font-mono text-[10px] uppercase tracking-[0.5em] block">Status: [LIVE]</span>
                        <h2 className="text-5xl md:text-7xl font-accent text-white leading-tight tracking-tighter uppercase font-bold">
                            Conosco quella<br /><span className="text-[var(--milano-bronzo)]">sensazione.</span>
                        </h2>
                    </div>
                    <div className="space-y-8 py-8 border-y border-white/5 max-w-xl">
                        <p className="text-white/80 text-lg md:text-xl font-display leading-relaxed italic">
                            "Sono le 23:47. Sei a cena con chi ami. Il telefono vibra. È un cliente. Rispondi, o proteggi questo momento? Con Insolito, non scegli più. Rispondiamo noi. <span className="text-white font-bold not-italic">Tu vivi.</span>"
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-px bg-white/20"></div>
                            <p className="text-white/30 text-[10px] font-mono tracking-widest uppercase italic">
                                Michael Jara, Fondatore
                            </p>
                        </div>
                    </div>

                    {/* IMPACT STATS (TWEAK #2) */}
                    <div className="bg-white/5 border border-white/5 p-6 backdrop-blur-sm max-w-sm">
                        <h4 className="text-[9px] font-accent text-[var(--milano-bronzo)] tracking-[0.4em] uppercase mb-4 opacity-80">Impatto Reale</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[11px] font-mono text-white/60 uppercase tracking-widest">
                                <span className="text-white">→</span> 127 cene protette questo mese
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-mono text-white/60 uppercase tracking-widest">
                                <span className="text-white">→</span> 0 chiamate interrotte
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-mono text-white/60 uppercase tracking-widest">
                                <span className="text-white">→</span> 100% peace of mind
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Dati aggiornati in tempo reale</span>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-12 xl:col-span-7 relative">
                    {/* TWEAK #1: Cinematic Car Visuals */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-sm shadow-3xl group transition-all duration-[3000ms] border border-white/5">
                        <img
                            src="/assets/korando_2014.png"
                            alt="Elite Discretion"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8000ms] ease-out grayscale hover:grayscale-0 brightness-75"
                        />
                        <div className="absolute inset-0 bg-black/60 mix-blend-multiply transition-opacity duration-1000 group-hover:opacity-40"></div>
                        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    </div>
                </div>
            </div>

            {/* Spread 2: What We Do */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto items-center">
                <div className="lg:col-span-12 xl:col-span-5 order-2 xl:order-1 relative">
                    <div className="aspect-[16/10] xl:aspect-[3/4] overflow-hidden rounded-sm border border-white/5 shadow-3xl">
                        <img
                            src="/assets/narrative_lifestyle.png"
                            alt="Milano Lifestyle"
                            className="w-full h-full object-cover grayscale opacity-50"
                        />
                        <div className="absolute inset-x-8 bottom-8 p-8 backdrop-blur-md bg-black/20 border border-white/5">
                            <span className="text-[9px] font-mono text-white/40 tracking-[0.5em] uppercase">Location: Milano Centrale</span>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-center space-y-12 order-1 xl:order-2">
                    <h3 className="text-5xl md:text-7xl font-accent text-white tracking-tighter font-bold uppercase">Non Siamo Qui per <br /><span className="text-[var(--milano-bronzo)]">Impressionarti.</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-white/5">
                        <div className="space-y-4">
                            <h4 className="text-[var(--milano-bronzo)] font-mono text-[10px] tracking-[0.5em] uppercase">The Silence Protocol</h4>
                            <p className="text-white/60 text-[14px] leading-relaxed font-display italic">Mentre tu pensi al futuro, noi proteggiamo il presente. Non cerchiamo ostentazione, portiamo risultati senza lasciare impronte.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[var(--milano-bronzo)] font-mono text-[10px] tracking-[0.5em] uppercase">Umano, Non Agency</h4>
                            <p className="text-white/60 text-[14px] leading-relaxed font-display italic">Zero script preconfezionati. Solo la voce di chi sa che la discrezione non si compra, si conquista ogni singola notte.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NarrativeSpread;
