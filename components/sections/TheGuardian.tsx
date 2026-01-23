import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface TheGuardianProps {
    onStoryClick: () => void;
}

const TheGuardian: React.FC<TheGuardianProps> = ({ onStoryClick }) => {
    const { t } = useTranslation();
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
            className="relative overflow-hidden bg-[#F9F7F4] text-[#1a1a1a] transition-colors duration-1000"
            style={{ padding: 'var(--space-l) var(--space-m)' }}
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
                        <span className="text-[#D4AF37] font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] block">{t('guardian.label')}</span>
                        <h2
                            style={{ fontSize: 'var(--text-title-md)' }}
                            className="font-accent text-black uppercase tracking-tighter leading-[0.9]"
                        >
                            {t('guardian.title')}<br />{t('guardian.title_highlight')}
                        </h2>
                        <div className="h-px w-12 md:w-16 bg-[#D4AF37] mx-auto mt-4 md:mt-6"></div>
                    </div>

                    {/* Manifesto / Why - REALISMO D'ÉLITE */}
                    <div className="space-y-8 md:space-y-10 max-w-2xl mx-auto">
                        <div className="space-y-4 md:space-y-6 text-[#1a1a1a]/80 font-serif text-sm md:text-lg leading-relaxed">
                            <p className="font-display italic text-black text-lg md:text-2xl leading-tight">
                                "{t('guardian.quote')}"
                            </p>
                            <p className="px-2 md:px-0">
                                {t('guardian.p1')} <span className="text-black font-bold">{t('guardian.p1_highlight')}</span>
                            </p>
                            <p className="px-2 md:px-0">
                                {t('guardian.p2')}
                            </p>
                        </div>

                        {/* SUBTLE INTERACTIVE FOUNDER SIGNATURE */}
                        <div className="pt-8 md:pt-10 border-t border-black/5">
                            <button
                                onClick={onStoryClick}
                                className="group relative flex flex-col items-center gap-2 transition-all duration-700 mx-auto"
                            >
                                <span className="text-[8px] md:text-[9px] font-mono text-[#D4AF37] uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">{t('guardian.founder_label')}</span>
                                <div className="relative">
                                    <span className="text-xl md:text-3xl font-accent text-black uppercase tracking-wider group-hover:text-[#D4AF37] transition-all duration-700 group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                                        {t('guardian.founder_name')}
                                    </span>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-700"></div>
                                </div>
                                <div className="mt-2 md:mt-4 flex flex-col items-center gap-2">
                                    <span className="text-[9px] md:text-[10px] font-display italic text-[#1a1a1a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        {t('guardian.founder_cta')}
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

const LegalSeal = () => {
    const { t } = useTranslation();

    return (
        <div className="text-[9px] text-[#8C8C8C] font-sans font-medium leading-relaxed tracking-wide mx-auto">
            <p className="uppercase text-[#D4AF37] mb-1 tracking-widest">{t('guardian.seal_title')}</p>
            <p>{t('guardian.seal_company')}</p>
            <p>{t('guardian.seal_address')}</p>
            <p>{t('guardian.seal_ateco')}</p>
        </div>
    );
};

export default TheGuardian;
