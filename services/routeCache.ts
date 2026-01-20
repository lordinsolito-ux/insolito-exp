/**
 * Route Cache Service
 * Caches calculated routes to avoid recalculation
 */

export interface CachedRoute {
    from: string;
    to: string;
    distance: number;
    duration: number;
    traffic: 'low' | 'moderate' | 'heavy';
    toll: boolean;
    mapUrl: string;
    timestamp: number;
}

const CACHE_KEY = 'insolito_route_cache';
const CACHE_EXPIRY_HOURS = 24; // Cache expires after 24 hours

/**
 * Generate a unique key for a route
 */
const getRouteKey = (from: string, to: string): string => {
    return `${from.toLowerCase().trim()}::${to.toLowerCase().trim()}`;
};

/**
 * Get cached route if available and not expired
 */
export const getCachedRoute = (from: string, to: string): CachedRoute | null => {
    try {
        const cacheData = localStorage.getItem(CACHE_KEY);
        if (!cacheData) return null;

        const cache: Record<string, CachedRoute> = JSON.parse(cacheData);
        const key = getRouteKey(from, to);
        const cached = cache[key];

        if (!cached) return null;

        // Check if cache is expired
        const now = Date.now();
        const expiryTime = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
        if (now - cached.timestamp > expiryTime) {
            // Cache expired, remove it
            delete cache[key];
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            return null;
        }

        return cached;
    } catch (error) {
        console.error('Error reading route cache:', error);
        return null;
    }
};

/**
 * Save route to cache
 */
export const cacheRoute = (from: string, to: string, distance: number, duration: number, traffic: 'low' | 'moderate' | 'heavy', toll: boolean, mapUrl: string): void => {
    try {
        const cacheData = localStorage.getItem(CACHE_KEY);
        const cache: Record<string, CachedRoute> = cacheData ? JSON.parse(cacheData) : {};

        const key = getRouteKey(from, to);
        cache[key] = {
            from,
            to,
            distance,
            duration,
            traffic,
            toll,
            mapUrl,
            timestamp: Date.now()
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Error saving route cache:', error);
    }
};

/**
 * Clear all cached routes
 */
export const clearRouteCache = (): void => {
    try {
        localStorage.removeItem(CACHE_KEY);
    } catch (error) {
        console.error('Error clearing route cache:', error);
    }
};
