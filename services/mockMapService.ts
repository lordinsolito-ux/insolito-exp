
import { LocationSuggestion, RouteInfo, ServiceTypeId, VehicleTypeId, PriceBreakdown } from '../types';
import { MOCK_LOCATIONS, VEHICLE_TYPES } from '../constants';

// --- GEOSPATIAL DATABASE ---
// Real GPS coordinates for key points in the service area
const COORDINATES: Record<string, { lat: number; lon: number }> = {
  // Airports
  'mxp': { lat: 45.6306, lon: 8.7281 },
  'malpensa': { lat: 45.6306, lon: 8.7281 },
  'lin': { lat: 45.4522, lon: 9.2762 },
  'linate': { lat: 45.4522, lon: 9.2762 },
  'bgy': { lat: 45.6701, lon: 9.7006 },
  'orio': { lat: 45.6701, lon: 9.7006 },

  // Cities
  'milano': { lat: 45.4642, lon: 9.1900 },
  'milan': { lat: 45.4642, lon: 9.1900 },
  'stazione centrale': { lat: 45.4859, lon: 9.2047 },
  'duomo': { lat: 45.4641, lon: 9.1919 },
  'bergamo': { lat: 45.6983, lon: 9.6773 },
  'città alta': { lat: 45.7042, lon: 9.6631 },
  'como': { lat: 45.8081, lon: 9.0852 },
  'bellagio': { lat: 45.9815, lon: 9.2520 },
  'lugano': { lat: 46.0037, lon: 8.9511 },
  'monza': { lat: 45.5845, lon: 9.2744 },
  'brescia': { lat: 45.5416, lon: 10.2118 },

  // Venues
  'fiera': { lat: 45.5222, lon: 9.0746 }, // Rho
  'san siro': { lat: 45.4781, lon: 9.1240 },
};

// Helper: Haversine Formula for distance between two points on Earth
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

// Helper: Attempt to find coordinates in an address string
const findCoordinates = (address: string): { lat: number, lon: number } | null => {
  const lower = address.toLowerCase();

  // 1. Direct match in dictionary keys
  for (const [key, coords] of Object.entries(COORDINATES)) {
    if (lower.includes(key)) return coords;
  }

  // 2. Fallback logic for generic streets in known cities/provinces
  if (lower.includes('milano') || lower.includes('milan') || lower.includes(' mi')) {
    return { lat: 45.4642 + (Math.random() * 0.04 - 0.02), lon: 9.1900 + (Math.random() * 0.04 - 0.02) };
  }
  if (lower.includes('bergamo') || lower.includes(' bg')) {
    return { lat: 45.6983 + (Math.random() * 0.03 - 0.015), lon: 9.6773 + (Math.random() * 0.03 - 0.015) };
  }
  if (lower.includes('monza') || lower.includes(' mb')) {
    return { lat: 45.5845 + (Math.random() * 0.03 - 0.015), lon: 9.2744 + (Math.random() * 0.03 - 0.015) };
  }
  if (lower.includes('como') || lower.includes(' co')) {
    return { lat: 45.8081 + (Math.random() * 0.03 - 0.015), lon: 9.0852 + (Math.random() * 0.03 - 0.015) };
  }
  if (lower.includes('varese') || lower.includes(' va')) {
    return { lat: 45.8206 + (Math.random() * 0.03 - 0.015), lon: 8.8251 + (Math.random() * 0.03 - 0.015) };
  }

  // 3. Generic Fallback for any "Via" address in Lombardy area (approximate)
  if (lower.includes('via ') || lower.includes('piazza ') || lower.includes('viale ')) {
    // Return a random point in the Milan-Bergamo-Monza triangle
    return { lat: 45.55 + (Math.random() * 0.1), lon: 9.4 + (Math.random() * 0.3) };
  }

  return null;
};

// --- API FUNCTIONS ---

