import React, { useState, useEffect, useRef } from 'react';

interface IntroSplashProps {
    onFinish: () => void;
}

const IntroSplash: React.FC<IntroSplashProps> = ({ onFinish }) => {
    const [step, setStep] = useState(0); // 0: Start Button, 1: Black Silence, 2: Typewriter, 3: Logo Reveal, 4: Finish
    const [displayText, setDisplayText] = useState("");
    const fullText = "Il vero lusso non è quello che vedi. È quello che non vedi più.";
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
                    className="group relative z-10 flex flex-col items-center gap-12"
                >
                    <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center group-hover:border-[var(--milano-bronzo)]/30 transition-all duration-1000">
                        <div className="w-1 h-1 bg-white group-hover:bg-[var(--milano-bronzo)] rounded-full transition-all duration-700"></div>
                    </div>
                    <span className="text-[10px] font-mono text-white/20 tracking-[1em] uppercase group-hover:text-white/40 transition-all">Scomparire.</span>
                    <span className="absolute -bottom-12 text-[9px] font-display italic text-[var(--milano-bronzo)] animate-pulse tracking-widest">[ Clicca per entrare ]</span>
                </button>
            )}

            {/* STEP 1 is Pure Black (Automatic via handleStart -> step 1 -> useEffect timer) */}

            {step === 2 && (
                <div className="max-w-2xl px-12 text-center">
                    <p className="text-xl md:text-2xl font-mono text-white/70 leading-relaxed italic tracking-tight">
                        {displayText}
                        <span className="animate-pulse bg-white/50 w-2 h-6 inline-block ml-2"></span>
                    </p>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center gap-12 animate-reveal">
                    <div className="flex flex-col items-center gap-4">
                        <h1 className="text-6xl md:text-8xl font-accent text-white tracking-[0.4em] mb-4">INSOLITO</h1>
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-[var(--milano-bronzo)]/30 to-transparent"></div>
                        <p className="text-[10px] font-mono text-[var(--milano-bronzo)]/50 tracking-[1.5em] uppercase">L'Arte di Scomparire</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntroSplash;
