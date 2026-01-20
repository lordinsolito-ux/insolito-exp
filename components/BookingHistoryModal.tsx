
import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Clock, Trash2, Crown } from 'lucide-react';
import { BookingRecord, ServiceTypeId } from '../types';
import { SERVICE_TYPES } from '../constants';

interface BookingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingHistoryModal: React.FC<BookingHistoryModalProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<BookingRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('insolito_bookings');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Sort by timestamp descending (newest first)
          const sorted = Array.isArray(parsed) ? parsed.sort((a: BookingRecord, b: BookingRecord) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ) : [];
          setHistory(sorted);
        } catch (e) {
          console.error("Failed to parse history", e);
        }
      }
    }
  }, [isOpen]);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your booking history?")) {
      localStorage.removeItem('insolito_bookings');
      setHistory([]);
    }
  };

  const getServiceName = (id: ServiceTypeId | null) => {
    return SERVICE_TYPES.find(s => s.id === id)?.name || 'Service';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity animate-fade-in" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-gray-900 border border-gold-500/30 w-full max-w-2xl max-h-[85vh] rounded-lg shadow-2xl flex flex-col animate-zoom-out z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gold-500/20 bg-black/40 rounded-t-lg">
          <div className="flex items-center gap-3">
             <Crown className="w-6 h-6 text-gold-500" />
            <div>
              <h2 className="text-xl font-display text-gold-400 tracking-wider">My Journeys</h2>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Booking History</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gold-400 transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20">
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                    <Clock className="w-12 h-12 mb-4 opacity-20" />
                    <p className="uppercase tracking-widest text-sm">No bookings found</p>
                </div>
            ) : (
                history.map((booking) => (
                    <div key={booking.id} className="bg-black/40 border border-white/5 p-5 rounded-lg hover:border-gold-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-gold-200 font-display text-lg mb-1">{getServiceName(booking.serviceType)}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(booking.date).toLocaleDateString()}
                                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                    {booking.time}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                                    booking.status === 'confirmed' ? 'border-green-900 text-green-500 bg-green-900/10' : 'border-gray-700 text-gray-500'
                                }`}>
                                    {booking.status}
                                </span>
                                <div className="text-lg font-display text-gold-400 mt-2">€{booking.estimatedPrice}</div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                             <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 flex-shrink-0"></div>
                                <div>
                                    <span className="text-[10px] text-gray-600 uppercase block mb-0.5">Pickup</span>
                                    <span className="text-sm text-gray-300 font-light">{booking.pickupLocation}</span>
                                </div>
                             </div>
                             <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-gold-900 border border-gold-500 mt-1.5 flex-shrink-0"></div>
                                <div>
                                    <span className="text-[10px] text-gray-600 uppercase block mb-0.5">Dropoff</span>
                                    <span className="text-sm text-gray-300 font-light">{booking.destination}</span>
                                </div>
                             </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
            <div className="p-4 border-t border-gold-500/20 bg-black/40 flex justify-end">
                <button 
                    onClick={clearHistory}
                    className="text-xs text-red-900 hover:text-red-500 flex items-center gap-2 transition-colors uppercase tracking-widest"
                >
                    <Trash2 className="w-3 h-3" /> Clear History
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
