# Controllo qualità

Il verbale del collaudo a mano della PR 19. La matrice sta accanto a questo
file, in [`controllo-qualita.csv`](controllo-qualita.csv): una riga per
controllo, e le tre colonne finali sono quelle che si compilano.

Versionato perché il prossimo giro parta da qui e non dalla memoria — e perché
*«provato su un telefono»* senza dire quale è esattamente la frase che questo
repository passa il tempo a smontare.

## Perché una matrice e non un giro a occhio

Ogni guardia di questo repository risponde a una domanda che qualcuno sapeva
già di dover porre. Il collaudo a mano è l'unica cosa che trova quello a cui
nessuno ha pensato, e su questo sito c'è una categoria intera di difetti che le
guardie non possono vedere per costruzione: **le guardie leggono il DOM,
l'occhio legge i pixel.** `checkBrandSignature` legge la firma *dentro*
`data-brand`, e un `overflow: hidden` che taglia «in Periferia» a schermo viola
la regola 7 con la suite verde. Lo stesso vale per un contrasto calcolato
contro un token e vissuto sopra una fotografia.

## Come è fatta la matrice

Una riga è **una azione, su un dispositivo, contro un componente**. Non «provare
la Timeline sul telefono», che a distanza di un mese non si sa più se
comprendeva la barra che scorre; ma «scorrere la barra di lato fino alla serata
78», che o è stato fatto o non lo è stato.

| Colonna | Cosa contiene |
|---|---|
| `ID` | `QA-001`… — stabile: un difetto si cita con questo |
| `Area` | il capitolo del collaudo |
| `Priorità` | `alta` è la matrice minima da percorrere; `media` è il resto |
| `Dispositivo` | uno solo, e per esteso |
| `Contesto` | formato, impostazione, o il modo in cui si guarda |
| `Rotta` | l'indirizzo da aprire |
| `Componente` | uno solo |
| `Azione` | una sola cosa da fare |
| `Esito atteso` | come si riconosce che è andata bene |
| **`Esito`** | `OK` · `KO` · `N.A.` — **da compilare** |
| **`Difetto osservato`** | cosa si è visto, se non è `OK` — **da compilare** |
| `Riferimento` | la regola o la PR che ha deciso quel comportamento |

Il file è UTF-8 con BOM e usa il **punto e virgola** come separatore: è fatto
per essere aperto e compilato, e la prosa italiana è piena di virgole. C'è una
tredicesima colonna, `Verifica automatica`, che porta la misura per le righe
percorse con il browser: sta accanto alla riga e non in un secondo documento,
perché una misura separata dalla domanda che le ha dato origine è la copia che
diverge.

**Il CSV è la fonte, le altre due sono viste.**
`controllo-qualita.xlsx` è **generato** dal CSV e serve a compilarlo: quattro
fogli — *riepilogo* con i conteggi vivi, *da fare* con le sole righe che
restano, *tutte* con la matrice intera, *difetti* con i rilievi.
[`controllo-qualita-da-fare.md`](controllo-qualita-da-fare.md) è l'altra vista,
generata anch'essa: le sole righe aperte, con una casella da spuntare, divise per
dispositivo e con scritto in testa a ciascuno che cosa quel dispositivo serve a
trovare. È la forma che si legge su un telefono mentre si tiene il telefono in
mano. Si lavora lì o nel foglio, e poi si rifonde nel CSV, che è quello che il
repository versiona.

Il verso conta: **si rigenera il foglio dal CSV, mai il contrario a memoria.**
Due copie della stessa matrice divergono al primo esito scritto in quella
sbagliata, ed è la forma di guasto che questo repository passa il tempo a
cacciare — la stessa dei cinque `[data-cycle]` scritti a mano e del numero di
WhatsApp copiato due volte.

Un `KO` non deve essere completo: basta che nomini il difetto. La diagnosi si fa
dopo, sul quadro intero, ed è il momento in cui si decide quali fix entrano in
questa PR e quali prendono la loro.

## I dispositivi

Le versioni vere si scrivono qui man mano che si prova, perché è l'unica cosa
che la matrice da sola non può registrare.

| Etichetta nel CSV | Modello e versione provati | Data |
|---|---|---|
| iPhone Safari 15.4-16.3 | | |
| iPhone recente (Safari 18+) | | |
| Android Chrome recente | provato a mano | 17 ago 2026 |
| Android di 4 anni (Chrome) | Google Pixel, modello da registrare — 11 righe su 13; le due di rete lenta restano | 17 ago 2026 |
| iPad (Safari) | emulato: Chromium a 820×1180 e 1180×820 — le righe che dipendono dal breakpoint, non dal tocco | 17 ago 2026 |
| Desktop Chrome (Windows) | a mano, più Chromium in automazione per le misure | 17 ago 2026 |
| Desktop Firefox (Windows) | Firefox 153.0.4, pilotato via WebDriver BiDi — 24 righe su 29 | 17 ago 2026 |
| Desktop Safari (macOS) | | |

