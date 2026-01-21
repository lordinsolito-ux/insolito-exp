
import {
  Plane,
  Clock,
  Map as MapIcon,
  GlassWater,
  Heart,
  Sparkles,
} from 'lucide-react';
import { ServiceType, ServiceTypeId, VehicleType, VehicleTypeId, LocationSuggestion } from './types';

// Elite Service Definitions - INSOLITO EXPERIENCES
// No public pricing (Bespoke Pricing model)
export const SERVICE_TYPES: (ServiceType & { image: string })[] = [
  {
    id: ServiceTypeId.CITY_TO_CITY,
    name: 'Luxury Commuting Experience',
    description: 'Long-distance journeys managed with meticulous care. Your travel time becomes productive or regenerative.',
    icon: MapIcon,
    badge: 'Signature',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5962?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: ServiceTypeId.AIRPORT_TRANSFER,
    name: 'Airport Guest Support',
    description: 'Eliminiamo ogni attrito al tuo arrivo. Un assistente dedicato gestisce la tua accoglienza e il coordinamento logistico, garantendo una transizione fluida verso la tua destinazione.',
    icon: Plane,
    popular: true,
    badge: 'Most Requested',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f0?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: ServiceTypeId.HOURLY,
    name: 'Personal Concierge on Demand',
    description: 'Il tuo assistente personale a disposizione per commissioni, incontri d\'affari o shopping tour. Flessibilità totale per adattarsi ai tuoi ritmi.',
    icon: Clock,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: ServiceTypeId.EVENT,
    name: 'Nightlife Guardian',
    description: 'Vivi la notte di Milano e Bergamo senza compromessi. Presidio costante e assistenza dedicata per garantirti un\'esperienza esclusiva e un rientro protetto.',
    icon: GlassWater,
    badge: 'Elite',
    image: 'https://images.unsplash.com/photo-1514525253361-9034af3c2242?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: ServiceTypeId.WEDDING,
    name: 'Bespoke Wedding Concierge',
    description: 'Coordinamento esclusivo per il tuo grande giorno. Ogni dettaglio curato con eleganza e precisione impeccabile.',
    icon: Heart,
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop'
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

// Location database for autocomplete
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
