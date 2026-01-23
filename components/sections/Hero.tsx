import React from 'react';
import { ChevronDown, MousePointer2 } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HeroProps {
    isScrolled: boolean;
    onAdminLogin: () => void;
    onArchiveClick: () => void;
    onEnterClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ isScrolled, onAdminLogin, onArchiveClick, onEnterClick }) => {
    const { t } = useTranslation();

    // Mouse tracking for Shadow Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth the mouse movement
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        // Normalize coordinates to -1 to 1
        mouseX.set((clientX / innerWidth) * 2 - 1);
        mouseY.set((clientY / innerHeight) * 2 - 1);
    };
    return (
        <header
            onMouseMove={handleMouseMove}
            className={`relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-black py-24 transition-all duration-1000 ${isScrolled ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        >
            {/* DYNAMIC SHADOW MASK (VIRAL READINESS) */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background: useTransform(
                        [springX, springY],
                        ([x, y]: any) => `radial-gradient(1000px circle at ${50 + x * 20}% ${50 + y * 20}%, rgba(212, 175, 53, 0.15), transparent 80%)`
                    )
                }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)] z-[1] pointer-events-none"></div>

            <nav className="flex items-center justify-between px-6 md:px-24 absolute top-8 md:top-12 left-0 w-full z-20">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="flex items-center gap-4 md:gap-6 group cursor-pointer"
                    onClick={onAdminLogin}
                >
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-700">
                        <div className="w-1 h-1 bg-[var(--milano-bronzo)] rounded-full"></div>
                    </div>
                    <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-[0.5rem] md:tracking-[0.8rem] group-hover:text-white transition-all duration-700 font-mono hidden sm:block">Index.01</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="flex items-center gap-6 md:gap-12"
                >
                    <button onClick={onArchiveClick} className="text-[9px] md:text-[10px] text-white/40 hover:text-white border-none tracking-[0.4rem] md:tracking-[0.6rem] font-mono uppercase">{t('hero.archive')}</button>
                    <LanguageSwitcher />
                </motion.div>
            </nav>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 space-y-10 md:space-y-12"
            >
                <div className="space-y-4 md:space-y-6">
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "2rem" }}
                        animate={{ opacity: 1, letterSpacing: "1.5em" }}
                        transition={{ duration: 2, delay: 0.2 }}
                        className="text-[9px] md:text-[10px] font-mono text-[var(--milano-bronzo)] tracking-[1rem] md:tracking-[1.5em] uppercase"
                    >
                        {t('hero.tagline')}
                    </motion.p>
                    <h1
                        style={{ fontSize: 'var(--text-hero)' }}
                        className="font-accent text-white tracking-tighter leading-none font-black uppercase max-w-[95vw] md:max-w-none"
                    >
                        {t('hero.headline1')}<br />
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.2 }}
                            transition={{ duration: 2, delay: 1 }}
                            className="text-white/20"
                        >
                            {t('hero.headline2')}
                        </motion.span>
                    </h1>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="flex flex-col items-center gap-6 md:gap-8"
                >
                    <div className="w-px h-16 md:h-24 bg-gradient-to-b from-[var(--milano-bronzo)] to-transparent"></div>
                    <h2
                        style={{ fontSize: 'var(--text-title-md)' }}
                        className="font-display text-white italic tracking-wide text-center"
                    >
                        {t('hero.subheadline')} <span className="text-[var(--milano-bronzo)] border-b border-[var(--milano-bronzo)]/30">{t('hero.subheadline_highlight')}</span>
                    </h2>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    onClick={onEnterClick}
                    className="group flex flex-col items-center gap-4 md:gap-6 pt-8 md:pt-12 touch-manipulation"
                >
                    <span className="text-[9px] md:text-[10px] font-mono text-white/20 group-hover:text-white tracking-[0.8rem] md:tracking-[1em] uppercase transition-all italic">{t('hero.cta')}</span>
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-white/10 group-hover:text-[var(--milano-bronzo)] group-hover:translate-y-2 transition-all duration-700" strokeWidth={1} />
                </motion.button>
            </motion.div>
        </header>
    );
};

export default Hero;
