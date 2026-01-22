import { TierType } from '../types';

/**
 * Get user-facing service label based on tier
 */
export const getTierServiceLabel = (tier: TierType | null | undefined, legacyServiceType?: string | null): string => {
    // Handle tier-based system
    if (tier) {
        const tierStr = tier.toString().toLowerCase();
        switch (tierStr) {
            case 'essentials':
                return 'Tier Essentials - Assistenza Personale e Coordinamento Logistico';
            case 'signature':
                return 'Tier Signature - Lifestyle Management Premium';
            case 'elite':
                return 'Tier Elite Retainer - Assistenza Illimitata H24';
        }
    }

    // Fallback to legacy serviceType
    if (legacyServiceType) {
        const t = legacyServiceType.toLowerCase();
        if (t.includes('airport')) return 'Assistenza Lifestyle - Airport Connection';
        if (t.includes('hourly')) return 'Assistenza Personale Oraria (Hourly Disposal)';
        if (t.includes('city')) return 'Assistenza Lifestyle - City Transfer';
    }

    return 'Servizio Professionale di Lifestyle Management e Assistenza alla Persona';
};

/**
 * Get tier-specific features for invoice detail
 */
export const getTierFeatures = (tier: TierType | null | undefined): string[] => {
    const baseFeatures = [
        '• <strong>Coordinamento Logistico Integrato:</strong> Gestione flussi e tempistiche dell\'agenda personale.',
        '• <strong>Presidio e Gestione Variabili:</strong> Monitoraggio attivo degli imprevisti e supporto logistico prioritario.'
    ];

    if (!tier) return baseFeatures;

    const tierStr = tier.toString().toLowerCase();

    if (tierStr === 'signature') {
        return [
            ...baseFeatures,
            '• <strong>Protocollo Backup Automatico:</strong> Soluzioni alternative precaricate in tempo reale.',
            '• <strong>Guardian Notturno:</strong> Assistenza dedicata nelle fasce orarie sensibili.'
        ];
    }

    if (tierStr === 'elite') {
        return [
            ...baseFeatures,
            '• <strong>Linea Diretta Prioritaria H24:</strong> Accesso immediato senza limitazioni.',
            '• <strong>Team Dedicato:</strong> Coordinamento multi-operatore per complessità parallele.',
            '• <strong>Disponibilità Illimitata:</strong> Nessun vincolo orario o di durata.'
        ];
    }

    return baseFeatures;
};

/**
 * Get tier rates for pricing
 */
export const getTierRates = (tier: TierType): { hourlyRate: number; minHours: number } => {
    const tierStr = tier.toString().toLowerCase();

    switch (tierStr) {
        case 'essentials':
            return { hourlyRate: 180, minHours: 3 };
        case 'signature':
            return { hourlyRate: 280, minHours: 4 };
        case 'elite':
            return { hourlyRate: 6000, minHours: 0 }; // Monthly retainer
        default:
            return { hourlyRate: 180, minHours: 3 };
    }
};