**Quattro righe di Firefox non sono misurabili in automazione**, e la ragione è
una sola: `document.hasFocus()` è falso quando la finestra non è in primo piano,
quindi `:focus` e `:focus-visible` non fanno match e nessuno stile di messa a
fuoco si applica. Vale in headless e con la finestra aperta allo stesso modo,
provato. Sono QA-199, QA-201, QA-205 e QA-206 — il salta-a, il contorno sulle
voci, il contorno su una tacca, il fuoco che resta dentro il modale — e restano
da fare a mano, dove peraltro sono anche le uniche che rispondono alla domanda
vera: *si vede?*

**Ventuno righe sono state percorse in automazione**, con il browser integrato:
misure geometriche, contrasti composti sui colori veri, peso della pagina,
comportamento dell'indirizzo. Portano la loro misura nella colonna *Verifica
automatica*, che è anche dove stanno le diagnosi sulle righe già risposte a
mano. Quello che l'automazione **non** può dire è scritto qui sotto: un motore
diverso, un telefono vero, uno screen reader, una preferenza di sistema.

**L'iPhone con Safari fra 15.4 e 16.3 è il più importante dei nove.** È la
soglia dichiarata del progetto e non l'ha mai aperta nessuno: è la finestra in
cui la sintassi range delle media query ucciderebbe ogni layout mobile, e
`checkMediaRangeSyntax` è l'unica cosa che oggi la difende.

**Firefox non è un doppione di Chrome**: ha l'unico altro motore, e le frecce
sullo scroller si comportano diversamente per decisione documentata.

## Il giro del visitatore, e quello del redattore

Due cose che la matrice non contiene perché non sono controlli:

- **Il giro di un visitatore vero, cronometrato, fatto da chi non ha lavorato al
  sito**: arriva, capisce cos'è, trova la prossima serata, capisce quando e
  dove, prenota. Il tempo e i punti in cui si è fermato si scrivono qui sotto.
- **Il giro del redattore**, che è un utente anche lui: creare una serata dal
  CMS, caricare una foto, salvare, vedere la build. Cronometrato, e almeno una
  volta da telefono, perché è così che verrà usato.

### Verbale del giro del visitatore

_(chi, quando, quanto ci ha messo, dove si è fermato)_

### Verbale del giro del redattore

_(chi, quando, quanto ci ha messo, dove si è fermato)_

## I difetti trovati

Ogni difetto porta il dispositivo, l'impostazione e i passi per riprodurlo:
senza quelli è un'impressione, e un'impressione non si può verificare corretta.

**Diciassette dei diciannove sono stati sistemati in questa PR.** Dei due che
restano, uno è mezzo — l'avviso sulla data nel CMS c'è, la convalida che
guarderebbe un'altra serata Sveltia non la offre — e uno va confermato con una
rotella vera prima di essere chiamato difetto. Tutt'e due hanno una riga in
[questioni-aperte.md](questioni-aperte.md).

