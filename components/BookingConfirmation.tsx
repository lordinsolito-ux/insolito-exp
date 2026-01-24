
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

  const handleWhatsAppNotify = () => {
    const message = `Salve Michael, ho appena inviato una richiesta di disponibilità via web per il servizio ${serviceName} il ${new Date(formData.date).toLocaleDateString()}. Nome: ${formData.name}. In attesa di riscontri ufficiali.`;
    window.open(`https://wa.me/393456157070?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6 z-[300]">
      {/* 65% Scale Container - Precisely Calibrated */}
      <div className="relative bg-[#050505] border border-white/10 rounded-sm shadow-[0_25px_80px_rgba(0,0,0,0.9)] max-w-[440px] w-full p-8 md:p-12 text-center animate-reveal overflow-hidden">
        {/* Subtle Luxury Decoration */}
        <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--milano-bronzo)]/5 blur-[80px] rounded-full -mr-24 -mt-24 pointer-events-none" />

        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white/[0.01] border border-[var(--milano-bronzo)]/40 flex items-center justify-center relative">
            <Clock className="w-6 h-6 text-[var(--milano-bronzo)] animate-pulse" strokeWidth={1.5} />
            <div className="absolute -top-0.5 -right-0.5">
              <span className="flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--milano-bronzo)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--milano-bronzo)]"></span>
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-xl md:text-3xl font-display text-white italic mb-2 tracking-tight">Protocollo in Analisi</h2>
        <div className="inline-block bg-[var(--milano-bronzo)]/5 text-[var(--milano-bronzo)] border border-[var(--milano-bronzo)]/20 px-4 py-1.5 rounded-sm text-[8px] uppercase font-bold tracking-[0.4em] mb-8">
          Status: Verifica Disponibilità Fiduciaria
        </div>

        <div className="text-gray-400 font-light leading-relaxed font-sans uppercase tracking-[0.12em] text-[10px] mb-10">
          Grazie, <span className="text-white font-bold italic">Egregio {formData.name}</span>. <br />
          La Sua richiesta è stata acquisita dai nostri protocolli riservati. <br />
          Il team sta analizzando la fattibilità dell&apos;incarico e la sincronizzazione logistica necessaria.
        </div>

        <div className="space-y-4 text-left bg-white/[0.01] p-6 rounded-sm border border-white/5 mb-10">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Mandato Richiesto</span>
            <span className="text-[10px] text-white/80 font-accent uppercase tracking-widest">{serviceName}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Pianificazione</span>
            <span className="text-[10px] text-white/80 font-accent uppercase tracking-widest">
              {new Date(formData.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })} @ {formData.time}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Onorario Stimato</span>
            <span className="text-[var(--milano-bronzo)] font-accent text-xl tracking-tighter">€{formData.estimatedPrice}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleWhatsAppNotify}
            className="w-full py-4 bg-[var(--milano-bronzo)] text-white font-accent text-[9px] uppercase tracking-[0.4em] hover:brightness-110 active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-3"
          >
            Notifica il Guardian via WhatsApp
          </button>
          <button
            onClick={onReset}
            className="w-full py-4 bg-transparent text-white/20 hover:text-white/50 font-mono text-[8px] uppercase tracking-[0.4em] transition-all"
          >
            Chiudi Sessione
          </button>
        </div>

        <div className="mt-8 flex gap-3 text-left opacity-20 hover:opacity-100 transition-opacity cursor-default">
          <AlertCircle className="w-3.5 h-3.5 text-[var(--milano-bronzo)] shrink-0" />
          <p className="text-[8px] font-mono text-white uppercase tracking-widest leading-relaxed">
            In caso di esito positivo, riceverà via email la proposta formale fiduciaria con il link dedicato al perfezionamento del mandato tramite Stripe.
          </p>
        </div>
      </div>
    </div>
  );
};
