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

                {/* LEFT COLUMN - BRAND VISION & WHY */}
                <motion.div
                    className="md:col-span-7 space-y-12 md:pr-12"
                    style={{ y: yText, opacity: opacityInitial }}
                >
                    {/* Brand Origin Title */}
                    <div className="space-y-4">
                        <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-[0.5em] block">Genesi del Progetto</span>
                        <h2 className="text-4xl md:text-6xl font-accent text-black uppercase tracking-tighter leading-[0.9]">
                            Perché Esiste<br />Insolito Privé.
                        </h2>
                        <div className="h-px w-24 bg-[#D4AF37] mt-8"></div>
                    </div>

                    {/* Manifesto / Why */}
                    <div className="space-y-8 max-w-xl">
                        <div className="space-y-6 text-[#1a1a1a]/80 font-serif text-lg leading-relaxed md:text-xl">
                            <p className="font-display italic text-black text-2xl">
                                "Il vero lusso non è farsi notare, ma essere ovunque senza lasciare traccia."
                            </p>
                            <p>
                                Insolito Privé non è nato per essere un'altra opzione di trasporto d'élite. È nato da una necessità radicale: restituire ai nostri membri la risorsa più preziosa e scarsa al mondo — <span className="text-black font-bold">la totale tranquillità.</span>
                            </p>
                            <p>
                                Abbiamo costruito un sistema di assistenza che opera nell'ombra, anticipando ogni variabile logistica prima ancora che si manifesti. Dalla gestione millimetrica degli arrivi alla sicurezza privata nel cuore della notte, la nostra missione è proteggere il tuo tempo e la tua riservatezza con precisione chirurgica.
                            </p>
                        </div>

                        {/* SUBTLE INTERACTIVE FOUNDER SIGNATURE */}
                        <div className="pt-8">
                            <button
                                onClick={onStoryClick}
                                className="group relative flex flex-col items-start gap-1 transition-all duration-700"
                            >
                                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">CEO & Fondatore</span>
                                <div className="relative">
                                    <span className="text-2xl md:text-3xl font-accent text-black uppercase tracking-wider group-hover:text-[#D4AF37] transition-all duration-700 group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                                        Michael Jara
                                    </span>
                                    <div className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-700"></div>
                                </div>
                                <span className="text-[9px] font-display italic text-[#1a1a1a]/40 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 underline underline-offset-4 decoration-[#D4AF37]/30">
                                    Clicca per la visione completa
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Legal Seal (Desktop) */}
                    <div className="hidden md:block pt-12 opacity-40">
                        <LegalSeal />
                    </div>
                </motion.div>

                {/* RIGHT COLUMN - CINEMATIC IMAGE */}
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

                        {/* Subtle Interactive Hint */}
                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/90 backdrop-blur px-4 py-2 text-[9px] uppercase tracking-widest text-black font-mono">
                            Visione d'Élite
                        </div>
                    </div>
                </motion.div>

                {/* Legal Seal (Mobile) */}
                <div className="md:hidden col-span-1 pt-12 opacity-40 border-t border-black/5">
                    <LegalSeal />
                </div>

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
