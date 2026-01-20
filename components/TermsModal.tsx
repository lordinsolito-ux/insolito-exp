
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
        <div className="flex items-center justify-between p-6 border-b border-gold-500/20 bg-black/40 rounded-t-lg">
          <div>
            <h2 className="text-xl font-display text-gold-400 tracking-wider">Terms & Conditions</h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Insolito Private Driver</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gold-400 transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Text Body */}
        <div className="flex-1 overflow-y-auto p-6 text-gray-300 text-sm font-light leading-relaxed space-y-6 custom-scrollbar">
            <div className="space-y-4">
                <p className="font-bold text-gold-200">Ragione Sociale/Titolare del Servizio: Insolito Experiences di Michael Jara</p>
                <p>Partita I.V.A.: IT14379200968<br/>Data di Entrata in Vigore: 1° Novembre 2025</p>
                
                <p>Il presente documento stabilisce i Termini e le Condizioni Contrattuali che regolano l'erogazione dei servizi di Autista Privato di Lusso (di seguito, il "Servizio") forniti da INSOLITO (di seguito, il "Fornitore"). L'accettazione di questi T&C è obbligatoria e vincolante per l'utilizzo del Servizio.</p>

                <h3 className="text-gold-300 font-medium pt-2 border-b border-white/10 pb-1">1. Definizioni e Oggetto</h3>
                <p><strong>1.1. INSOLITO (o "il Fornitore"):</strong> L'entità giuridica "Insolito Experiences di Michael Jara" (P.Iva IT14379200968), responsabile della gestione e dell'erogazione del Servizio di Autista Privato, inclusi veicoli e conducenti qualificati.</p>
                <p><strong>1.2. Cliente (o "Utente"):</strong> La persona fisica o giuridica che richiede, prenota e usufruisce del Servizio.</p>
                <p><strong>1.3. Servizio:</strong> Noleggio di veicolo con conducente (NCC) di alta gamma, basato su prenotazione anticipata, con enfasi su privacy, discrezione ed esclusività, nell'Area Operativa concordata.</p>
                <p><strong>1.4. Area Operativa:</strong> Principalmente Milano, l'area metropolitana e le trasferte nazionali/internazionali specificamente concordate.</p>

                <h3 className="text-gold-300 font-medium pt-2 border-b border-white/10 pb-1">2. Accettazione del Contratto</h3>
                <p>L'atto di richiedere o confermare una prenotazione con INSOLITO costituisce piena e incondizionata accettazione dei presenti T&C e della Politica sulla Privacy annessa. Il Cliente attesta la propria capacità legale di stipulare contratti vincolanti.</p>

                <h3 className="text-gold-300 font-medium pt-2 border-b border-white/10 pb-1">3. Prenotazione, Tariffe e Politiche Finanziarie</h3>
                <p><strong>3.1. Modalità e Conferma:</strong> Le prenotazioni devono essere richieste tramite canali dedicati (telefono, email, sistema di prenotazione esclusivo) e non tramite piattaforme di terze parti. Il Servizio è considerato confermato solo a seguito dell'invio di una conferma scritta (elettronica) da parte di INSOLITO.</p>
                <p><strong>3.2. Struttura delle Tariffe:</strong> Le tariffe sono calcolate su base oraria minima, tariffa fissa per trasferimento, o pacchetti personalizzati. I preventivi includono carburante, pedaggi nell'Area Operativa (salvo diversi accordi), e il compenso dell'autista. I supplementi per orari notturni, festività o attese prolungate saranno applicati come specificato nel preventivo.</p>
                <p><strong>3.3. Pagamento e Invoicing:</strong> Il pagamento è dovuto contestualmente all'erogazione del Servizio o secondo i termini di fatturazione concordati per i Clienti Corporate. I metodi accettati includono bonifico bancario anticipato, carte di credito/debito tramite POS mobile.</p>
                <div className="bg-black/30 p-4 rounded border border-white/5">
                    <p className="font-bold text-gold-200 mb-2">3.4. Attesa (Grace Period):</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                        <li><strong>Trasferimenti (Pick-up):</strong> È concesso un periodo di attesa di cortesia di 15 minuti per i pick-up da indirizzi privati e 60 minuti per i pick-up in aeroporto (dopo l'effettivo atterraggio).</li>
                        <li><strong>Addebito:</strong> Superato il tempo di attesa concesso, sarà applicata una tariffa di attesa oraria frazionabile per ogni 15 minuti aggiuntivi, come specificato nel preventivo.</li>
                    </ul>
                </div>
                <div className="bg-black/30 p-4 rounded border border-white/5">
                    <p className="font-bold text-gold-200 mb-2">3.5. Politica di Cancellazione:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                        <li>Cancellazioni comunicate con almeno <strong>3 ore</strong> di preavviso rispetto all'orario concordato: Nessuna penale.</li>
                        <li>Cancellazioni comunicate tra <strong>1 e 3 ore</strong> di preavviso: Sarà addebitato il 50% della tariffa minima concordata.</li>
                        <li>Cancellazioni comunicate con meno di <strong>1 ora</strong> di preavviso o mancata presentazione ("No-Show"): Sarà addebitato il 100% della tariffa minima concordata.</li>
                    </ul>
                </div>

                <h3 className="text-gold-300 font-medium pt-2 border-b border-white/10 pb-1">4. Discrezione e Riservatezza (Liberatoria di Non-Divulgazione)</h3>
                <p><strong>4.1. Privacy Assoluta (NDA Virtuale):</strong> INSOLITO e i suoi autisti agiscono in regime di riservatezza assoluta. Nessun dato relativo alle rotte, agli orari, alle destinazioni o alle conversazioni del Cliente sarà registrato o divulgato a terze parti, salvo obbligo legale o richiesta specifica del Cliente.</p>
                <p><strong>4.2. Tracciamento Esclusivamente Interno:</strong> Il Fornitore utilizza sistemi di tracciamento GPS esclusivamente interni per motivi operativi, di sicurezza del veicolo e di gestione della flotta. Tali dati non sono accessibili né condivisi con piattaforme pubbliche o Clienti.</p>
                <p><strong>4.3. Dovere di Discrezione del Conducente:</strong> I conducenti INSOLITO sono contrattualmente vincolati al segreto professionale. Mantengono il silenzio e intervengono nella conversazione solo se strettamente richiesto dal Cliente.</p>
                <p><strong>4.4. Informazioni Condivise:</strong> Il Cliente riconosce che il Fornitore non è responsabile per la riservatezza di informazioni o documenti che il Cliente scelga volontariamente di lasciare a bordo del veicolo.</p>

                <h3 className="text-gold-300 font-medium pt-2 border-b border-white/10 pb-1">5. Doveri e Responsabilità del Cliente</h3>
                <p><strong>5.1. Condotta a Bordo:</strong> Durante il Servizio, è rigorosamente vietato fumare (incluso sigarette elettroniche), consumare sostanze stupefacenti o alcoliche (se non espressamente fornite da INSOLITO e consentite dalla legge) e mantenere una condotta pericolosa o molesta.</p>
                <p><strong>5.2. Risarcimento Danni:</strong> Il Cliente si assume la piena responsabilità finanziaria per qualsiasi danno o contaminazione (es. vomito, macchie permanenti) causato al veicolo che ecceda la normale usura, e si impegna a rimborsare INSOLITO per i costi di riparazione e l'eventuale mancato guadagno dovuto all'indisponibilità del veicolo.</p>
                <p><strong>5.3. Responsabilità per Ritardi:</strong> Il Cliente è responsabile per qualsiasi ritardo che causi una variazione del percorso o dell'orario di fine servizio inizialmente concordato, e sarà addebitata la tariffa oraria aggiuntiva pertinente.</p>
                <p><strong>5.4. Diritto di Rifiuto:</strong> L'autista INSOLITO ha il diritto insindacabile di rifiutare l'imbarco o interrompere immediatamente il Servizio, senza alcun obbligo di rimborso, qualora il Cliente: (a) superi il numero massimo di passeggeri consentito; (b) si trovi in uno stato di ebbrezza o alterazione tale da compromettere la sicurezza; (c) violi le leggi vigenti o le clausole dei presenti T&C.</p>

                <h3 className="text-gold-300 font-medium pt-2 border-b border-white/10 pb-1">6. Limitazione di Responsabilità del Fornitore</h3>
                <p><strong>6.1. Coperture e Conformità:</strong> INSOLITO garantisce che tutti i veicoli sono in regola con le revisioni, le assicurazioni RCA e Kasko, e che i conducenti sono in possesso di tutte le licenze NCC e qualifiche professionali necessarie.</p>
                <p><strong>6.2. Esclusione di Responsabilità per Danni Indiretti:</strong> INSOLITO non sarà in alcun caso responsabile per perdite o danni indiretti, incidentali, speciali, punitivi, consequenziali. La responsabilità massima di INSOLITO è limitata esclusivamente all'importo della tariffa pagata dal Cliente.</p>
                <p><strong>6.3. Forza Maggiore e Ritardi:</strong> INSOLITO non è responsabile per ritardi, cancellazioni o Servizi incompleti causati da eventi di Forza Maggiore o cause esterne (meteo estremo, scioperi, traffico inusuale).</p>

                <h3 className="text-gold-300 font-medium pt-2 border-b border-white/10 pb-1">7. Disposizioni Finali</h3>
                <p><strong>7.1. Modifiche ai T&C:</strong> INSOLITO si riserva il diritto di modificare unilateralmente i presenti T&C. Le modifiche saranno efficaci 30 giorni dopo la loro pubblicazione.</p>
                <p><strong>7.2. Legge Applicabile e Giurisdizione:</strong> I presenti Termini sono regolati dalla Legge Italiana. Per qualsiasi controversia, il Foro competente esclusivo sarà quello di Milano.</p>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="font-bold text-gold-200">Contatti per il Servizio Clienti e Prenotazioni:</p>
                    <p>Email: jaramichael@hotmail.com</p>
                    <p>Telefono: 3393522164</p>
                    <p className="text-xs text-gray-500 mt-2 italic">
                        Con la conferma della prenotazione, il Cliente dichiara di aver letto, compreso e accettato integralmente tutte le clausole del presente Contratto, inclusa la limitazione di responsabilità di cui all'Articolo 6.
                    </p>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gold-500/20 bg-black/40 text-center rounded-b-lg">
             <button 
                onClick={onClose}
                className="px-8 py-3 bg-gold-600 text-black font-bold uppercase tracking-widest text-xs hover:bg-gold-500 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]"
             >
                I Understand & Agree
             </button>
        </div>
      </div>
    </div>
  );
};
