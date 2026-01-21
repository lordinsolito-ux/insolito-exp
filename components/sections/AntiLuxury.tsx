import React from 'react';

const AntiLuxury: React.FC = () => {
    return (
        <section className="py-24 px-12 md:px-24 bg-black relative">
            <div className="max-w-7xl mx-auto border-t border-white/5 pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-5 space-y-8">
                        <span className="text-[var(--milano-bronzo)] font-mono text-[10px] uppercase tracking-[1em] block">The filter</span>
                        <h3 className="text-6xl md:text-8xl font-accent text-white font-black uppercase tracking-tighter">Cose che <br /><span className="text-white/10">NON facciamo.</span></h3>
                        <p className="text-white/40 font-display text-xl italic max-w-sm">Perché Insolito non è per tutti. E va bene così.</p>
                    </div>
                    <div className="lg:col-span-7 space-y-16">
                        {[
                            { title: "NON Guidiamo Limousine Bianche", desc: "Le limousine sono per i balli scolastici. Se cerchi clown, vai al circo. Noi guidiamo macchine serie per persone serie." },
                            { title: "NON Siamo Disponibili H24 per €50/ora", desc: "Il nostro tempo vale. Il tuo anche. Chi cerca 'economico' trova 'mediocre'. Noi non siamo economici." },
                            { title: "NON Facciamo Favori", desc: "Questo è un business, non una onlus. Rispetto reciproco o arrivederci." },
                            { title: "NON Parliamo dei Nostri Clienti", desc: "Mai. Con nessuno. Per nessun motivo. La tua vita è tua. Fine." }
                        ].map((item, i) => (
                            <div key={i} className="group space-y-4 pb-12 border-b border-white/5">
                                <div className="flex items-start gap-8">
                                    <span className="text-white/10 font-mono text-4xl">0{i + 1}</span>
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-accent text-white font-bold uppercase tracking-tight group-hover:text-[var(--milano-bronzo)] transition-colors">❌ {item.title}</h4>
                                        <p className="text-white/40 font-display text-lg italic">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="pt-8">
                            <p className="text-[10px] font-mono text-white/20 tracking-[0.5em] uppercase text-center md:text-left">Se questo ti scandalizza, perfetto. Non sei il nostro cliente.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AntiLuxury;
