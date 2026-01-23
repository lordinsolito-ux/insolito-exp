
import React from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/40 rounded-t-lg">
          <div>
            <h2 className="text-xl font-display text-white italic tracking-wider">Termini & Condizioni</h2>
            <p className="text-[9px] text-[var(--milano-bronzo)] mt-1 uppercase tracking-[0.3em] font-mono">Contratto d'Opera - Lifestyle Management</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Text Body */}
        <div className="flex-1 overflow-y-auto p-8 text-gray-300 text-[11px] font-light leading-relaxed space-y-8 custom-scrollbar font-sans">
          <div className="space-y-6">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
              <p className="font-bold text-white uppercase tracking-widest text-[10px] mb-2">Prestatore dell'Opera: Insolito Experiences di Michael Jara</p>
              <p className="font-mono text-[9px] text-white/40">P.IVA: IT14379200968 | Sede: Milano | Revisione: Gennaio 2026</p>
            </div>

            <p className="italic text-white/60">Il presente documento disciplina l'erogazione di servizi di <strong>Lifestyle Management, Assistenza Fiduciaria e Coordinamento Logistico Personale</strong> (di seguito, l'"Incarico") regolati dalle norme sul Contratto d'Opera ex <strong>Art. 2222 e seguenti del Codice Civile</strong>.</p>

            <h3 className="text-gold-300 font-medium pt-2 border-b border-white/10 pb-1">1. Natura del Rapporto e Oggetto</h3>
            <p><strong>1.1. Incarico Professionale:</strong> Il rapporto tra il Cliente e INSOLITO è di natura fiduciaria. INSOLITO opera come assistente lifestyle personale, consulente logistico e prestatore d'opera intellettuale/gestionale.</p>
            <p><strong>1.2. Esclusione Servizi Pubblici:</strong> Il Cliente riconosce espressamente che INSOLITO <strong>non è un servizio di taxi pubblico né un servizio di Noleggio con Conducente (NCC) tradizionale aperto al pubblico</strong>.</p>
            <p><strong>1.3. Mobilità Accessoria:</strong> Qualora l'incarico preveda il supporto alla mobilità del Cliente, essa è da intendersi come <strong>attività puramente accessoria e strumentale</strong> all'esecuzione della missione complessiva (es. coordinamento agenda, presidio eventi, assistenza fiduciaria).</p>

            <h3 className="text-white font-accent uppercase tracking-widest text-[10px] pt-4 border-b border-white/10 pb-2">2. Prenotazione e Approvazione Fiduciaria</h3>
            <p>Data l'esclusività del servizio, la richiesta di prenotazione costituisce una "Proposta di Incarico". INSOLITO si riserva il diritto insindacabile di accettare o declinare l'incarico previa valutazione della fattibilità e del profilo di sicurezza. L'incarico è confermato solo a seguito dell'accettazione scritta e del contestuale versamento dell'onorario tramite link Stripe.</p>

            <h3 className="text-white font-accent uppercase tracking-widest text-[10px] pt-4 border-b border-white/10 pb-2">3. Struttura dei Compensi (Tier System)</h3>
            <p>Gli onorari sono calcolati sulla base delle ore di assistenza richieste (minimo 3h per Essentials, 4h per Signature). Il profilo Elite prevede un canone mensile fisso (Retainer). Sono accettati esclusivamente pagamenti digitali tracciabili tramite Stripe.</p>

            <h3 className="text-white font-accent uppercase tracking-widest text-[10px] pt-4 border-b border-white/10 pb-2">4. Obbligo di Riservatezza e Discrezione</h3>
            <p>INSOLITO agisce in regime di riservatezza assoluta. Ogni informazione o conversazione è coperta da segreto professionale. Al termine della missione, ogni dato sensibile relativo ai dettagli logistici sarà rimosso dai sistemi operativi attivi.</p>

            <h3 className="text-white font-accent uppercase tracking-widest text-[10px] pt-4 border-b border-white/10 pb-2">5. Responsabilità e Giurisdizione</h3>
            <p>INSOLITO risponde esclusivamente per l'esecuzione diligente dell'incarico fiduciario. Il presente contratto è regolato dalla Legge Italiana. Per ogni controversia è competente in via esclusiva il Foro di Milano.</p>

            <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
              <p className="text-white font-bold text-[10px] uppercase tracking-widest">Contatti Ufficiali:</p>
              <p className="font-mono text-gray-500 text-[9px]">Email: jaramichael@hotmail.com | Tel: +39 339 3522164</p>
              <p className="text-[9px] text-gray-600 italic leading-relaxed">
                Procedendo con l'Incarico, il Cliente attesta di aver letto, compreso e accettato integralmente le clausole del presente Contratto d'Opera.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-black/40 text-center rounded-b-lg">
          <button
            onClick={onClose}
            className="px-12 py-4 bg-white text-black font-accent font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-[var(--milano-bronzo)] hover:text-white transition-all duration-500 shadow-xl"
          >
            Accetto e Comprendo
          </button>
        </div>
      </div>
    </div>
  );
};
