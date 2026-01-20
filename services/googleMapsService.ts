/// <reference types="@types/google.maps" />
import { LocationSuggestion, RouteInfo } from '../types';
import { searchLocations as mockSearchLocations, calculateRoute as mockCalculateRoute } from './mockMapService';

// Configuration
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const USE_MOCK = !API_KEY || API_KEY === '';

// Track loading state
let googleMapsLoaded = false;
let googleMapsLoading = false;

// Initialize Google Maps by loading script dynamically
const initGoogleMaps = async (): Promise<boolean> => {
    if (USE_MOCK) {
        console.warn('⚠️ Google Maps API key not found. Using mock service.');
        return false;
    }

    // Already loaded
    if (googleMapsLoaded) return true;

    // Currently loading
    if (googleMapsLoading) {
        // Wait for loading to complete
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (googleMapsLoaded) {
                    clearInterval(checkInterval);
                    resolve(true);
                }
            }, 100);
        });
    }

    googleMapsLoading = true;

    try {
        // Check if script already exists
        if (window.google && window.google.maps) {
            googleMapsLoaded = true;
            googleMapsLoading = false;
            return true;
        }

        // Load Google Maps script
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initGoogleMaps`;
            script.async = true;
            script.defer = true;

            // Global callback
            (window as any).initGoogleMaps = () => {
                googleMapsLoaded = true;
                googleMapsLoading = false;
                console.log('✅ Google Maps loaded successfully');
                resolve(true);
            };

            script.onerror = () => {
                googleMapsLoading = false;
                console.error('❌ Failed to load Google Maps');
                resolve(false);
            };

            document.head.appendChild(script);
        });
    } catch (error) {
        googleMapsLoading = false;
        console.error('❌ Failed to load Google Maps:', error);
        return false;
    }
};

/**
 * Search locations using Google Places Autocomplete
 * Falls back to mock service if API not available
 */
export const searchLocations = async (query: string): Promise<LocationSuggestion[]> => {
    // Initialize on first use
    const isReady = await initGoogleMaps();

    if (!isReady) {
        return mockSearchLocations(query);
    }

    if (!query || query.length < 2) return [];

    return new Promise((resolve) => {
        const service = new google.maps.places.AutocompleteService();

        const request: google.maps.places.AutocompletionRequest = {
            input: query,
            componentRestrictions: { country: 'it' },
            location: new google.maps.LatLng(45.4642, 9.1900),
            radius: 100000,
            types: ['geocode', 'establishment']
        };

        service.getPlacePredictions(request, (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
                console.warn('Places API returned no results, using mock');
                resolve(mockSearchLocations(query));
                return;
            }

            const suggestions: LocationSuggestion[] = predictions.map((prediction) => ({
                id: prediction.place_id,
                shortAddress: prediction.structured_formatting.main_text,
                fullAddress: prediction.description,
                type: prediction.types.includes('airport') ? 'airport' :
                    prediction.types.includes('train_station') ? 'station' : 'landmark'
            }));

            resolve(suggestions);
        });
    });
};

/**
 * Calculate route using Google Directions API
 * Falls back to mock service if API not available
 */
export const calculateRoute = async (
    origin: string,
    destination: string,
    stops: string[] = []
): Promise<RouteInfo> => {
    const isReady = await initGoogleMaps();

    if (!isReady) {
        return mockCalculateRoute(origin, destination, stops);
    }

    return new Promise((resolve) => {
        const service = new google.maps.DirectionsService();

        const waypoints: google.maps.DirectionsWaypoint[] = stops.map(stop => ({
            location: stop,
            stopover: true
        }));

        const request: google.maps.DirectionsRequest = {
            origin,
            destination,
            waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {
                departureTime: new Date(),
                trafficModel: google.maps.TrafficModel.BEST_GUESS
            },
            region: 'IT',
            unitSystem: google.maps.UnitSystem.METRIC
        };

        service.route(request, (result, status) => {
            if (status !== google.maps.DirectionsStatus.OK || !result) {
                console.warn('Directions API failed, using mock:', status);
                resolve(mockCalculateRoute(origin, destination, stops));
                return;
            }

            const route = result.routes[0];
            if (!route || !route.legs.length) {
                resolve(mockCalculateRoute(origin, destination, stops));
                return;
            }

            // Aggregate all legs
            let totalDistance = 0;
            let totalDuration = 0;

            route.legs.forEach((leg) => {
                if (leg.distance) totalDistance += leg.distance.value;
                if (leg.duration) totalDuration += leg.duration.value;
            });

            const distanceKm = Math.round(totalDistance / 1000);
            const durationMin = Math.round(totalDuration / 60);

            // Determine traffic level
            let traffic: 'low' | 'moderate' | 'heavy' = 'moderate';

            if (route.legs[0].duration_in_traffic) {
                const trafficDuration = route.legs[0].duration_in_traffic.value;
                const normalDuration = route.legs[0].duration?.value || trafficDuration;
                const trafficRatio = trafficDuration / normalDuration;

                if (trafficRatio < 1.1) traffic = 'low';
                else if (trafficRatio > 1.3) traffic = 'heavy';
            }

            // Check for tolls
            const hasTolls = route.legs.some((leg) =>
                leg.steps?.some((step) => step.instructions?.toLowerCase().includes('toll'))
            );

            // Generate Google Maps URL
            const waypointsParam = stops.length > 0
                ? '&waypoints=' + stops.map(s => encodeURIComponent(s)).join('|')
                : '';

            const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypointsParam}`;

            resolve({
                distance: distanceKm,
                duration: durationMin,
                traffic,
                toll: hasTolls || distanceKm > 20,
                mapUrl
            });
        });
    });
};

/**
 * Check if Google Maps is configured
 */
export const isGoogleMapsConfigured = (): boolean => {
    return !USE_MOCK && !!API_KEY;
};

// Export calculatePrice from mock service (no changes needed)
export { calculatePrice } from './mockMapService';
