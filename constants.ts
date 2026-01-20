
import {
  Plane,
  Clock,
  Map as MapIcon,
  GlassWater,
  Heart,
  Sparkles,
} from 'lucide-react';
import { ServiceType, ServiceTypeId, VehicleType, VehicleTypeId, LocationSuggestion } from './types';

export const SERVICE_TYPES: ServiceType[] = [
  {
    id: ServiceTypeId.CITY_TO_CITY,
    name: 'Luxury Commuting Assistant',
    description: 'Spostamenti a lungo raggio gestiti con la massima cura. Il tuo tempo diventa produttivo o rigenerante.',
    icon: MapIcon,
    startingPrice: 25,
    badge: 'Best Value'
  },
  {
    id: ServiceTypeId.AIRPORT_TRANSFER,
    name: 'Airport Concierge & Greeting',
    description: 'Assistente personale dedicato per i tuoi arrivi e partenze (MXP, LIN, BGY). Accoglienza senza stress.',
    icon: Plane,
    popular: true,
    startingPrice: 25,
    badge: 'Most Popular'
  },
  {
    id: ServiceTypeId.HOURLY,
    name: 'Personal Concierge on Demand',
    description: 'A tua disposizione per meeting, shopping o qualsiasi necessità personale.',
    icon: Clock,
    startingPrice: 60
  },
  {
    id: ServiceTypeId.EVENT,
    name: 'Nightlife Guardian & Concierge',
    description: 'Gestione totale della tua serata. Presidio costante per un rientro sicuro alle prime luci dell\'alba.',
    icon: GlassWater,
    startingPrice: 90
  },
  {
    id: ServiceTypeId.WEDDING,
    name: 'Wedding Experience',
    description: 'Coordinamento esclusivo per il tuo grande giorno. Eleganza e precisione garantite.',
    icon: Heart,
    startingPrice: 250,
    badge: 'Premium'
  },
];

export const VEHICLE_TYPES: VehicleType[] = [
  {
    id: VehicleTypeId.SUV_COMFORT,
    name: 'Premium SUV Experience',
    description: 'Ambiente riservato e confortevole, perfetto per chi desidera privacy e spazio. Ideale per ogni occasione.',
    capacity: 4,
    luggage: 4,
    basePriceMultiplier: 1.0,
    imagePlaceholder: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpOvoID-6ooDrZNQzwdPhLQmtUHLwHwLjX9g&s',
  }
];

export const COUNTRY_CODES = [
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
];

// Expanded location database for a better "fake" autocomplete experience
export const MOCK_LOCATIONS: LocationSuggestion[] = [
  // Airports
  { id: 'mxp', shortAddress: 'Malpensa Airport (MXP)', fullAddress: 'Aeroporto di Milano-Malpensa, Ferno, VA', type: 'airport' },
  { id: 'lin', shortAddress: 'Linate Airport (LIN)', fullAddress: 'Aeroporto di Milano-Linate, Segrate, MI', type: 'airport' },
  { id: 'bgy', shortAddress: 'Orio al Serio (BGY)', fullAddress: 'Aeroporto Internazionale Il Caravaggio, Orio al Serio, BG', type: 'airport' },

  // Stations
  { id: 'centrale', shortAddress: 'Milan Central Station', fullAddress: 'Stazione Centrale, Piazza Duca d\'Aosta, Milano', type: 'city' },
  { id: 'garibaldi', shortAddress: 'Porta Garibaldi Station', fullAddress: 'Piazza Sigmund Freud, Milano', type: 'city' },
  { id: 'bg_station', shortAddress: 'Bergamo Station', fullAddress: 'Piazzale Guglielmo Marconi, Bergamo', type: 'city' },

  // Luxury Hotels Milan
  { id: 'fs_mi', shortAddress: 'Four Seasons Hotel', fullAddress: 'Via Gesù, 6/8, 20121 Milano MI', type: 'venue' },
  { id: 'bulgari', shortAddress: 'Bulgari Hotel', fullAddress: 'Via Privata Fratelli Gabba, 7b, Milano', type: 'venue' },
  { id: 'armani', shortAddress: 'Armani Hotel', fullAddress: 'Via Alessandro Manzoni, 31, Milano', type: 'venue' },
  { id: 'principe', shortAddress: 'Hotel Principe di Savoia', fullAddress: 'Piazza della Repubblica, 17, Milano', type: 'venue' },
  { id: 'mandarin', shortAddress: 'Mandarin Oriental', fullAddress: 'Via Andegari, 9, Milano', type: 'venue' },

  // Landmarks
  { id: 'duomo', shortAddress: 'Duomo di Milano', fullAddress: 'Piazza del Duomo, Milano', type: 'city' },
  { id: 'citta_alta', shortAddress: 'Bergamo Città Alta', fullAddress: 'Piazza Vecchia, Bergamo', type: 'city' },
  { id: 'como', shortAddress: 'Lake Como (Bellagio)', fullAddress: 'Bellagio, Como', type: 'city' },
  { id: 'fiera', shortAddress: 'Fiera Milano Rho', fullAddress: 'Strada Statale Sempione, 28, Rho MI', type: 'venue' },
  { id: 'san_siro', shortAddress: 'San Siro Stadium', fullAddress: 'Piazzale Angelo Moratti, Milano', type: 'venue' },
];