// Simulate autocomplete delay
export const searchLocations = async (query: string): Promise<LocationSuggestion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query || query.length < 2) return resolve([]);
      const lowerQuery = query.toLowerCase();

      // 1. Search in hardcoded database
      const staticResults = MOCK_LOCATIONS.filter(
        loc => loc.shortAddress.toLowerCase().includes(lowerQuery) ||
          loc.fullAddress.toLowerCase().includes(lowerQuery)
      );

      // 2. Dynamic "Street" Generator - but only if no good static results
      const dynamicResults: LocationSuggestion[] = [];

      if (staticResults.length < 3 && query.length > 3) {
        // Detect which city the user is typing about
        let suggestedCity = '';
        let suggestedRegion = '';
        let isGeneric = false;

        // Check if user already mentioned a city in their query
        if (lowerQuery.includes('bergamo') || lowerQuery.includes(' bg')) {
          suggestedCity = 'Bergamo';
          suggestedRegion = 'BG, Italy';
        } else if (lowerQuery.includes('milan') || lowerQuery.includes('milano') || lowerQuery.includes(' mi')) {
          suggestedCity = 'Milan';
          suggestedRegion = 'MI, Italy';
        } else if (lowerQuery.includes('como') || lowerQuery.includes(' co')) {
          suggestedCity = 'Como';
          suggestedRegion = 'CO, Italy';
        } else if (lowerQuery.includes('brescia') || lowerQuery.includes(' bs')) {
          suggestedCity = 'Brescia';
          suggestedRegion = 'BS, Italy';
        } else if (lowerQuery.includes('monza') || lowerQuery.includes(' mb')) {
          suggestedCity = 'Monza';
          suggestedRegion = 'MB, Italy';
        } else if (lowerQuery.includes('varese') || lowerQuery.includes(' va')) {
          suggestedCity = 'Varese';
          suggestedRegion = 'VA, Italy';
        } else if (lowerQuery.includes('lecco') || lowerQuery.includes(' lc')) {
          suggestedCity = 'Lecco';
          suggestedRegion = 'LC, Italy';
        } else if (lowerQuery.includes('lodi') || lowerQuery.includes(' lo')) {
          suggestedCity = 'Lodi';
          suggestedRegion = 'LO, Italy';
        } else if (lowerQuery.includes('pavia') || lowerQuery.includes(' pv')) {
          suggestedCity = 'Pavia';
          suggestedRegion = 'PV, Italy';
        } else {
          // If no specific city detected, treat as a generic address search
          // Do NOT force Bergamo if the user might be typing a full address
          isGeneric = true;
          suggestedRegion = 'Italy';
        }

        // Only create ONE suggestion for the detected city
        // If generic, just show what the user typed + Italy
        const fullAddr = isGeneric
          ? `${query.trim()}, ${suggestedRegion}`
          : (lowerQuery.includes(suggestedCity.toLowerCase())
            ? `${query.trim()}, ${suggestedRegion.split(',')[0]}` // City already in query
            : `${query.trim()}, ${suggestedCity}, ${suggestedRegion}`);

        dynamicResults.push({
          id: `dyn_${Date.now()}`,
          shortAddress: `${query.trim()}`,
          fullAddress: fullAddr,
          type: 'city'
        });
      }

      // Combine and return (max 5 results to avoid overwhelming the user)
      const allResults = [...staticResults, ...dynamicResults].slice(0, 5);
      resolve(allResults);
    }, 200);
  });
};

