import React from 'react';

interface FloatingHeaderProps {
    onPhilosophy: () => void;
    onVision: () => void;
    onServices: () => void;
    onInquire: () => void;
    isScrolled: boolean;
}

const FloatingHeader: React.FC<FloatingHeaderProps> = ({
    onPhilosophy,
    onVision,
    onServices,
    onInquire,
    isScrolled
}) => {
    return (
        <header className={`fixed top-8 left-1/2 -translate-x-1/2 z-[150] w-[calc(100%-4rem)] max-w-4xl transition-all duration-1000 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full tracking-[2em]'}`}>
            <div className="backdrop-blur-xl bg-black/40 border border-white/5 rounded-full px-8 py-4 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={onPhilosophy}>
                    <img src="/logo-insolito.png" alt="Insolito Logo" className="w-5 h-5 object-contain filter brightness-[1.1]" />
                    <span className="text-[9px] font-accent text-white tracking-[0.5em] hidden md:block uppercase">Insolito Privé</span>
                </div>
                <nav className="flex items-center gap-8">
                    {[
                        { label: 'Essence', action: onPhilosophy },
                        { label: 'Vision', action: onVision },
                        { label: 'Portfolio', action: onServices },
                    ].map((item) => (
                        <button key={item.label} onClick={item.action} className="text-[9px] font-mono text-white/40 hover:text-white tracking-[0.4em] transition-colors uppercase">
                            {item.label}
                        </button>
                    ))}
                    <button onClick={onInquire} className="bg-white text-black text-[9px] font-accent px-6 py-2 rounded-full tracking-[0.4em] hover:bg-[var(--milano-bronzo)] hover:text-white transition-all ml-4">
                        Inquiry
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default FloatingHeader;
