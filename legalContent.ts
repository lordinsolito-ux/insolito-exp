export const LEGAL_CONTENT = {
  terms: {
    title: "Contratto di Lifestyle Management & Assistenza",
    content: "Il presente servizio è un contratto di ASSISTENZA ALLA PERSONA (Cod. Civ. 2222 e s.g.g.). Il Fornitore opera come Lifestyle Manager e non come vettore di trasporto. Il veicolo utilizzato è da intendersi esclusivamente come 'strumento di lavoro accessorio' di proprietà del prestatore per l'espletamento delle funzioni di assistenza, coordinamento e sicurezza personale. La tariffazione è calcolata su base oraria per la disponibilità professionale e non per chilometraggio o tratta. Accettando questo servizio, il Cliente dichiara di essere consapevole che NON sta usufruendo di un servizio di Noleggio Con Conducente (NCC) o Taxi, bensì di una consulenza logistica privata."
  },
  privacy: {
    title: "Politica sulla Riservatezza Estrema",
    content: "Insolito Privé opera sotto rigoroso vincolo di segretezza fiduciaria. Nessun dato relativo agli spostamenti, incontri o conversazioni avvenute durante il servizio sarà mai registrato, divulgato o ceduto a terzi, salvo obblighi di legge. La tua privacy è l'asset principale del nostro servizio."
  },
  cookie: {
    title: "Cookie Policy",
    content: `Questo sito utilizza cookie tecnici strettamente necessari al funzionamento e cookie analitici anonimi per migliorare l'esperienza utente. Non utilizziamo cookie di profilazione o pubblicitari. I cookie tecnici non richiedono consenso. I dati raccolti sono trattati in forma anonima e aggregata. Per maggiori informazioni, contattare: info@insolitoprive.it. Normativa di riferimento: Regolamento UE 2016/679 (GDPR), D.Lgs. 196/2003 e s.m.i.`
  },
  contratto: {
    title: "Contratto d'Opera - Lifestyle Management",
    // Template con variabili: {{NOME}}, {{TELEFONO}}, {{TIER}}, {{ORE}}, {{DATA}}, {{ORARIO}}, {{PREZZO}}
    template: `CONTRATTO D'OPERA PER SERVIZI DI LIFESTYLE MANAGEMENT

Tra:
PRESTATORE: INSOLITO EXPERIENCES di Jara Lloctun Michael Sergio
P.IVA: IT14379200968 | Sede: Via Uboldo 8, 20063 Cernusco sul Naviglio (MI)
Codice ATECO: 96.99.99 (Servizi alla Persona n.c.a.)

COMMITTENTE: {{NOME}}
Recapito: {{TELEFONO}}

OGGETTO DELL'INCARICO
Il Prestatore si impegna a fornire al Committente un servizio di Assistenza Lifestyle di livello "{{TIER}}" per la durata di {{ORE}} ore consecutive, con decorrenza da {{DATA}} alle ore {{ORARIO}}.

NATURA DEL RAPPORTO
Il presente incarico ha natura fiduciaria e non configura in alcun modo un servizio di trasporto pubblico non di linea (NCC/Taxi). L'eventuale utilizzo di veicoli è da intendersi come mero strumento accessorio all'esecuzione del servizio di assistenza personale.

CORRISPETTIVO
Per l'esecuzione del presente incarico, il Committente corrisponde al Prestatore un onorario di €{{PREZZO}} (IVA inclusa ove applicabile), da versarsi integralmente prima dell'avvio del servizio tramite il sistema di pagamento digitale Stripe.

OBBLIGHI DEL PRESTATORE
- Puntualità e disponibilità per l'intera durata dell'incarico
- Massima riservatezza su ogni informazione acquisita
- Professionalità e decoro nell'esecuzione del servizio

OBBLIGHI DEL COMMITTENTE
- Pagamento integrale anticipato
- Comunicazione tempestiva di variazioni
- Comportamento rispettoso verso il Prestatore

Il presente contratto è regolato dalla Legge Italiana. Foro competente: Milano.

Data di accettazione digitale: {{TIMESTAMP}}
`,
    getFilledContract: (data: { name: string; phone: string; tier: string; hours: number; date: string; time: string; price: number }) => {
      return LEGAL_CONTENT.contratto.template
        .replace(/\{\{NOME\}\}/g, data.name)
        .replace(/\{\{TELEFONO\}\}/g, data.phone)
        .replace(/\{\{TIER\}\}/g, data.tier.toUpperCase())
        .replace(/\{\{ORE\}\}/g, data.hours.toString())
        .replace(/\{\{DATA\}\}/g, data.date)
        .replace(/\{\{ORARIO\}\}/g, data.time)
        .replace(/\{\{PREZZO\}\}/g, data.price.toLocaleString('it-IT'))
        .replace(/\{\{TIMESTAMP\}\}/g, new Date().toLocaleString('it-IT'));
    }
  },
  liberatoria: {
    title: "Liberatoria e Manleva",
    // Template con variabili: {{NOME}}, {{DATA}}
    template: `LIBERATORIA E MANLEVA

Il/La sottoscritto/a {{NOME}}, in qualità di Committente del servizio di Lifestyle Management erogato da INSOLITO EXPERIENCES di Jara Lloctun Michael Sergio (P.IVA 14379200968),

DICHIARA E ACCETTA QUANTO SEGUE:

1. ESONERO DI RESPONSABILITÀ
Il Committente esonera espressamente il Prestatore da ogni responsabilità per danni diretti o indiretti, patrimoniali e non, derivanti da:
- Eventi di forza maggiore (traffico, condizioni meteo, chiusure stradali, scioperi)
- Incidenti stradali non imputabili a colpa grave o dolo del Prestatore
- Ritardi causati da azioni o omissioni del Committente o di terzi
- Smarrimento o danneggiamento di oggetti personali lasciati incustoditi

2. ASSICURAZIONE
Il Prestatore dispone di copertura assicurativa RC Professionale. Il Committente riconosce che tale copertura opera nei limiti del massimale previsto e non costituisce garanzia di risarcimento integrale per qualsiasi evento.

3. POLITICA DI CANCELLAZIONE
- Cancellazione entro 48 ore dall'inizio del servizio: RIMBORSO INTEGRALE
- Cancellazione tra 24 e 48 ore: Rimborso del 50%
- Cancellazione inferiore a 24 ore: Nessun rimborso
- Mancata presentazione (no-show): Nessun rimborso

4. OSPITI E TERZE PARTI
Qualora il Committente sia accompagnato da terze persone durante il servizio, il Committente assume piena responsabilità per il loro comportamento e per eventuali danni da essi causati. Il Prestatore non è responsabile per la sicurezza degli ospiti oltre quanto previsto dalla normale diligenza professionale.

5. TRATTAMENTO DATI (GDPR)
Il Committente autorizza il trattamento dei propri dati personali ai sensi del Reg. UE 2016/679 per le sole finalità di esecuzione del servizio, fatturazione e comunicazioni di servizio. I dati non saranno ceduti a terzi per finalità commerciali.

6. RINUNCIA A RECLAMI
Il Committente rinuncia a qualsiasi pretesa, azione legale o reclamo nei confronti del Prestatore per fatti che esulino dalla colpa grave o dal dolo di quest'ultimo.

Accettando la presente liberatoria, il Committente dichiara di aver letto, compreso e accettato integralmente ogni clausola.

Data di accettazione digitale: {{TIMESTAMP}}
Committente: {{NOME}}
`,
    getFilledLiberatoria: (name: string) => {
      return LEGAL_CONTENT.liberatoria.template
        .replace(/\{\{NOME\}\}/g, name)
        .replace(/\{\{TIMESTAMP\}\}/g, new Date().toLocaleString('it-IT'));
    }
  }
};

