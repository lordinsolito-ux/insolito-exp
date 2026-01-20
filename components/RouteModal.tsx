import React, { useEffect, useState } from 'react';
import { X, MapPin, Navigation, Clock, TrendingUp, CheckCircle, RefreshCw } from 'lucide-react';
import { RouteInfo } from '../types';
import { useTranslation } from 'react-i18next';

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin: string;
  destination: string;
  routeInfo: RouteInfo | null;
  isCalculating: boolean;
}

export const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  origin,
  destination,
  routeInfo,
  isCalculating
}) => {
  const { t } = useTranslation();

  // Clear timer on manual close
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/30 rounded-2xl max-w-lg w-full shadow-2xl">
        {/* Header */}
        <div className="border-b border-gold-500/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-display tracking-[0.3em] text-gold-400">
                {t('modal.journey_details')}
              </h2>
              {!isCalculating && routeInfo && (
                <div className="flex items-center gap-2 text-green-400">
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    {t('modal.updated')}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gold-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-500 italic text-sm mt-2">
            {t('modal.itinerary_overview')}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Origin & Destination */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gold-500/10 rounded-full">
                <MapPin className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-xs text-gold-400 font-medium tracking-wider uppercase">{t('modal.origin')}</p>
                <p className="text-white text-lg font-light mt-1">{origin}</p>
              </div>
            </div>

            <div className="h-12 flex items-center justify-center">
              <div className="h-full w-px bg-gradient-to-b from-gold-500/50 to-transparent"></div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gold-500/10 rounded-full">
                <Navigation className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-xs text-gold-400 font-medium tracking-wider uppercase">{t('modal.destination')}</p>
                <p className="text-white text-lg font-light mt-1">{destination}</p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isCalculating && (
            <div className="bg-gradient-to-r from-gold-500/5 to-transparent border border-gold-500/20 rounded-xl p-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gold-400 text-sm tracking-wide uppercase">{t('modal.calculating')}</p>
              </div>
              <p className="text-gray-400 text-xs text-center mt-2">{t('modal.wait')}</p>
            </div>
          )}

          {/* Route Info */}
          {!isCalculating && routeInfo && (
            <>
              <div className="grid grid-cols-3 gap-4 bg-black/40 border border-gold-500/20 rounded-xl p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Navigation className="w-4 h-4 text-gold-400" />
                  </div>
                  <p className="text-2xl font-light text-white">{routeInfo.distance}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{t('modal.km')}</p>
                </div>

                <div className="text-center border-x border-gold-500/10">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-4 h-4 text-gold-400" />
                  </div>
                  <p className="text-2xl font-light text-white">{routeInfo.duration}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{t('modal.min')}</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-4 h-4 text-gold-400" />
                  </div>
                  <p className={`text-sm font-medium uppercase ${routeInfo.traffic === 'low' ? 'text-green-400' :
                    routeInfo.traffic === 'moderate' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                    {routeInfo.traffic}
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{t('modal.traffic')}</p>
                </div>
              </div>

              {/* Google Maps Embed or Link */}
              {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                <div className="w-full h-48 rounded-xl overflow-hidden border border-gold-500/20 shadow-inner">
                  <iframe
                    title="Route Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving`}
                  ></iframe>
                </div>
              ) : (
                <div className="flex justify-center">
                  <a
                    href={routeInfo.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gold-400 hover:text-gold-300 underline underline-offset-4 flex items-center gap-1 transition-colors"
                  >
                    <MapPin className="w-3 h-3" />
                    View on Google Maps
                  </a>
                </div>
              )}
            </>
          )}

          {/* Status message */}
          {!isCalculating && routeInfo && (
            <p className="text-center text-sm text-gold-400 italic">
              {t('modal.ready_to_close')}
            </p>
          )}
        </div>

        {/* Close & Continue Button */}
        {!isCalculating && routeInfo && (
          <div className="border-t border-gold-500/20 p-6">
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-medium py-3 rounded-full transition-all tracking-wider uppercase text-sm"
            >
              <span className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t('modal.close_continue')}</span>
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
