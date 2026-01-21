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
            className="relative py-12 md:py-32 px-6 md:px-24 overflow-hidden bg-[#F9F7F4] text-[#1a1a1a] transition-colors duration-1000"
        >
            {/* Background Texture - Subtle Paper Grain */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="max-w-4xl mx-auto relative z-10 text-center">

                {/* CENTERED CONTENT - BRAND VISION & WHY */}
                <motion.div
                    className="space-y-8 md:space-y-12"
                    style={{ opacity: opacityInitial }}
                >
                    {/* Brand Origin Title */}
                    <div className="space-y-3 md:space-y-4">
                        <span className="text-[#D4AF37] font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] block">The Guardian Section & About Me</span>
                        <h2 className="text-2xl md:text-5xl font-accent text-black uppercase tracking-tighter leading-[0.9]">
                            Perché Esiste<br />Insolito Privé.
                        </h2>
                        <div className="h-px w-12 md:w-16 bg-[#D4AF37] mx-auto mt-4 md:mt-6"></div>
                    </div>

                    {/* Manifesto / Why */}
                    <div className="space-y-8 md:space-y-10 max-w-2xl mx-auto">
                        <div className="space-y-4 md:space-y-6 text-[#1a1a1a]/80 font-serif text-sm md:text-lg leading-relaxed">
                            <p className="font-display italic text-black text-lg md:text-2xl leading-tight">
                                "Il vero lusso non è farsi notare, ma essere ovunque senza lasciare traccia."
                            </p>
                            <p className="px-2 md:px-0">
                                Insolito Privé non è nato per essere un'altra opzione di trasporto d'élite. È nato da una necessità radicale: restituire ai nostri membri la risorsa più preziosa e scarsa al mondo — <span className="text-black font-bold">la totale tranquillità.</span>
                            </p>
                            <p className="px-2 md:px-0">
                                Abbiamo costruito un sistema di assistenza che opera nell'ombra, anticipando ogni variabile logistica prima ancora che si manifesti. Dalla gestione millimetrica degli arrivi alla sicurezza privata nel cuore della notte, la nostra missione è proteggere il tuo tempo e la tua riservatezza con precisione chirurgica.
                            </p>
                        </div>

                        {/* SUBTLE INTERACTIVE FOUNDER SIGNATURE */}
                        <div className="pt-8 md:pt-10 border-t border-black/5">
                            <button
                                onClick={onStoryClick}
                                className="group relative flex flex-col items-center gap-2 transition-all duration-700 mx-auto"
                            >
                                <span className="text-[8px] md:text-[9px] font-mono text-[#D4AF37] uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">CEO & Fondatore</span>
                                <div className="relative">
                                    <span className="text-xl md:text-3xl font-accent text-black uppercase tracking-wider group-hover:text-[#D4AF37] transition-all duration-700 group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                                        Michael Jara
                                    </span>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-700"></div>
                                </div>
                                <div className="mt-2 md:mt-4 flex flex-col items-center gap-2">
                                    <span className="text-[9px] md:text-[10px] font-display italic text-[#1a1a1a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        Clicca per la visione completa
                                    </span>
                                    <div className="w-1 h-1 bg-[#D4AF37] rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700"></div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Legal Seal (Desktop) */}
                    <div className="pt-12 md:pt-16 opacity-40">
                        <LegalSeal />
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

const LegalSeal = () => (
    <div className="text-[9px] text-[#8C8C8C] font-sans font-medium leading-relaxed max-w-sm tracking-wide">
        <p className="uppercase text-[#D4AF37] mb-1 tracking-widest">Digital Seal</p>
        <p>INSOLITO PRIVÉ è un marchio di INSOLITO EXPERIENCES DI JARA LLOCTUN MICHAEL SERGIO.</p>
        <p>P.IVA 14379200968 | Sede Legale: Via Uboldo 8, Cernusco sul Naviglio (MI).</p>
        <p>Servizi alla Persona n.c.a. (ATECO 96.99.99).</p>
    </div>
);

export default TheGuardian;