| # | Da | Dispositivo e impostazione | Difetto | Come riprodurlo | Destino |
|---|---|---|---|---|---|
| 1 | giro del redattore | Desktop Chrome, `/admin` | Il CMS lascia salvare una serata la cui data contraddice il suo numero, e la build si ferma dopo il commit: il redattore lo scopre da una build rossa su un contenuto che ha già pubblicato. Niente nel form dice che la data deve venire dopo quella della serata precedente | Creare la serata 84 con una data anteriore a quella della 83 e salvare. Il commit passa; la build esce con «#83 … is numbered before #84 … but happens after it». **Riprodotto una seconda volta**, il 17 agosto, da un'altra persona e da un telefono: la serata 85 è stata datata 18 ottobre contro il 5 novembre della 83. Due tentativi su due, e nessuno dei due se n'è accorto salvando | mezzo: l’avviso c’è, la convalida no — questioni-aperte.md |
| 2 | QA-150, QA-257 | Desktop, finestra bassa o titolo lungo | **Il testo esce dalla scena invece di essere ritagliato.** Sopra i 900 px di larghezza `.scene-text` non ha `overflow: hidden` e nessuna soglia toglie la descrizione: sul telefono la PR 18 ha messo tutt'e due le protezioni, sul desktop nessuna delle due | A 1280×500 la nota e i bottoni escono di 26 px e la foto di 42. A 1280×800 con un titolo di 88 caratteri escono di 88 px | sistemato |
| 3 | QA-233, QA-338 | Desktop, `/chi-siamo` | **Tre usi di `--text-muted` sotto la soglia**: etichetta di sezione 3,50:1 a 13 px, etichetta di statistica 3,50:1, didascalia di figura 3,50:1 a 15 px. La cifra della statistica, che il piano sospettava, misura 12,14:1 e passa | Misurare il contrasto composito di `.page-label`, `.page-stat-label`, `.page-figure` sul fondo blu | sistemato |
| 4 | QA-105, QA-333 | ovunque | **Il primo tocco del tasto indietro non muove niente**: il click sulla tacca aggiunge una voce di cronologia, l'osservatore la riscrive con `replaceState`, e il primo indietro cambia solo l'indirizzo | Cliccare una tacca (l'indirizzo diventa `/78#serata-78`), premere indietro: si torna a `/78` con la pagina ferma | sistemato |
| 5 | QA-084, QA-085, QA-088, QA-089 | telefono in orizzontale | **La scena non tiene sotto i 400 px di altezza utile.** A 800×360 il riquadro del testo è alto 141 px e il contenuto ne chiede 314: 173 px vengono ritagliati, e dentro ci sono data, sede, bottoni e nota. La fotografia scende a 51 px | Ruotare il telefono su una serata qualsiasi | sistemato |
| 6 | QA-243 | telefono, Timeline | **La pillola è alta 36 px e non 44.** Il sito ha due token per lo stesso mestiere: `--tap-target` vale 44 px e la linguetta della tendina lo rispetta, `--timeline-tick-height` vale 36 | Misurare una pillola della barra a 375×812 | sistemato |
| 7 | QA-238 | desktop, 1280×800 | **La fotografia passa sotto la rotaia**: la cornice arriva a 1211 px su una finestra di 1280, la rotaia comincia a 1132, e le date delle tacche cadono sopra l'immagine — dove il contrasto è quello della foto | Guardare la rotaia su una serata con fotografia chiara | sistemato |
| 8 | QA-261 | desktop, serata senza foto | **La colonna della fotografia resta riservata**: 420 px vuoti accanto al testo. Sul telefono la riga va a zero e il testo prende tutto, come dice il commento in `Scene.astro` — il desktop non ha la stessa cura, e la serata senza foto è il caso normale dell'archivio | Togliere `photo` a una serata e aprirla a 1280×800 | sistemato |
| 9 | QA-294 | desktop, `/componenti` | **`Placeholder` non è in rassegna**: nove sezioni e nessuna è la sua, zero elementi `[data-placeholder]` nella pagina. Il componente esiste e la sua cornice non è verificata da nessuna parte | Aprire `/componenti` e cercarlo | sistemato |
| 10 | QA-292 | desktop, `/componenti` | `GuestRow` è mostrato con due valori di `--guest-size` — nome a 20 px e a 34 px — senza che la rassegna dica che sono due tarature: si legge come un'incoerenza | Confrontare le due righe d'ospite della rassegna | sistemato |
| 11 | QA-281 | desktop | **Il titolo della pagina non segue la serata**: `document.title` resta «Il programma — …» anche quando l'indirizzo è diventato `/78`. Chi mette un segnalibro salva il titolo, non l'indirizzo | Scorrere fino a una serata e mettere un segnalibro | sistemato |
| 12 | QA-145, obiettivi | ogni pagina | Mancano `theme-color`, `apple-touch-icon` e `color-scheme`: verificato sul pubblicato, nel markup e nel CSS | Cercarli in `dist/` | sistemato |
| 13 | QA-311…QA-316 | anteprima di stampa | Non esiste nessun blocco `@media print` nel CSS pubblicato | `Ctrl+P` su una qualsiasi delle rotte | sistemato |
| 14 | QA-173 | `prefers-reduced-motion` | Sotto la preferenza lo snap viene **tolto** da `[data-scroller] { scroll-snap-type: none !important }`. Non è un guasto: è una decisione che non sta scritta in `decisioni.md`, e l'esito atteso della matrice diceva il contrario | Attivare la riduzione del movimento e scorrere | deciso, e scritto in decisioni.md |
| 15 | QA-284 | — | `[data-theme="paper"]` è dichiarato in `colors.css` e nessuna pagina lo imposta: una palette scritta e mai resa. La stampa è il candidato naturale | — | deciso: la palette è passata alla stampa |
| 16 | QA-226 | NVDA | Nell'elenco delle intestazioni compare un `<h2>` vuoto: è il titolo del modale, che resta senza testo finché non viene aperto | Chiedere l'elenco delle intestazioni su `/` | sistemato |
| 17 | QA-113 | Firefox 153, desktop | **La rotella sopra una tacca della rotaia non muove il programma.** La colonna ha `pointer-events: none` e le tacche lo rimettono a `auto`: una tacca cattura la rotella e cerca un antenato scrollabile, ma la rotaia non scorre in verticale e il documento è alto uno schermo. È la trappola che il commento di `Timeline.astro` descrive per la colonna, non richiusa per le tacche | Portare il puntatore su una tacca e girare la rotella: lo `scrollTop` non cambia. Spostarsi fra due tacche: scorre | sistemato |
| 18 | QA-110, QA-094 | Firefox 153; e Chrome col trackpad | **Un colpo di rotella salta due serate.** Da `/` (serata 81) un evento di rotella atterra sulla 83 — misurato a 40, 57 e 114 px, tutte e tre uguali. Su Chrome era già annotato a mano come «il trackpad scorre più scene» | Un colpo di rotella dalla serata di apertura | resta da confermare con una rotella vera |

| 19 | QA-323, QA-324 | CMS da telefono | **Il CMS scrive i contenuti in una forma diversa da quella dei file scritti a mano**: `photo: /src/assets/photos/…` invece del `../../assets/photos/…` che hanno tutti gli altri, e `cancelled: false` scritto per esteso dove gli altri file lo omettono. Niente si rompe — il percorso assoluto risolve, verificato — ma le due mani che scrivono in `src/content/` non scrivono uguale, ed è la deriva che la regola 21 tiene d'occhio | Creare una serata dal CMS con una fotografia e confrontare il file con la serata 81 | sistemato |

Il **destino** è una di tre cose:

- **fix qui** — CSS, markup, attributi, testi, valori: le cose che si sistemano
  dove sono;
- **PR propria** — un difetto che cambia una decisione o rifà un componente non
  entra qui, e questa PR lo registra;
- **questione aperta** — quello che dipende dal committente o da qualcosa che
  ancora non c'è.

E **ogni difetto trovato a mano che poteva essere una guardia diventa una
guardia**, con il suo caso negativo: un collaudo che non lascia dietro nemmeno
un test automatico è un collaudo da rifare identico la prossima volta.

## Quello che si sa già di trovare

Tre lavori arrivano dalla PR 18 con la diagnosi già fatta, e stanno nella
matrice sotto l'area *Eredità PR 18*:

1. **Il primo tocco del tasto indietro non muove niente.** Una tacca è un
   `<a href="#serata-78">`, e il click su un'ancora aggiunge una voce di
   cronologia — la mette il browser. L'osservatore poi la riscrive in `/78` con
   `replaceState`, quindi il primo indietro cambia l'indirizzo e lascia la
   pagina dov'era. Il rimedio è intercettare il **click semplice**, lasciando
   passare il click centrale e quello con il tasto di comando, fare
   `scrollIntoView()` senza argomenti — regola 15 — e riscrivere l'indirizzo.
2. **Il sito in orizzontale su un telefono**, mai guardato: sotto i 400 px di
   altezza utile le soglie tarate alla PR 18 si accavallano, e serve una
   composizione diversa, non una misura ritoccata.
3. **Il contrasto, con un numero.** `--text-muted` è 0,44 di crema sul blu e
   misura **3,3:1**, sotto il 4,5 di un testo. La PR 18 ha spostato a
   `--text-secondary` i due usi dentro una scena; restano le etichette di
   `pages.css`, la cifra di una statistica, la voce disattivata della
   navigazione e la freccia di una riga. Non sono lo stesso caso — un controllo
   inattivo è escluso dalla soglia, una freccia è un'icona e ne ha una più bassa
   — e vanno guardati uno per uno, con la pagina davanti.

E tre cose che oggi mancano e si notano solo guardando: `apple-touch-icon`,
senza il quale iOS mette in schermata Home una miniatura della pagina;
`theme-color`, che colora la barra del browser; `color-scheme`, senza il quale
la barra di scorrimento del programma arriva chiara su un sito blu notte.

Le anteprime sociali **restano alla PR 22**: senza dominio non c'è niente da
incollare in una chat.

## Le righe riaperte dalla PR 20

La PR 20 cambia il comportamento che una parte di questa matrice aveva
verificato, quindi quelle righe tornano da fare invece di restare `OK` su una
cosa che non esiste più: il tocco su una tacca adesso **muove** la pagina, e la
barra si muove con lei. Sono QA-017, QA-041, QA-054, QA-064, QA-098, QA-099,
QA-115, QA-116, QA-132, QA-170, QA-171 e QA-309 — di cui sei erano `OK` — e ne
arrivano dodici nuove, da QA-339 a QA-350: il centraggio della prima e
dell'ultima serata, il movimento della barra, la pressione del dito, il lettore
che riprende lo scorrimento mentre un salto è in volo, e una serata aperta in
una scheda di sfondo.

L'osservazione della corsa precedente resta scritta dov'era. QA-099 in
particolare porta ancora la sua — *«Manca l'animazione dello scorrimento»* — ed
è il reclamo da cui nasce la PR 20: cancellarla per riaprire la riga avrebbe
tolto la traccia proprio dal posto in cui qualcuno la cercherebbe.
