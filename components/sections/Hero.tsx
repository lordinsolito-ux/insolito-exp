import React from 'react';
import { ChevronDown } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';

interface HeroProps {
    isScrolled: boolean;
    onAdminLogin: () => void;
    onArchiveClick: () => void;
    onEnterClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ isScrolled, onAdminLogin, onArchiveClick, onEnterClick }) => {
    return (
        <header className={`relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-transparent py-24 transition-all duration-1000 ${isScrolled ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <nav className="flex items-center justify-between px-6 md:px-24 absolute top-8 md:top-12 left-0 w-full z-20">
                <div className="flex items-center gap-4 md:gap-6 group cursor-pointer" onClick={onAdminLogin}>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-700">
                        <div className="w-1 h-1 bg-[var(--milano-bronzo)] rounded-full"></div>
                    </div>
                    <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-[0.5rem] md:tracking-[0.8rem] group-hover:text-white transition-all duration-700 font-mono hidden sm:block">Index.01</span>
                </div>
                <div className="flex items-center gap-6 md:gap-12">
                    <button onClick={onArchiveClick} className="text-[9px] md:text-[10px] text-white/40 hover:text-white border-none tracking-[0.4rem] md:tracking-[0.6rem] font-mono uppercase">Archive</button>
                    <LanguageSwitcher />
                </div>
            </nav>

            <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 space-y-10 md:space-y-12 animate-reveal">
                <div className="space-y-4 md:space-y-6">
                    <p className="text-[9px] md:text-[10px] font-mono text-[var(--milano-bronzo)] tracking-[1rem] md:tracking-[1.5em] uppercase">Insolito Privé Milano</p>
                    <h1 className="text-4xl md:text-[8rem] font-accent text-white tracking-tighter leading-none font-black uppercase max-w-[90vw] md:max-w-none">
                        Non siamo qui per<br /><span className="text-white/20">impressionarti.</span>
                    </h1>
                </div>

                <div className="flex flex-col items-center gap-6 md:gap-8">
                    <div className="w-px h-16 md:h-24 bg-gradient-to-b from-[var(--milano-bronzo)] to-transparent"></div>
                    <h2 className="text-xl md:text-5xl font-display text-white italic tracking-wide">Siamo qui per <span className="text-[var(--milano-bronzo)] border-b border-[var(--milano-bronzo)]/30">sparire.</span></h2>
                </div>

                <button
                    onClick={onEnterClick}
                    className="group flex flex-col items-center gap-4 md:gap-6 pt-8 md:pt-12 touch-manipulation"
                >
                    <span className="text-[9px] md:text-[10px] font-mono text-white/20 group-hover:text-white tracking-[0.8rem] md:tracking-[1em] uppercase transition-all italic">L'Arte di Scomparire</span>
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-white/10 group-hover:text-[var(--milano-bronzo)] group-hover:translate-y-2 transition-all duration-700" strokeWidth={1} />
                </button>
            </div>
        </header>
    );
};

export default Hero;
