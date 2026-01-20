
import React from 'react';
import { CheckCircle, Home, Clock, AlertCircle } from 'lucide-react';
import { BookingFormData, BookingRecord } from '../types';
import { SERVICE_TYPES } from '../constants';

interface BookingConfirmationProps {
  formData: BookingFormData;
  onReset: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ formData, onReset }) => {
  const serviceName = SERVICE_TYPES.find(s => s.id === formData.serviceType)?.name;

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gray-900"></div>
          <img 
            src="https://s2.best-wallpaper.net/wallpaper/iphone/1801/Milan-Italy-night-river-lights-city_iphone_320x480.jpg" 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
        </div>

        <div className="relative z-10 bg-black/60 backdrop-blur-xl border border-gold-900/50 rounded-xl shadow-2xl max-w-lg w-full p-8 md:p-12 text-center animate-fade-in">
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gold-900/10 border-2 border-gold-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.1)] relative">
                    <Clock className="w-10 h-10 text-gold-400 animate-pulse" />
                    <div className="absolute top-0 right-0">
                       <span className="flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-500"></span>
                        </span>
                    </div>
                </div>
            </div>

            <h2 className="text-3xl font-display text-gold-200 mb-2 tracking-wide">Request Received</h2>
            <div className="inline-block bg-yellow-900/30 text-yellow-500 border border-yellow-800/50 px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest mb-6">
               Status: Pending Approval
            </div>

            <p className="text-gray-400 text-sm mb-8 font-light leading-relaxed">
               Thank you, <span className="text-white">{formData.name}</span>. Your booking request has been securely received. 
               We are verifying availability for the selected time slot.
            </p>

            <div className="space-y-4 text-left bg-black/40 p-6 rounded border border-white/5 mb-8">
                <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Service</span>
                    <span className="text-gray-300">{serviceName}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Date & Time</span>
                    <span className="text-gray-300">{new Date(formData.date).toLocaleDateString()} at {formData.time}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Est. Total</span>
                    <span className="text-gold-400 font-display text-lg">€{formData.estimatedPrice}</span>
                </div>
            </div>

            <div className="flex gap-4 mb-8 bg-gray-900/50 p-4 rounded text-left border-l-2 border-gold-500">
               <AlertCircle className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
               <div className="text-xs text-gray-400">
                  <strong className="text-gray-200 block mb-1">What happens next?</strong>
                  You will receive a confirmation message via WhatsApp shortly. If the time is unavailable, we will propose an alternative.
               </div>
            </div>

            <button 
                onClick={onReset}
                className="w-full py-4 bg-gray-800 text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-gold-600 hover:text-black transition-all flex items-center justify-center gap-3 shadow-lg border border-white/10"
            >
                <Home className="w-4 h-4" /> Return Home
            </button>
        </div>
    </div>
  );
};
