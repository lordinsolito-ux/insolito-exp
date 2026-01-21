import React, { forwardRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { SERVICE_TYPES } from '../../constants';
import { ServiceTypeId } from '../../types';

interface ServiceSelectionProps {
    onServiceSelect: (id: ServiceTypeId) => void;
}

const ServiceSelection = forwardRef<HTMLDivElement, ServiceSelectionProps>(({ onServiceSelect }, ref) => {
    return (
        <section ref={ref} className="py-24 px-12 md:px-24 max-w-7xl mx-auto space-y-16">
            <div className="space-y-6 text-center max-w-2xl mx-auto animate-reveal">
                <span className="text-[10px] text-[var(--milano-bronzo)] font-accent uppercase tracking-[1.5em] mb-4 block">The Portfolio</span>
                <h3 className="text-6xl md:text-8xl font-display text-white tracking-[0.1em] lowercase italic">Silenzi.</h3>
                <p className="text-white/60 font-display text-xl md:text-2xl leading-relaxed italic pt-6 border-t border-[var(--milano-bronzo)]/20 mt-8">
                    "Non vendiamo passaggi. Creiamo assenze. Scegli come vuoi sparire oggi."
                </p>
                <p className="text-[10px] font-mono text-[var(--milano-bronzo)] uppercase tracking-[0.2em] mt-8 opacity-80">
                    *Tutte le esperienze sono accessibili con i Tier Essentials e Signature.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
                {SERVICE_TYPES.map((service) => (
                    <button
                        key={service.id}
                        onClick={() => onServiceSelect(service.id)}
                        className="group flex flex-col bg-white/5 border border-white/5 hover:border-[var(--milano-bronzo)]/30 backdrop-blur-sm shadow-2xl hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] transition-all duration-700 min-h-[460px] rounded-sm overflow-hidden text-left relative"
                    >
                        <div className="h-56 overflow-hidden relative w-full">
                            <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[6000ms] grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        </div>

                        <div className="p-8 md:p-10 space-y-6 flex-1 flex flex-col relative z-10 -mt-12">
                            <div className="space-y-2">
                                <span className="text-[9px] font-accent text-[var(--milano-bronzo)] tracking-[0.4em] uppercase opacity-90">{service.badge}</span>
                                <h4 className="text-3xl font-display text-white italic tracking-wide">{service.name}</h4>
                            </div>
                            <p className="text-white/50 text-[13px] leading-loose font-sans font-light line-clamp-4">{service.description}</p>
                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between group-hover:border-[var(--milano-bronzo)]/20 transition-colors">
                                <span className="text-[9px] font-accent text-white/30 tracking-[0.4em] uppercase group-hover:text-white/60">Reserve</span>
                                <ArrowRight className="w-4 h-4 text-[var(--milano-bronzo)] group-hover:translate-x-2 transition-transform duration-700" />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
});

ServiceSelection.displayName = 'ServiceSelection';

export default ServiceSelection;
