import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

interface TheGuardianProps {
    onStoryClick: () => void;
}

const TheGuardian: React.FC<TheGuardianProps> = ({ onStoryClick }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effects
    const yText = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const yImage = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const opacityInitial = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    return (
        <section
            ref={containerRef}
            className="relative py-32 md:py-48 px-6 md:px-24 overflow-hidden bg-[#F9F7F4] text-[#1a1a1a] transition-colors duration-1000"
        >
            {/* Background Texture - Subtle Paper Grain */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center relative z-10">

                {/* LEFT COLUMN - TEXT CONTENT */}
                <motion.div
                    className="md:col-span-7 space-y-16 md:pr-12"
                    style={{ y: yText, opacity: opacityInitial }}
                >
                    {/* Monumental Name */}
                    <div className="space-y-2">
                        <h2 className="text-6xl md:text-[8vw] leading-[0.8] font-thin tracking-tighter text-black uppercase font-accent">
                            Michael<br />Jara
                        </h2>
                        <div className="h-px w-24 bg-[#D4AF37] mt-8"></div>
                        <p className="text-[#D4AF37] font-mono text-xs uppercase tracking-[0.4em] pt-4">Insolito Privé Founder</p>
                    </div>

                    {/* Manifesto */}
                    <div className="space-y-8 max-w-xl">
                        <h3 className="text-2xl md:text-3xl font-display italic text-[#1a1a1a] leading-tight">
                            L'Architetto del Tempo.
                        </h3>

                        <div className="space-y-6 text-[#1a1a1a]/80 font-serif text-lg leading-relaxed md:text-xl">
                            <p>
                                <span className="font-bold text-black">"Il vero lusso non è farsi notare, ma essere ovunque senza lasciare traccia."</span>
                            </p>
                            <p>
                                Michael Jara ha fondato Insolito Privé con una missione radicale: restituire ai suoi clienti la risorsa più scarsa al mondo, la tranquillità.
                            </p>
                            <p>
                                Non è solo una questione di logistica d’élite. È la creazione di un’ombra professionale e silenziosa che anticipa ogni necessità. Dalla gestione millimetrica degli arrivi aeroportuali alla protezione discreta nel cuore della notte, Michael Jara firma ogni servizio con la promessa di un’assistenza che trascende il visibile.
                            </p>
                            <p className="text-[#1a1a1a] font-medium border-l-2 border-[#D4AF37] pl-4">
                                Operiamo esclusivamente su referenza, perché la fiducia è il primo requisito dell'eccellenza.
                            </p>
                        </div>
                    </div>

                    {/* Legal Seal (Desktop) */}
                    <div className="hidden md:block pt-12 opacity-60">
                        <LegalSeal />
                    </div>
                </motion.div>

                {/* RIGHT COLUMN - IMAGE */}
                <motion.div
                    className="md:col-span-5 relative"
                    style={{ y: yImage, opacity: opacityInitial }}
                >
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm group cursor-pointer" onClick={onStoryClick}>
                        <img
                            src="/assets/founder_michael_jara.jpg"
                            alt="Michael Jara - Founder"
                            className="w-full h-full object-cover grayscale contrast-125 brightness-110 group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                        />
                        {/* Soft Glow Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent mix-blend-soft-light pointer-events-none"></div>
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none"></div>

                        {/* Interactive Hint */}
                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/90 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-widest text-black font-mono">
                            Leggi la storia
                        </div>
                    </div>
                </motion.div>

                {/* Legal Seal (Mobile) */}
                <div className="md:hidden col-span-1 pt-8 opacity-60 border-t border-black/5">
                    <LegalSeal />
                </div>

            </div>
        </section>
    );
};

const LegalSeal = () => (
    <div className="text-[9px] text-[#8C8C8C] font-sans font-medium leading-relaxed max-w-sm tracking-wide">
        <p className="uppercase text-[#D4AF37] mb-1 tracking-widest">Legal Seal</p>
        <p>INSOLITO PRIVÉ è un marchio di INSOLITO EXPERIENCES DI JARA LLOCTUN MICHAEL SERGIO.</p>
        <p>P.IVA 14379200968 | Sede Legale: Via Uboldo 8, Cernusco sul Naviglio (MI).</p>
        <p>Servizi alla Persona n.c.a. (ATECO 96.99.99).</p>
    </div>
);

export default TheGuardian;
