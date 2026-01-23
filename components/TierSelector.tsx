import React from 'react';
import { TierType } from '../types';
import { Check, Zap, Star, Crown } from 'lucide-react';

interface TierSelectorProps {
    selectedTier: TierType | null;
    onSelectTier: (tier: TierType) => void;
    t: (key: string) => string;
}

interface TierCardData {
    type: TierType;
    icon: React.ElementType;
    name: string;
    price: string;
    duration: string;
    description: string;
    features: string[];
    badge?: string;
    highlighted?: boolean;
}

const TIER_DATA: TierCardData[] = [
    {
        type: 'essentials' as TierType,
        icon: Zap,
        name: 'Essentials',
        price: '€180/ORA',
        duration: 'MINIMO 3H CONSECUTIVE',
        description: 'Per chi esige un coordinamento impeccabile delle proprie necessità quotidiane.',
        features: [
            'PRESIDIO LOGISTICO ATTIVO',
            'ASSISTENZA DIRETTA MICHAEL',
            'PUNTUALITÀ MILLIMETRICA'
        ],
        badge: 'START HERE'
    },
    {
        type: 'signature' as TierType,
        icon: Star,
        name: 'Signature',
        price: '€280/ORA',
        duration: 'MINIMO 4H CONSECUTIVE',
        description: 'La massima espressione della serenità logistica: l\'imprevisto smette di esistere.',
        features: [
            'TUTTO DI ESSENTIALS, PIÙ:',
            'PROTOCOLLO BACKUP AUTOMATICO',
            'REATTIVITÀ LAST-MINUTE (4H)',
            'GUARDIAN NOTTURNO'
        ],
        badge: '73% CLIENTI',
        highlighted: true
    },
    {
        type: 'elite' as TierType,
        icon: Crown,
        name: 'Elite Retainer',
        price: '€6.000/MESE',
        duration: '24/7/365 ILLIMITATO',
        description: 'Per chi non vuole più pensare a "posso chiamarlo?".',
        features: [
            'LINEA DIRETTA PRIORITARIA H24',
            'NESSUN LIMITE DI ORE',
            'COORDINAMENTO TEAM DEDICATO'
        ],
        badge: 'INVITATION ONLY'
    }
];

export const TierSelector: React.FC<TierSelectorProps> = ({ selectedTier, onSelectTier, t }) => {
    return (
        <div className="space-y-12">
            <div className="text-center space-y-4">
                <h3 className="text-2xl md:text-3xl font-display text-white tracking-widest italic uppercase">
                    Protocollo <span className="text-[var(--milano-bronzo)]">Selezione</span>
                </h3>
                <div className="h-px w-24 bg-[var(--milano-bronzo)]/30 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TIER_DATA.map((tier) => {
                    const isSelected = selectedTier === tier.type;
                    const Icon = tier.icon;

                    return (
                        <button
                            key={tier.type}
                            onClick={() => onSelectTier(tier.type)}
                            className={`relative group flex flex-col p-8 md:p-10 border transition-all duration-700 text-left ${isSelected
                                ? 'border-[var(--milano-bronzo)] bg-[var(--milano-bronzo)]/[0.03] shadow-[0_30px_60px_-15px_rgba(139,115,85,0.2)] scale-[1.02]'
                                : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                                }`}
                        >
                            {/* Badge */}
                            {tier.badge && (
                                <div className={`absolute top-0 right-0 px-4 py-1.5 text-[8px] font-mono font-bold uppercase tracking-[0.2em] ${tier.highlighted ? 'bg-[var(--milano-bronzo)] text-white' : 'bg-white/10 text-white/40'}`}>
                                    {tier.badge}
                                </div>
                            )}

                            <div className="space-y-10 flex-1">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-2xl md:text-3xl font-accent text-white tracking-tighter uppercase">{tier.name}</h4>
                                        <Icon className={`w-6 h-6 ${isSelected ? 'text-[var(--milano-bronzo)]' : 'text-white/20'}`} />
                                    </div>
                                    <p className="text-[9px] font-mono text-white/30 uppercase leading-relaxed tracking-wider h-12">
                                        {tier.description}
                                    </p>
                                </div>

                                <div className="py-10 border-y border-white/5 group-hover:border-[var(--milano-bronzo)]/20 transition-colors duration-700">
                                    <div className="text-3xl md:text-4xl lg:text-5xl font-accent text-white tracking-tighter mb-2 leading-none">{tier.price}</div>
                                    <div className="text-[8px] font-mono text-white/30 tracking-[0.3em] uppercase">{tier.duration}</div>
                                </div>

                                <div className="space-y-6">
                                    <ul className="space-y-4">
                                        {tier.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-[10px] font-mono text-white/60 tracking-wider">
                                                <Check className="w-3 h-3 text-[var(--milano-bronzo)] shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Selection Effect Indicator */}
                            <div className={`mt-10 py-4 border text-[10px] font-accent uppercase tracking-[0.4em] transition-all duration-700 text-center ${isSelected
                                ? 'bg-[var(--milano-bronzo)] border-[var(--milano-bronzo)] text-white'
                                : 'border-white/10 text-white/40 group-hover:border-white/30 group-hover:text-white'
                                }`}>
                                {isSelected ? 'Protocollo Attivo' : 'Seleziona Protocollo'}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Legal Disclaimer */}
            <div className="mt-6 p-8 border border-white/5 bg-white/[0.01]">
                <p className="text-[9px] font-mono text-white/25 leading-relaxed text-center uppercase tracking-widest">
                    <strong className="text-white/40">Nota Legale:</strong> Il compenso remunera esclusivamente servizi di lifestyle management, coordinamento logistico e assistenza continuativa.
                    L'eventuale supporto alla mobilità è prestazione meramente accessoria e strumentale all'assistenza globale, non scindibile dalla stessa (Art. 2222 C.C.).
                </p>
            </div>
        </div>
    );
};
