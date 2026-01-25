import React, { useState, useEffect, useRef } from 'react';

interface IntroSplashProps {
    onFinish: () => void;
}

const IntroSplash: React.FC<IntroSplashProps> = ({ onFinish }) => {
    const [step, setStep] = useState(0); // 0: Start Button, 1: Black Silence, 2: Typewriter, 3: Logo Reveal, 4: Finish
    const [displayText, setDisplayText] = useState("");
    const fullText = "Il vero lusso non è quello che vedi. È l'arte di scomparire per lasciare spazio alla tua libertà.";
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioSrc = "https://www.dropbox.com/scl/fi/trkgfjejfgayjdkgqvt75/Drive-in-Style.mp3?rlkey=ep7dkuq7hl7swnpys0m1p7c6a&e=1&st=ccy55v2q&raw=1";

    useEffect(() => {
        if (step === 1) {
            // 3 seconds of pure silence and black screen
            const timer = setTimeout(() => setStep(2), 3000);
            return () => clearTimeout(timer);
        }
        if (step === 2) {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayText(fullText.slice(0, i));
                i++;
                if (i > fullText.length) {
                    clearInterval(interval);
                    setTimeout(() => setStep(3), 2000);
                }
            }, 70);
            return () => clearInterval(interval);
        }
        if (step === 3) {
            setTimeout(() => {
                setStep(4);
                setTimeout(onFinish, 2500);
            }, 3000);
        }
    }, [step, onFinish]);

    const handleStart = async () => {
        setStep(1);
        if (audioRef.current) {
            audioRef.current.volume = 0.15;
            try { await audioRef.current.play(); } catch (err) { console.error(err); }
        }
    };

    return (
        <div className={`fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center transition-opacity duration-[2000ms] ${step === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <audio ref={audioRef} src={audioSrc} preload="auto" />

            {/* NOISE OVERLAY - Subtle grain */}
            <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none"></div>

            {step === 0 && (
                <button
                    onClick={handleStart}
                    className="group relative z-10 flex flex-col items-center gap-10 md:gap-12 px-10 py-20"
                >
                    <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center transition-all duration-1000">
                        <img
                            src="/logo-insolito.png"
                            alt="Insolito Privé"
                            className="w-full h-full object-contain filter brightness-[1.2] drop-shadow-[0_0_20px_rgba(139,115,85,0.2)] group-hover:drop-shadow-[0_0_30px_rgba(139,115,85,0.4)] transition-all duration-700"
                        />
                    </div>
                    <span className="text-[11px] md:text-[10px] font-mono text-[var(--milano-bronzo)]/40 tracking-[0.8rem] md:tracking-[1.2rem] uppercase group-hover:text-[var(--milano-bronzo)] transition-all duration-700">L'arte di Scomparire.</span>
                    <span className="absolute -bottom-16 md:-bottom-16 text-[10px] md:text-[10px] font-display italic text-[var(--milano-bronzo)] tracking-[0.2em] px-8 py-3 bg-black flex flex-col items-center">
                        <span className="relative z-10">[ ENTER ]</span>
                        {/* Shimmer/Glossy Glow Effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full animate-shimmer pointer-events-none"></span>
                        <span className="absolute inset-0 bg-[var(--milano-bronzo)]/10 blur-xl animate-pulse-slow"></span>
                    </span>
                </button>
            )}

            {/* STEP 1 is Pure Black */}

            {step === 2 && (
                <div className="max-w-xl px-10 text-center">
                    <p className="text-lg md:text-2xl font-mono text-white/70 leading-relaxed italic tracking-tight">
                        {displayText}
                        <span className="animate-pulse bg-white/50 w-2 h-5 md:h-6 inline-block ml-2"></span>
                    </p>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center gap-10 md:gap-12 animate-reveal px-6 text-center">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-32 h-32 md:w-48 md:h-48 mb-4">
                            <img
                                src="/logo-insolito.png"
                                alt="Insolito Privé"
                                className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(139,115,85,0.3)]"
                            />
                        </div>
                        <h1 className="text-5xl md:text-8xl font-accent text-white tracking-[0.3em] md:tracking-[0.4em] mb-4">INSOLITO Privè</h1>
                        <div className="h-px w-20 md:w-24 bg-gradient-to-r from-transparent via-[var(--milano-bronzo)]/30 to-transparent"></div>
                        <p className="text-[9px] md:text-[10px] font-mono text-[var(--milano-bronzo)] tracking-[1.2em] md:tracking-[1.5em] uppercase drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">L'Arte di Scomparire</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntroSplash;
