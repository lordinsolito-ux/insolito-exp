
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
    <div className="min-h-screen bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 z-[300]">
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-sm shadow-[0_20px_100px_rgba(0,0,0,0.8)] max-w-lg w-full p-10 md:p-14 text-center animate-reveal overflow-hidden">
        {/* Architectural Background Texture */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--milano-bronzo)]/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

        <div className="flex justify-center mb-10">
          <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-[var(--milano-bronzo)]/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(139,115,85,0.1)]">
            <Clock className="w-8 h-8 text-[var(--milano-bronzo)] animate-pulse" />
            <div className="absolute -top-1 -right-1">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--milano-bronzo)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--milano-bronzo)]"></span>
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl md:text-4xl font-display text-white italic mb-3 tracking-tight">Protocollo in Analisi</h2>
        <div className="inline-block bg-[var(--milano-bronzo)]/5 text-[var(--milano-bronzo)] border border-[var(--milano-bronzo)]/20 px-5 py-2 rounded-sm text-[10px] uppercase font-bold tracking-[0.4em] mb-10">
          Status: Verifica Disponibilità Fiduciaria
        </div>

        <div className="text-gray-400 text-sm mb-12 font-light leading-relaxed font-sans uppercase tracking-[0.15em] text-[11px]">
          Grazie, <span className="text-white font-bold">Egregio {formData.name}</span>. <br />
          La Sua richiesta di accesso è stata registrata nei nostri sistemi crittografati.
          Il team INSOLITO sta procedendo alla verifica della fattibilità logistica e alla sincronizzazione degli asset per l&apos;incarico.
        </div>

        <div className="space-y-4 text-left bg-white/[0.01] p-8 rounded-sm border border-white/5 mb-12">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">Ambito Servizio</span>
            <span className="text-xs text-white/90 font-accent uppercase tracking-widest">{serviceName}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">Pianificazione</span>
            <span className="text-xs text-white/90 font-accent uppercase tracking-widest">{new Date(formData.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })} @ {formData.time}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">Impegno Economico</span>
            <span className="text-[var(--milano-bronzo)] font-accent text-2xl tracking-tighter shadow-sm">€{formData.estimatedPrice}</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleWhatsAppNotify}
            className="w-full py-5 bg-[var(--milano-bronzo)] text-white font-accent text-[10px] uppercase tracking-[0.4em] hover:brightness-110 active:scale-[0.99] transition-all shadow-2xl flex items-center justify-center gap-3"
          >
            Avvisa il Guardian via WhatsApp
          </button>
          <button
            onClick={onReset}
            className="w-full py-5 bg-white/[0.03] text-white/30 hover:text-white/60 font-mono text-[9px] uppercase tracking-[0.4em] transition-all border border-transparent hover:border-white/5"
          >
            Chiudi Protocollo
          </button>
        </div>

        <div className="mt-10 flex gap-4 text-left opacity-30 group hover:opacity-100 transition-opacity">
          <AlertCircle className="w-4 h-4 text-[var(--milano-bronzo)] shrink-0" />
          <p className="text-[9px] font-mono text-white uppercase tracking-widest leading-relaxed">
            In caso di esito positivo, riceverà via email la proposta formale fiduciaria contenente il mandato e il link di perfezionamento Stripe.
          </p>
        </div>
      </div>
    </div>
  );
};
