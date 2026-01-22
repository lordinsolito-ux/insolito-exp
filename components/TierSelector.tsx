import React from 'react';
import { TierType } from '../types';
import { Check } from 'lucide-react';

interface TierSelectorProps {
    selectedTier: TierType | null;
    onSelectTier: (tier: TierType) => void;
    t: (key: string) => string;
}

interface TierCardData {
    type: TierType;
    emoji: string;
    name: string;
    price: string;
    duration: string;
    features: string[];
    badge?: string;
    gradient: string;
}

const TIER_DATA: TierCardData[] = [
    {
        type: 'essentials' as TierType,
        emoji: '⚡',
        name: 'Essentials',
        price: '€180/h',
        duration: 'Min 3 ore',
        features: [
            'Coordinamento Logistico Base',
            'Presidio Variabili Standard',
            'Assistenza Continuativa'
        ],
        gradient: 'from-blue-500/20 to-blue-600/20'
    },
    {
        type: 'signature' as TierType,
        emoji: '💎',
        name: 'Signature',
        price: '€280/h',
        duration: 'Min 4 ore',
        features: [
            'Tutto di Essentials +',
            'Protocollo Backup Automatico',
            'Guardian Notturno',
            'Priorità di Risposta'
        ],
        badge: '73% Clienti',
        gradient: 'from-gold-500/20 to-gold-600/20'
    },
    {
        type: 'elite' as TierType,
        emoji: '👑',
        name: 'Elite Retainer',
        price: '€6.000/mese',
        duration: 'Illimitato',
        features: [
            'Tutto di Signature +',
            'Linea Diretta H24',
            'Team Dedicato',
            'Disponibilità Senza Limiti'
        ],
        badge: 'Invitation Only',
        gradient: 'from-purple-500/20 to-purple-600/20'
    }
];

export const TierSelector: React.FC<TierSelectorProps> = ({ selectedTier, onSelectTier, t }) => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-display text-white tracking-tight italic mb-2">
                    Scegli il Tuo <span className="text-[var(--milano-bronzo)]">Tier</span>
                </h3>
                <p className="text-gray-400 text-sm">Seleziona il livello di assistenza che fa per te</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TIER_DATA.map((tier) => {
                    const isSelected = selectedTier === tier.type;

                    return (
                        <button
                            key={tier.type}
                            onClick={() => onSelectTier(tier.type)}
                            className={`relative group text-left p-6 rounded-xl border-2 transition-all duration-300 ${isSelected
                                ? 'border-[var(--milano-bronzo)] bg-gradient-to-br ' + tier.gradient + ' shadow-[0_0_30px_rgba(212,175,55,0.3)]'
                                : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                }`}
                        >
                            {/* Badge */}
                            {tier.badge && (
                                <div className="absolute -top-3 right-4 px-3 py-1 bg-[var(--milano-bronzo)] text-black text-[10px] font-bold uppercase tracking-wider rounded-full">
                                    {tier.badge}
                                </div>
                            )}

                            {/* Selected Indicator */}
                            {isSelected && (
                                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[var(--milano-bronzo)] rounded-full flex items-center justify-center shadow-lg">
                                    <Check className="w-5 h-5 text-black" />
                                </div>
                            )}

                            {/* Content */}
                            <div className="space-y-4">
                                {/* Header */}
                                <div>
                                    <div className="text-4xl mb-2">{tier.emoji}</div>
                                    <h4 className="text-xl font-bold text-white mb-1">{tier.name}</h4>
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-2xl font-bold text-[var(--milano-bronzo)]">{tier.price}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">{tier.duration}</div>
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-2">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                            <span className="text-[var(--milano-bronzo)] mt-0.5">•</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Legal Note */}
                                {tier.type === 'essentials' && (
                                    <div className="pt-3 border-t border-white/10">
                                        <p className="text-[9px] text-gray-500 italic leading-relaxed">
                                            Assistenza professionale ai sensi Art. 2222 C.C. - ATECO 96.99.99
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Hover Effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--milano-bronzo)]/0 to-[var(--milano-bronzo)]/0 group-hover:from-[var(--milano-bronzo)]/5 group-hover:to-[var(--milano-bronzo)]/10 transition-all duration-300 pointer-events-none" />
                        </button>
                    );
                })}
            </div>

            {/* Legal Disclaimer */}
            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-[10px] text-gray-400 leading-relaxed text-center">
                    <strong className="text-white">Nota Legale:</strong> Il compenso remunera esclusivamente servizi di lifestyle management, coordinamento logistico e assistenza continuativa.
                    L'eventuale supporto alla mobilità è prestazione meramente accessoria e strumentale all'assistenza globale, non scindibile dalla stessa (Art. 2222 C.C.).
                </p>
            </div>
        </div>
    );
};
