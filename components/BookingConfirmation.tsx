
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
    const message = `Salve Michael, ho appena inviato una richiesta di disponibilità via web per il servizio ${serviceName} il ${new Date(formData.date).toLocaleDateString()}. Nome: ${formData.name}. In attesa di riscontro.`;
    window.open(`https://wa.me/393456157070?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black/40 backdrop-blur-md flex items-center justify-center p-6 z-[300]">
      <div className="relative bg-black border border-white/10 rounded-sm shadow-2xl max-w-sm w-full p-6 md:p-8 text-center animate-reveal overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--milano-bronzo)]/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[var(--milano-bronzo)]/5 border border-[var(--milano-bronzo)]/20 flex items-center justify-center relative">
            <Clock className="w-6 h-6 text-[var(--milano-bronzo)] animate-pulse" />
            <div className="absolute top-0 right-0">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--milano-bronzo)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--milano-bronzo)]"></span>
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-display text-white italic mb-1 tracking-tight">Richiesta in Analisi</h2>
        <div className="inline-block bg-[var(--milano-bronzo)]/10 text-[var(--milano-bronzo)] border border-[var(--milano-bronzo)]/20 px-3 py-1 rounded-sm text-[8px] uppercase font-bold tracking-[0.2em] mb-6">
          Status: Verifica Disponibilità
        </div>

        <div className="space-y-3 text-left bg-white/[0.02] p-5 rounded-sm border border-white/5 mb-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Servizio</span>
            <span className="text-xs text-white/80 font-accent uppercase">{serviceName}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Inizio</span>
            <span className="text-xs text-white/80 font-accent uppercase">{new Date(formData.date).toLocaleDateString()} @ {formData.time}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Onorario</span>
            <span className="text-[var(--milano-bronzo)] font-accent text-lg tracking-tighter">€{formData.estimatedPrice}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleWhatsAppNotify}
            className="w-full py-4 bg-[var(--milano-bronzo)] text-white font-accent text-[9px] uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            Avvisa il Guardian via WhatsApp
          </button>
          <button
            onClick={onReset}
            className="w-full py-4 bg-white/5 text-white/40 hover:text-white font-mono text-[9px] uppercase tracking-[0.3em] transition-all"
          >
            Tornare alla Home
          </button>
        </div>

        <p className="mt-6 text-[8px] font-mono text-white/20 uppercase tracking-widest leading-relaxed">
          In caso di esito positivo, riceverà via email la proposta formale con il link di pagamento.
        </p>
      </div>
    </div>
  );
};