export const BUSINESS_INFO = {
  name: "INSOLITO PRIVÉ",
  fullName: "INSOLITO EXPERIENCES DI JARA LLOCTUN MICHAEL SERGIO",
  address: "Via Uboldo n. 8, 20063 Cernusco sul Naviglio (MI)",
  piva: "14379200968",
  phone: "+39 339 3522164",
  whatsapp: "393393522164",
  email: "info@insolitoprive.it",
  instagram: "insolito_prive",
  ateco: "96.99.99 (Servizi alla Persona n.c.a.)"
};

export const BRAND_STORY = {
  title: "Michael Jara",
  subtitle: "Founder & Lifestyle Guardian",
  quote: "Non vendo viaggi, vendo l'accesso a un mondo dove il dettaglio è architettura e il tempo è il lusso supremo.",
  content: [
    "Ho fondato Insolito Privé per offrire un'ombra professionale a chi esige l'eccellenza.",
    "Il mio DNA è forgiato sulla puntualità millimetrica.",
    "Non vendo viaggi, vendo l'accesso a un mondo dove il dettaglio è architettura e il tempo è il lusso supremo."
  ],
  legalDisclaimer: {
    title: "Dichiarazione di Responsabilità e Conformità",
    content: "In conformità con la normativa vigente, si dichiara che INSOLITO PRIVÉ opera esclusivamente nell'ambito dei Servizi alla Persona n.c.a. (Codice ATECO 96.99.99). L'attività prestata da Michael Sergio Jara Lloctun consiste in consulenza lifestyle, assistenza logistica e coordinamento delle necessità personali del cliente. Qualora il servizio includa il supporto alla mobilità, esso è da intendersi come prestazione meramente accessoria, strumentale e non scindibile dall'incarico di assistenza globale. Si precisa che INSOLITO PRIVÉ non svolge attività di trasporto pubblico non di linea (NCC o Taxi). Il rapporto professionale è regolato dalle norme sul contratto d'opera intellettuale e di servizi ai sensi dell'Art. 2222 e seguenti del Codice Civile."
  },
  privacyNda: {
    title: "Privacy & Non-Disclosure Agreement",
    content: "La riservatezza è il cardine di ogni incarico affidato a INSOLITO PRIVÉ. Si garantisce che ogni informazione, conversazione o dettaglio relativo alla sfera personale, professionale e privata del cliente, acquisito durante la prestazione del servizio, sarà trattato con il massimo grado di confidenzialità. Michael Sergio Jara Lloctun si impegna formalmente alla non divulgazione di dati sensibili a terze parti, operando in piena conformità con il Regolamento UE 2016/679 (GDPR). La vostra privacy non è solo un obbligo legale, ma un impegno d'onore che definisce l'esclusività del nostro legame professionale."
  },
  founderInfo: {
    fullName: "Michael Sergio Jara Lloctun",
    piva: "P.IVA: 14379200968",
    address: "Sede Legale: Via Uboldo n. 8, Cernusco sul Naviglio (MI)"
  }
};

