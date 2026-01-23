
import React from 'react';
import { CheckCircle, Home, Clock, AlertCircle } from 'lucide-react';
import { BookingFormData, BookingRecord } from '../types';
import { SERVICE_TYPES } from '../constants';

interface BookingConfirmationProps {
  formData: BookingFormData;
  onReset: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ formData, onReset }) => {
  const serviceName = formData.tier ? `${formData.tier.toUpperCase()}` : (SERVICE_TYPES.find(s => s.id === formData.serviceType)?.name || 'LIFESTYLE MANAGEMENT');

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(58,58,58,0.3),_transparent_70%)]"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.05]"></div>
      </div>

      <div className="relative z-10 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-sm shadow-2xl max-w-lg w-full p-8 md:p-12 text-center animate-fade-in">
        <div className="flex justify-center mb-10">
          <div className="w-24 h-24 rounded-full bg-[var(--milano-bronzo)]/5 border border-[var(--milano-bronzo)]/20 flex items-center justify-center shadow-[0_0_50px_rgba(139,115,85,0.1)] relative">
            <Clock className="w-10 h-10 text-[var(--milano-bronzo)] animate-pulse" />
            <div className="absolute top-0 right-0">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--milano-bronzo)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--milano-bronzo)]"></span>
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-display text-white italic mb-2 tracking-tight">Richiesta in Analisi</h2>
        <div className="inline-block bg-[var(--milano-bronzo)]/10 text-[var(--milano-bronzo)] border border-[var(--milano-bronzo)]/20 px-4 py-1.5 rounded-sm text-[10px] uppercase font-bold tracking-[0.3em] mb-10">
          Status: Verifica Disponibilità Fiduciaria
        </div>

        <p className="text-gray-400 text-sm mb-12 font-light leading-relaxed font-sans uppercase tracking-widest text-[10px]">
          Grazie, <span className="text-white font-bold">{formData.name}</span>. La sua richiesta di accesso è stata registrata con successo.
          Il nostro team sta verificando la fattibilità logistica dell'incarico.
        </p>

        <div className="space-y-5 text-left bg-white/[0.02] p-8 rounded-sm border border-white/5 mb-10">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em]">Servizio</span>
            <span className="text-sm text-white/80 font-accent uppercase">{serviceName}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em]">Data & Inizio</span>
            <span className="text-sm text-white/80 font-accent uppercase">{new Date(formData.date).toLocaleDateString()} @ {formData.time}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em]">Onorario</span>
            <span className="text-[var(--milano-bronzo)] font-accent text-2xl tracking-tighter">€{formData.estimatedPrice}</span>
          </div>
        </div>

        <div className="flex gap-4 mb-10 bg-white/[0.01] p-6 rounded-sm text-left border-l-2 border-[var(--milano-bronzo)]">
          <AlertCircle className="w-5 h-5 text-[var(--milano-bronzo)] shrink-0 mt-0.5" />
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
            <strong className="text-white block mb-2">Cosa succede ora?</strong>
            Analizzeremo i dettagli della sua missione. In caso di esito positivo, riceverà via email una proposta formale contenente il link di pagamento Stripe per confermare definitivamente l'intervento.
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full py-6 bg-white text-black font-accent text-[11px] uppercase tracking-[0.4em] hover:bg-[var(--milano-bronzo)] hover:text-white transition-all duration-700 shadow-xl"
        >
          <Home className="w-4 h-4 inline-block mr-3 -mt-1" /> Tornare alla Home
        </button>
      </div>
    </div>
  );
};
