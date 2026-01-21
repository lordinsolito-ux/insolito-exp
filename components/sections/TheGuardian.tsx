import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TheGuardianProps {
    onStoryClick: () => void;
}

const TheGuardian: React.FC<TheGuardianProps> = ({ onStoryClick }) => {
    return (
        <section className="py-24 px-12 md:px-24 bg-transparent border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>

            <div className="max-w-4xl mx-auto text-center space-y-16 relative z-10">
                <div className="space-y-6">
                    <span className="text-[var(--milano-bronzo)] font-mono text-[10px] uppercase tracking-[0.5em] block">The Guardian</span>
                    <div className="w-px h-16 bg-gradient-to-b from-[var(--milano-bronzo)]/0 via-[var(--milano-bronzo)] to-[var(--milano-bronzo)]/0 mx-auto"></div>
                </div>

                <div className="relative inline-block group">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-[var(--milano-bronzo)]/20 shadow-[0_0_40px_-10px_rgba(139,115,85,0.2)] mx-auto relative z-10">
                        <img
                            src="/assets/founder_michael_jara.jpg"
                            alt="Michael Jara"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>
                    <div className="absolute -inset-4 border border-[var(--milano-bronzo)]/10 rounded-full scale-90 group-hover:scale-110 transition-transform duration-[1000ms] opacity-50"></div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-accent text-white uppercase tracking-widest">Michael Jara</h3>
                    <p className="text-[10px] font-mono text-white/40 tracking-[0.4em] uppercase">Fondatore, Insolito Privé</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-8">
                    <p className="text-white/80 font-display text-xl md:text-2xl leading-relaxed italic">
                        "Ho passato anni a vedere imprenditori brillanti vivere come schiavi del loro successo. INSOLITO nasce da una convinzione semplice: <br /><br />
                        <span className="text-white">Il vero lusso non è ostentazione. È recuperare il controllo della propria vita.</span>"
                    </p>
                    <p className="text-white/60 font-display text-lg italic">
                        "Non cerco clienti che vogliono impressionare. Cerco leader che vogliono sparire.<br />
                        Se sei qui, probabilmente sei uno di loro."
                    </p>
                </div>

                <div className="pt-8">
                    <button
                        onClick={onStoryClick}
                        className="group flex items-center gap-4 mx-auto text-[10px] font-mono text-[var(--milano-bronzo)] uppercase tracking-[0.4em] hover:text-white transition-colors"
                    >
                        <span>La Mia Storia Completa</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" strokeWidth={1} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TheGuardian;