export const calculateRoute = async (origin: string, destination: string, stops: string[] = []): Promise<RouteInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startCoords = findCoordinates(origin);
      const endCoords = findCoordinates(destination);

      let distance = 0;
      let duration = 0;
      let traffic: 'low' | 'moderate' | 'heavy' = 'moderate';

      if (startCoords && endCoords) {
        // Calculate main leg
        const airDistance = getDistanceFromLatLonInKm(
          startCoords.lat, startCoords.lon,
          endCoords.lat, endCoords.lon
        );

        // Add dummy distance for stops (simulation)
        // In a real app, we would geocode stops and add segments
        const stopPenaltyKm = stops.length * 8;

        const roadFactor = 1.4; // Slightly increased winding factor for Italian roads
        distance = Math.round((airDistance * roadFactor) + stopPenaltyKm);

        if (distance < 3) distance = 3;

        let averageSpeed = 0;
        const o = origin.toLowerCase();
        const d = destination.toLowerCase();

        // --- REALISTIC SPEED ALGORITHM FOR MILAN/BERGAMO ---

        const isCityCenter = (o.includes('milano') || o.includes('milan') || d.includes('milano') || d.includes('milan') || o.includes('bergamo') || d.includes('bergamo'));

        if (distance > 60) {
          averageSpeed = 100; // Highway speed
          traffic = 'low';
        } else if (distance > 20) {
          averageSpeed = 55; // Mix of city/highway
          traffic = 'moderate';
        } else {
          // Short city trips
          averageSpeed = 18; // Very slow in city
          traffic = 'heavy';
        }

        // Specific penalty for Milan/Bergamo centers
        if (isCityCenter && distance < 15) {
          averageSpeed = 15; // Even slower
          traffic = 'heavy';
        }

        // Calculate base duration
        let calculatedDuration = Math.round((distance / averageSpeed) * 60);

        // --- TRAFFIC BUFFER & REALITY CHECK ---
        // Add random "chaos" time for traffic lights, parking, and congestion
        // For short trips, this is significant.
        if (distance < 20) {
          const minBuffer = 5;
          const maxBuffer = 12;
          const trafficBuffer = Math.floor(Math.random() * (maxBuffer - minBuffer + 1)) + minBuffer;
          calculatedDuration += trafficBuffer;
        }

        // Add time for stops (boarding/alighting)
        calculatedDuration += (stops.length * 15);

        duration = calculatedDuration;

      } else {
        // Fallback for unknown locations
        const seed = origin.length + destination.length;
        distance = 10 + (seed % 50) + (stops.length * 5);
        duration = Math.round(distance * 3); // Conservative fallback
      }

      resolve({
        distance,
        duration,
        traffic,
        toll: distance > 20,
        mapUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${stops.length > 0 ? '&waypoints=' + stops.map(s => encodeURIComponent(s)).join('|') : ''}`
      });
    }, 800);
  });
};

export const calculatePrice = (
  serviceType: ServiceTypeId,
  vehicleId: VehicleTypeId,
  distanceKm: number,
  timeString: string,
  hasPets: boolean,
  numberOfStops: number = 0,
  dateString?: string
): PriceBreakdown => {
  // TIERED PRICING SYSTEM
  const stopFeeRate = 20; // Cost per extra stop

  let serviceMultiplier = 1;
  if (serviceType === ServiceTypeId.WEDDING) serviceMultiplier = 1.8;
  if (serviceType === ServiceTypeId.HOURLY) serviceMultiplier = 1.2;

  const vehicle = VEHICLE_TYPES.find(v => v.id === vehicleId);
  const vehicleMultiplier = vehicle ? vehicle.basePriceMultiplier : 1;

  // 1. TIERED DISTANCE PRICING
  let baseRate = 0;
  let rawDistancePrice = 0;

  if (distanceKm <= 7) {
    // Tier 1: 0-7 km = 25€ flat
    baseRate = 25;
    rawDistancePrice = 0;
  } else if (distanceKm <= 50) {
    // Tier 2: 7-50 km = 25€ + 2€/km extra
    baseRate = 25;
    const extraKm = distanceKm - 7;
    rawDistancePrice = extraKm * 2;
  } else {
    // Tier 3: 50+ km = 100€ + 2.5€/km extra
    baseRate = 100;
    const extraKm = distanceKm - 50;
    rawDistancePrice = extraKm * 2.5;
  }

  // 2. Stop Fee
  const stopFee = numberOfStops * stopFeeRate;

  // 3. Night & Holiday Surcharge (30%)
  let surcharge = 0;
  let isSurchargeApplied = false;

  // Check Night (00:00 - 06:30)
  if (timeString) {
    const [hStr, mStr] = timeString.split(':');
    const hour = parseInt(hStr, 10);
    const minute = parseInt(mStr, 10);

    if (hour < 6 || (hour === 6 && minute <= 30)) {
      isSurchargeApplied = true;
    }
  }

  // Check Sunday
  if (dateString) {
    const date = new Date(dateString);
    if (date.getDay() === 0) { // 0 is Sunday
      isSurchargeApplied = true;
    }
  }

  if (isSurchargeApplied) {
    surcharge = (baseRate + rawDistancePrice + stopFee) * 0.30;
  }

  // 4. Pet Fee
  const petFee = hasPets ? 15 : 0;

  const subtotal = (baseRate + rawDistancePrice + stopFee + surcharge) * serviceMultiplier * vehicleMultiplier;
  const total = Math.ceil((subtotal + petFee) / 5) * 5; // Round to nearest 5€

  return {
    baseFare: baseRate,
    distanceFare: Math.round(rawDistancePrice),
    nightSurcharge: Math.round(surcharge),
    petFee: petFee,
    stopFee: stopFee,
    serviceMultiplier,
    total
  };
};
