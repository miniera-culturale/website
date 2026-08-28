# Controllo qualità — quello che resta da fare

**156 controlli**, divisi per dispositivo. Ogni casella è **una azione sola**, su un
dispositivo solo, contro un componente solo: o è stata fatta o non lo è stata. Se per
rispondere a una riga ti servono due gesti, la riga è scritta male — dillo invece di
arrangiarti, perché è così che un collaudo comincia a mentire.

Il sito da provare è **https://website-e69.pages.dev**

> Questo file è **generato** da [`controllo-qualita.csv`](controllo-qualita.csv), che è la
> fonte. Spunta pure le caselle qui: quando hai finito un gruppo, gli esiti tornano nel CSV e
> il file si rigenera. Il verso è sempre quello — dal CSV alle viste, mai il contrario.

**★ = priorità alta**, cioè la matrice minima da percorrere prima di chiudere la PR.

## Quanto manca

| Dispositivo | Da fare | di cui ★ |
|---|---|---|
| [iPhone Safari 15.4-16.3](#iphone-safari-154-163) | 32 | 22 |
| [iPhone recente (Safari 18+)](#iphone-recente-safari-18) | 63 | 40 |
| [Android Chrome recente](#android-chrome-recente) | 1 | 1 |
| [Android di 4 anni (Chrome)](#android-di-4-anni-chrome) | 4 | 3 |
| [iPad (Safari)](#ipad-safari) | 1 | 0 |
| [Desktop Chrome (Windows)](#desktop-chrome-windows) | 19 | 11 |
| [Desktop Firefox (Windows)](#desktop-firefox-windows) | 8 | 6 |
| [Desktop Safari (macOS)](#desktop-safari-macos) | 28 | 21 |
| **Totale** | **156** | **104** |

---

## iPhone Safari 15.4-16.3

*32 controlli.* È la soglia dichiarata del progetto e non l’ha mai aperta nessuno. Se qui il layout arriva a due colonne invece che a una, il minificatore ha riscritto le media query nella sintassi range e ogni telefono fra 15.4 e 16.3 riceve il layout del desktop: è il difetto che questo dispositivo esiste per trovare, e l’unica cosa che oggi lo difende è una guardia.

### verticale

**Su `/`**

- [ ] **QA-001** ★ · Programme — Aprire l’indirizzo e guardare cosa è a schermo
      → *Si apre sulla serata 81, la prima futura non annullata, non in cima all’archivio*

- [ ] **QA-002** ★ · Programme — Un flick verso l’alto
      → *Lo snap aggancia la serata 82 intera; non resta a metà fra due scene*

- [ ] **QA-015** ★ · Timeline — Guardare la barra in basso
      → *La pillola piena è la serata a schermo*

- [ ] **QA-016** ★ · Timeline — Scorrere la barra di lato fino alla serata 78
      → *La barra scorre, ogni tacca porta la sua data, nessuna è un segno nudo*

- [ ] **QA-017** ★ · Timeline — Toccare la tacca della serata 78
      → *La pagina si muove fino alla 78 e ci si ferma: rotaia, accento e indirizzo dicono tutti la 78*

- [ ] **QA-018** ★ · Timeline — Misurare la pillola con un dito
      → *Almeno 44 px di altezza; toccandone una non si colpisce quella accanto*

- [ ] **QA-019** ★ · SiteNav — Leggere il marchio nella pillola in alto
      → *La scritta «in Periferia» c’è per intero e si legge*

- [ ] **QA-020** ★ · SiteNav — Toccare la tendina
      → *Si apre e mostra le quattro voci; il pannello non esce dal bordo dello schermo*

- [ ] **QA-022** ★ · CycleAccents — Passare dalla serata 81 (verde) alla 83 (turchese)
      → *L’accento del sito cambia una volta sola, senza lampeggiare sui colori intermedi*

- [ ] **QA-069** ★ · Programme — Guardare se il layout è quello del telefono o quello del desktop
      → *Layout a una colonna: le media query si applicano, quindi il minificatore non ha riscritto la sintassi range*

- [ ] **QA-070** ★ · Programme — Scorrere con la barra di Safari mostrata e poi ritratta
      → *La scena resta alta quanto lo schermo e le posizioni di snap non saltano (svh, non dvh)*

- [ ] **QA-345** ★ · Timeline — Toccare una tacca lontana e guardare la barra
      → *La barra si muove fino a portare la pillola al centro: si vede il movimento, non uno scatto*

- [ ] **QA-346** ★ · Timeline — Guardare dove sta la pillola della serata a schermo, all’apertura e sulla serata più vecchia
      → *È al centro della barra in tutt’e due i casi*

- [ ] **QA-003** · Programme — Trascinare lentamente fino a metà scena e rilasciare
      → *Atterra su una sola scena e non oscilla fra le due*

- [ ] **QA-021** · SiteNav — Provare a toccare «Rassegna stampa»
      → *Non è toccabile e si vede che non lo è: nessun cambio di stato*

- [ ] **QA-023** · GuestRow — Guardare il ritratto di un relatore
      → *Ritagliato a fiore, non un quadrato né un cerchio*

- [ ] **QA-024** · Base — Guardare la linguetta e la barra del browser
      → *La favicon si legge; la barra è colorata come il sito (theme-color)*

- [ ] **QA-072** · Timeline — Guardare lo sfondo della barra in basso
      → *La barra è velata e leggibile: il -webkit-backdrop-filter è quello che risponde qui*

- [ ] **QA-073** · Scene — Scorrere venti serate di seguito
      → *Nessuno scatto: senza content-visibility la pagina resta comunque fluida*

**Su `/78`**

- [ ] **QA-014** ★ · Modal — Toccare «Rivedi la serata»
      → *Il pannello porta il titolo della serata e le righe dei materiali*

- [ ] **QA-009** · Scene — Guardare la descrizione su schermo corto
      → *La descrizione cede prima della fotografia, che resta sempre*

**Su `/80`**

- [ ] **QA-008** ★ · Scene — Guardare la serata annullata
      → *Titolo e data barrati, la parola «annullata» leggibile sopra il titolo*

**Su `/81`**

- [ ] **QA-004** ★ · Scene — Leggere il titolo della serata
      → *Intero, non tagliato dal bordo né coperto dalla pillola della navigazione*

- [ ] **QA-005** ★ · Scene — Guardare la fotografia
      → *La capsula inclinata sta nella sua fascia e non copre titolo né occhiello*

- [ ] **QA-007** ★ · Scene — Leggere la nota sotto i bottoni
      → *Leggibile per intero, non tagliata dalla barra della Timeline*

- [ ] **QA-010** ★ · Button — Toccare «Prenota il posto»
      → *Si apre il modale con la spiegazione, non direttamente WhatsApp*

- [ ] **QA-011** ★ · Modal — Leggere il pannello aperto
      → *Il testo sta dentro il pannello; se è lungo scorre il pannello e non la pagina*

- [ ] **QA-012** ★ · Modal — Toccare la X di chiusura
      → *Si chiude e la pagina è rimasta sulla serata 81*

- [ ] **QA-071** ★ · Modal — Toccare «Prenota il posto»
      → *Il modale si apre; se <dialog> non c’è, al suo posto compare il link diretto e non un bottone morto*

- [ ] **QA-006** · Scene — Leggere la riga della sede
      → *Nome del luogo sopra, via e città sotto, su due righe distinte*

- [ ] **QA-013** · Modal — Toccare il fondo scuro fuori dal pannello
      → *Si chiude*

- [ ] **QA-074** · Scene — Guardare la descrizione tagliata a tre righe
      → *Il taglio funziona e non lascia una riga a metà*


---

## iPhone recente (Safari 18+)

*63 controlli.* Il telefono su cui il sito verrà letto davvero. Qui `content-visibility` esiste, quindi è anche l’unico posto in cui si vede se lo scorrimento di ottantuno serate resta fluido.

### VoiceOver

**Su `/`**

- [ ] **QA-219** ★ · Timeline — Scorrere fino a una tacca con VoiceOver
      → *Annunciata come link, con la data e il titolo della serata; la corrente è annunciata come corrente*

- [ ] **QA-223** ★ · SiteNav — Aprire la tendina con VoiceOver
      → *Si annuncia espansa o compressa*

- [ ] **QA-224** · Base — Chiedere l’elenco dei landmark
      → *Navigazione, contenuto principale e rotaia sono nominati e distinti*

**Su `/78`**

- [ ] **QA-225** · Scene — Ascoltare un link ai materiali
      → *Si sente che si apre in una nuova scheda*

**Su `/80`**

- [ ] **QA-221** ★ · Scene — Ascoltare la serata annullata
      → *Si sente che è annullata: la barratura non si annuncia, e infatti c’è la parola*

**Su `/81`**

- [ ] **QA-220** ★ · Scene — Percorrere la scena con VoiceOver
      → *Titolo, stato, data, sede e nota si sentono in ordine; la foto non viene annunciata*

- [ ] **QA-222** ★ · Modal — Aprire il modale con VoiceOver
      → *Il pannello ha un nome, il fuoco ci atterra dentro e il resto della pagina è inerte*

### contenuto fabbricato

**Su `/`**

- [ ] **QA-258** ★ · Scene — Guardare lo stesso titolo di novanta caratteri sul telefono
      → *Non copre la foto né esce dalla scena*
      · **Già misurato:** Misurato in emulazione a 375x812, quindi da confermare su un iPhone vero: con lo stesso titolo il testo della scena viene ritagliato di 111 px, e il titolo occupa quattro righe a 22 px. Sul telefono non esce — viene tagliato, che è la scelta della PR 18 — ma quello che sparisce sono la nota e i bottoni.

### orizzontale

**Su `/`**

- [ ] **QA-078** ★ · Timeline — Guardare la barra in basso in orizzontale
      → *La barra non copre la nota né i bottoni della scena*

- [ ] **QA-079** ★ · SiteNav — Guardare la pillola in alto in orizzontale
      → *Non copre il titolo della serata*

- [ ] **QA-083** · Programme — Ruotare mentre si è sulla serata 82
      → *Dopo la rotazione si è ancora sulla 82 e non su un’altra*

**Su `/78`**

- [ ] **QA-080** · Scene — Guardare la serata con i materiali in orizzontale
      → *Il bottone «Rivedi la serata» è raggiungibile senza scorrere la scena*

**Su `/81`**

- [ ] **QA-076** ★ · Scene — Ruotare il telefono e guardare la scena
      → *Titolo, data, sede, bottoni e nota sono tutti a schermo*

- [ ] **QA-077** ★ · Scene — Guardare la fotografia in orizzontale
      → *La foto non schiaccia il testo né esce dalla sua fascia*

- [ ] **QA-337** ★ · Scene — Guardare la scena con altezza utile sotto i 400 px
      → *Registrare che cosa si accavalla: è il caso che la PR 18 non ha tarato*

- [ ] **QA-081** · Modal — Aprire il modale in orizzontale
      → *Il pannello sta nello schermo e la X non finisce fuori dal bordo*

**Su `/chi-siamo`**

- [ ] **QA-082** · pages.css — Scorrere la pagina in orizzontale
      → *Le colonne si ricompongono, niente scorrimento laterale*

### risparmio dati

**Su `/`**

- [ ] **QA-188** · Scene — Aprire il sito con il risparmio dati attivo
      → *Le fotografie arrivano, o lasciano uno spazio pulito che non sposta lo snap*

### schermata Home

**Su `/`**

- [ ] **QA-282** ★ · Base — Aggiungere il sito alla schermata Home di iOS
      → *C’è un’icona vera e non una miniatura della pagina (apple-touch-icon)*

### testo di sistema 200%

**Su `/`**

- [ ] **QA-167** ★ · Timeline — Guardare la barra con il testo al 200%
      → *Le date restano leggibili e la barra non copre la nota della scena*

**Su `/81`**

- [ ] **QA-166** ★ · Scene — Alzare il testo di sistema al 200% e riaprire la scena
      → *Il testo cresce davvero e resta dentro la scena, senza finire sotto la barra*

### verticale

**Su `/`**

- [ ] **QA-025** ★ · Programme — Aprire l’indirizzo e guardare cosa è a schermo
      → *Si apre sulla serata 81, la prima futura non annullata, non in cima all’archivio*

- [ ] **QA-026** ★ · Programme — Un flick verso l’alto
      → *Lo snap aggancia la serata 82 intera; non resta a metà fra due scene*

- [ ] **QA-039** ★ · Timeline — Guardare la barra in basso
      → *La pillola piena è la serata a schermo*

- [ ] **QA-040** ★ · Timeline — Scorrere la barra di lato fino alla serata 78
      → *La barra scorre, ogni tacca porta la sua data, nessuna è un segno nudo*

- [ ] **QA-041** ★ · Timeline — Toccare la tacca della serata 78
      → *La pagina si muove fino alla 78 e ci si ferma: rotaia, accento e indirizzo dicono tutti la 78*

- [ ] **QA-042** ★ · Timeline — Misurare la pillola con un dito
      → *Almeno 44 px di altezza; toccandone una non si colpisce quella accanto*

- [ ] **QA-043** ★ · SiteNav — Leggere il marchio nella pillola in alto
      → *La scritta «in Periferia» c’è per intero e si legge*

- [ ] **QA-044** ★ · SiteNav — Toccare la tendina
      → *Si apre e mostra le quattro voci; il pannello non esce dal bordo dello schermo*

- [ ] **QA-046** ★ · CycleAccents — Passare dalla serata 81 (verde) alla 83 (turchese)
      → *L’accento del sito cambia una volta sola, senza lampeggiare sui colori intermedi*

- [ ] **QA-283** ★ · Base — Guardare il colore della barra del browser
      → *Colorata come il sito (theme-color)*

- [ ] **QA-334** ★ · Timeline — Toccare una tacca e poi il gesto indietro
      → *Stesso esito del desktop*

- [ ] **QA-339** ★ · Timeline — Aprire il sito e guardare dove sta la pillola della serata a schermo
      → *È al centro della barra, non attaccata al bordo destro*

- [ ] **QA-340** ★ · Timeline — Scorrere fino alla serata più vecchia dell’archivio e guardare la sua pillola
      → *È al centro della barra; a sinistra resta mezza barra vuota, ed è voluto*

- [ ] **QA-341** ★ · Timeline — Toccare una tacca lontana e guardare la barra
      → *La barra si muove fino a portare la pillola al centro: si vede il movimento, non uno scatto*

- [ ] **QA-342** ★ · Timeline — Tenere il dito su una tacca senza rilasciare
      → *La pillola cede sotto il dito e torna com’era al rilascio*

- [ ] **QA-343** ★ · Programme — Toccare una tacca lontana e riprendere subito lo scorrimento con il dito
      → *Il dito vince: la pagina resta dove la lascia il lettore e non viene strattonata sulla serata del tocco*

- [ ] **QA-027** · Programme — Trascinare lentamente fino a metà scena e rilasciare
      → *Atterra su una sola scena e non oscilla fra le due*

- [ ] **QA-045** · SiteNav — Provare a toccare «Rassegna stampa»
      → *Non è toccabile e si vede che non lo è: nessun cambio di stato*

- [ ] **QA-047** · GuestRow — Guardare il ritratto di un relatore
      → *Ritagliato a fiore, non un quadrato né un cerchio*

- [ ] **QA-048** · Base — Guardare la linguetta e la barra del browser
      → *La favicon si legge; la barra è colorata come il sito (theme-color)*

- [ ] **QA-309** · Timeline — Scorrere il programma e guardare la barra
      → *La pillola corrente arriva al centro con un movimento visibile, non di scatto*

- [ ] **QA-330** · Programme — Cercare nella pagina una serata lontana
      → *La ricerca del browser la trova: content-visibility non la nasconde*

**Su `/78`**

- [ ] **QA-038** ★ · Modal — Toccare «Rivedi la serata»
      → *Il pannello porta il titolo della serata e le righe dei materiali*

- [ ] **QA-033** · Scene — Guardare la descrizione su schermo corto
      → *La descrizione cede prima della fotografia, che resta sempre*

**Su `/80`**

- [ ] **QA-032** ★ · Scene — Guardare la serata annullata
      → *Titolo e data barrati, la parola «annullata» leggibile sopra il titolo*

**Su `/81`**

- [ ] **QA-028** ★ · Scene — Leggere il titolo della serata
      → *Intero, non tagliato dal bordo né coperto dalla pillola della navigazione*

- [ ] **QA-029** ★ · Scene — Guardare la fotografia
      → *La capsula inclinata sta nella sua fascia e non copre titolo né occhiello*

- [ ] **QA-031** ★ · Scene — Leggere la nota sotto i bottoni
      → *Leggibile per intero, non tagliata dalla barra della Timeline*

- [ ] **QA-034** ★ · Button — Toccare «Prenota il posto»
      → *Si apre il modale con la spiegazione, non direttamente WhatsApp*

- [ ] **QA-035** ★ · Modal — Leggere il pannello aperto
      → *Il testo sta dentro il pannello; se è lungo scorre il pannello e non la pagina*

- [ ] **QA-036** ★ · Modal — Toccare la X di chiusura
      → *Si chiude e la pagina è rimasta sulla serata 81*

- [ ] **QA-030** · Scene — Leggere la riga della sede
      → *Nome del luogo sopra, via e città sotto, su due righe distinte*

- [ ] **QA-037** · Modal — Toccare il fondo scuro fuori dal pannello
      → *Si chiude*

**Su `/85`**

- [ ] **QA-344** ★ · Programme — Aprire /85 in una scheda nuova di sfondo e passarci solo dopo che ha finito di caricare
      → *Si apre sulla serata 85 e non in cima all’archivio*

**Su `/componenti`**

- [ ] **QA-301** ★ · Button — Toccare un bottone e poi toccare altrove
      → *Lo stato premuto non resta appiccicato: è l’hover appiccicoso di iOS*

- [ ] **QA-295** · Button — Guardare le varianti primaria, secondaria e disabilitata
      → *Tre rese distinte; la disabilitata si annuncia come tale*

- [ ] **QA-296** · Button — Premere e tenere premuto un bottone
      → *L’effetto premuto arriva con :active e torna al rilascio*

- [ ] **QA-297** · Label — Guardare i toni dell’etichetta
      → *Ogni tono si legge sul fondo su cui sta*

- [ ] **QA-298** · Card — Guardare la scheda in tutte le varianti
      → *Bordi, ombre e spaziature coerenti con il resto del sito*

- [ ] **QA-299** · Brand — Guardare il marchio alle altezze dichiarate
      → *La firma resta leggibile a ogni altezza*

- [ ] **QA-300** · SignatureBand — Guardare la banda
      → *La firma non si taglia ai bordi*

- [ ] **QA-302** · GuestRow — Toccare una riga di ospite
      → *Nessuno stato di hover che resta acceso*


---

## Android Chrome recente

*1 controlli.* Era finito, e la PR 20 lo riapre su una riga sola: il movimento della barra è la cosa che questo dispositivo aveva già visto funzionare, e adesso funziona diversamente.

### verticale

**Su `/`**

- [ ] **QA-054** ★ · Timeline — Scorrere la barra fino alla 78 e toccarla
      → *La barra si muove fino a portare la pillola al centro e la pagina arriva sulla 78*


---

## Android di 4 anni (Chrome)

*4 controlli.* Non un modello di punta: serve un telefono lento, perché la domanda è se il sito resti usabile su quello che ha in tasca il pubblico dell’associazione.

### 3G lenta

**Su `/`**

- [ ] **QA-327** ★ · Programme — Aprire il sito su rete lenta e cronometrare
      → *La prima serata è leggibile in un tempo accettabile: scrivere il numero*

- [ ] **QA-328** · Scene — Guardare l’arrivo della prima fotografia
      → *Arriva dopo il testo e non sposta niente quando arriva*

### verticale

**Su `/`**

- [ ] **QA-064** ★ · Timeline — Scorrere la barra fino alla 78 e toccarla
      → *La barra si muove fino a portare la pillola al centro e la pagina arriva sulla 78*
      · **Già misurato:** Provata su un Google Pixel (modello da registrare).

- [ ] **QA-347** ★ · Timeline — Toccare una tacca lontana e guardare la barra
      → *La barra si muove fino a centrare la pillola, e il movimento non è a scatti su un telefono di quattro anni*


---

## iPad (Safari)

*1 controlli.* Il caso di confine dei 900 px: in verticale prende il layout del telefono, in orizzontale quello del desktop, e il passaggio fra i due è ciò che si guarda.

### orizzontale (1180 px)

**Su `/`**

- [ ] **QA-161** · Programme — Uno scorrimento con due dita
      → *Lo snap aggancia una serata sola*


---

## Desktop Chrome (Windows)

*19 controlli.* Quello che resta qui non è di resa: è il CMS, che scrive davvero sul repository, e due gesti che nessuna automazione può fare.

### 1280x800

**Su `/`**

- [ ] **QA-098** ★ · Timeline — Cliccare la tacca della serata 78
      → *La pagina si muove fino alla 78 e ci si ferma: rotaia, accento e indirizzo dicono tutti la 78*

- [ ] **QA-099** ★ · Timeline — Cliccare due tacche lontane a due decimi di distanza
      → *Atterra sulla seconda; rotaia, accento e indirizzo dicono la stessa serata*

- [ ] **QA-331** · Programme — Cercare con Ctrl+F il titolo della serata 78 partendo da /
      → *Il browser la trova e ci porta*

- [ ] **QA-335** · Timeline — Cliccare una tacca con il tasto centrale del mouse
      → *Si apre in una nuova scheda: il click di comando resta al browser*

**Su `/85`**

- [ ] **QA-349** ★ · Programme — Aprire /85 in una scheda di sfondo con Ctrl+clic e passarci dopo
      → *Si apre sulla serata 85 e non in cima all’archivio*

**Su `/admin`**

- [ ] **QA-320** ★ · Sveltia CMS — Caricare una fotografia oltre il tetto dichiarato
      → *Il CMS la rifiuta prima del commit*

- [ ] **QA-321** ★ · Sveltia CMS — Guardare la build partire dopo il salvataggio
      → *La build parte e finisce verde; cronometrare quanto ci mette*

- [ ] **QA-322** · Sveltia CMS — Rileggere le etichette dei campi
      → *Tutte in italiano, con gli accenti per intero*

- [ ] **QA-326** · Sveltia CMS — Modificare il colore di un ciclo e salvare
      → *Dopo la build l’accento di quel ciclo è cambiato su tutte le sue serate*

### 3G lenta

**Su `/`**

- [ ] **QA-329** · Base — Guardare quando compaiono i caratteri
      → *Il testo è leggibile subito in Arial, poi passa ad Archivo Black*

### NVDA

**Su `/`**

- [ ] **QA-226** ★ · Base — Chiedere l’elenco delle intestazioni
      → *Un solo H1 per rotta e un H2 per serata, in ordine*
      · **Già misurato:** Da guardare con NVDA: nell’elenco delle intestazioni compare un H2 vuoto, che è il titolo del modale — resta senza testo finché il modale non viene aperto.

- [ ] **QA-227** ★ · Timeline — Percorrere le tacche con NVDA
      → *Ogni tacca è un link con data e titolo; la corrente è annunciata come corrente*

**Su `/81`**

- [ ] **QA-228** ★ · Modal — Aprire e chiudere il modale con NVDA
      → *Nome annunciato, fuoco dentro, resto inerte, ritorno al bottone*

**Su `/chi-siamo`**

- [ ] **QA-229** · pages.css — Percorrere le sezioni della pagina
      → *Ogni sezione è nominata dalla sua intestazione*

**Su `/componenti`**

- [ ] **QA-231** · Rassegna — Percorrere la pagina dei componenti
      → *Ogni componente ha un nome accessibile, nessuno è muto*

**Su `/contatti`**

- [ ] **QA-230** · pages.css — Ascoltare la riga del numero WhatsApp
      → *Il numero si sente in modo comprensibile*

### prefers-reduced-motion

**Su `/`**

- [ ] **QA-170** ★ · Programme — Attivare la riduzione del movimento e scorrere
      → *Nessuna animazione di scorrimento; i salti sono immediati*
      · **Già misurato:** Quello che hai visto è l’esito atteso: il progetto non anima nessuno scorrimento per costruzione (regola 15), quindi sotto prefers-reduced-motion non cambia niente ed è giusto così. La riga andrebbe letta come OK.

- [ ] **QA-171** ★ · Timeline — Cliccare una tacca lontana
      → *Il salto è immediato, nessuna transizione lunga sulle tacche*

- [ ] **QA-348** ★ · Timeline — Attivare la riduzione del movimento e cliccare una tacca lontana
      → *Né la pagina né la barra si animano: tutt’e due arrivano di colpo*


---

## Desktop Firefox (Windows)

*8 controlli.* Ventiquattro righe su ventinove sono già state percorse pilotando Firefox 153. Le cinque che restano hanno tutte la stessa ragione: `document.hasFocus()` è falso quando la finestra non è in primo piano, quindi nessuno stile di messa a fuoco si applica e la domanda «si vede?» non si può porre da uno script.

### 1280x800

**Su `/`**

- [ ] **QA-115** ★ · Timeline — Cliccare la tacca della serata 78
      → *La pagina si muove fino alla 78 e ci si ferma: rotaia, accento e indirizzo dicono tutti la 78*
      · **Già misurato:** Atterra sulla 78, indirizzo /78#serata-78, accento del ciclo 2

- [ ] **QA-116** ★ · Timeline — Cliccare due tacche lontane a due decimi di distanza
      → *Atterra sulla seconda; rotaia, accento e indirizzo dicono la stessa serata*
      · **Già misurato:** Due click a due decimi di distanza: scena 83, indirizzo /83, accento 6, tacca corrente all’indice 4 — le quattro cose concordano

- [ ] **QA-350** · Timeline — Cliccare due tacche lontane a due decimi di distanza e guardare dove si ferma la pagina
      → *Si ferma sulla seconda; se il primo salto viene lasciato cadere si vede uno scatto, non una serata sbagliata*

### anteprima di stampa

**Su `/81`**

- [ ] **QA-315** · Scene — Stampare la stessa serata da Firefox
      → *Stesso risultato di Chrome*

### sola tastiera

**Su `/`**

- [ ] **QA-199** ★ · Base — Premere Tab una volta dall’apertura
      → *Compare «Salta al programma», visibile e leggibile*
      · **Già misurato:** NON MISURABILE in automazione: document.hasFocus() è false perché la finestra non è in primo piano, quindi :focus non fa match e il salta-a resta a translateY(-45px). Da fare a mano

- [ ] **QA-201** ★ · SiteNav — Tabulare attraverso le voci di navigazione
      → *Ogni voce prende il fuoco con un contorno visibile; «Rassegna stampa» viene saltata*
      · **Già misurato:** NON MISURABILE per la stessa ragione di QA-199: nessuno stile :focus-visible si applica. Quello che si è potuto verificare è che «Rassegna stampa» viene saltata dal Tab, come deve

- [ ] **QA-205** ★ · Timeline — Tabulare fino a una tacca
      → *Il contorno di messa a fuoco si vede per intero, anche sulla pillola piena*
      · **Già misurato:** NON MISURABILE per la stessa ragione di QA-199. Il CSS pubblicato dichiara .timeline-tick:focus-visible con outline 3px e offset di uno spazio, e la geometria dice che l’anello sta dentro la rotaia: resta da vederlo

**Su `/81`**

- [ ] **QA-206** ★ · Modal — Aprire il modale con Invio e tabulare dentro
      → *Il fuoco entra nel pannello e non ne esce finché è aperto*
      · **Già misurato:** NON MISURABILE: senza il fuoco di sistema il Tab attraversa il modale invece di restarci. Il modale però si apre e si chiude, e il fuoco torna al bottone (QA-207)


---

## Desktop Safari (macOS)

*28 controlli.* L’altro motore, e il solo dispositivo su cui non è stato ancora aperto niente. Serve un Mac.

### 1280x800

**Su `/`**

- [ ] **QA-126** ★ · Programme — Aprire l’indirizzo
      → *Si apre sulla serata 81, già disegnata lì: nessun salto visibile dopo il primo disegno*

- [ ] **QA-127** ★ · Programme — Un colpo di rotella
      → *Passa a una serata sola e aggancia; la rotella non spinge due scene in una volta*

- [ ] **QA-128** ★ · Programme — Uno scorrimento con il trackpad a due dita
      → *Aggancia senza combattere il gesto: nessun rimbalzo fra due scene*

- [ ] **QA-131** ★ · Timeline — Guardare la rotaia a destra
      → *Tutte le serate hanno una tacca; le vicine portano la data, le lontane sono segni*

- [ ] **QA-132** ★ · Timeline — Cliccare la tacca della serata 78
      → *La pagina si muove fino alla 78 e ci si ferma: rotaia, accento e indirizzo dicono tutti la 78*

- [ ] **QA-133** ★ · Timeline — Cliccare due tacche lontane a due decimi di distanza
      → *Atterra sulla seconda; rotaia, accento e indirizzo dicono la stessa serata*

- [ ] **QA-137** ★ · SiteNav — Guardare la riga delle voci
      → *Quattro voci in riga; la voce della pagina corrente è evidenziata*

- [ ] **QA-138** ★ · CycleAccents — Scorrere dalla 81 alla 83
      → *L’accento della rotaia e della navigazione segue la serata a schermo*

- [ ] **QA-139** ★ · Programme — Scorrere di dieci serate e premere il tasto indietro
      → *Si esce dal sito: la cronologia non ha una voce per serata attraversata*

- [ ] **QA-140** ★ · Programme — Ricaricare mentre si è a metà archivio
      → *La pagina torna dove era o sulla serata dell’indirizzo: il ripristino del browser e il salto dello script non litigano*

- [ ] **QA-144** ★ · Programme — Premere Tab dopo il salta-a e poi Freccia giù
      → *Lo scroller prende il fuoco e le frecce muovono il programma*

- [ ] **QA-129** · Programme — Passare la rotella sopra la pillola della navigazione
      → *Il programma scorre lo stesso: la pillola non è una zona morta*

- [ ] **QA-130** · Programme — Passare la rotella sopra la rotaia della Timeline
      → *Il programma scorre lo stesso*

**Su `/81`**

- [ ] **QA-134** ★ · Scene — Leggere la scena intera
      → *Il testo non passa sotto la rotaia della Timeline*

- [ ] **QA-135** ★ · Modal — Aprire «Prenota il posto» e chiudere con Esc
      → *Si apre, Esc chiude, il fuoco torna sul bottone*

- [ ] **QA-136** · Modal — Guardare il bordo superiore del pannello
      → *È del colore del ciclo della serata da cui è stato aperto, non arancio*

- [ ] **QA-141** · Scene — Selezionare e copiare due righe della descrizione
      → *La selezione funziona e non fa scorrere la scena*

**Su `/componenti`**

- [ ] **QA-142** · Rassegna — Scorrere la rassegna dei componenti
      → *Ogni componente rende in tutte le sue varianti*

### sola tastiera

**Su `/`**

- [ ] **QA-209** ★ · Base — Premere Tab una volta dall’apertura
      → *Compare «Salta al programma», visibile e leggibile*

- [ ] **QA-210** ★ · Base — Premere Invio sul salta-a
      → *Il fuoco si sposta sul programma, non solo lo scorrimento*

- [ ] **QA-211** ★ · SiteNav — Tabulare attraverso le voci di navigazione
      → *Ogni voce prende il fuoco con un contorno visibile; «Rassegna stampa» viene saltata*

- [ ] **QA-212** ★ · Programme — Premere Freccia giù sullo scroller
      → *Passa alla serata successiva, una sola*

- [ ] **QA-213** ★ · Programme — Premere Fine e poi Home
      → *Fine va all’ultima serata, Home riporta alla prima*

- [ ] **QA-215** ★ · Timeline — Tabulare fino a una tacca
      → *Il contorno di messa a fuoco si vede per intero, anche sulla pillola piena*

- [ ] **QA-214** · Programme — Premere Maiusc+Freccia giù
      → *Non viene intercettato: è la selezione, e resta al browser*

- [ ] **QA-218** · SiteNav — Aprire la tendina con Invio
      → *Si apre e le voci dentro prendono il fuoco in ordine*

**Su `/81`**

- [ ] **QA-216** ★ · Modal — Aprire il modale con Invio e tabulare dentro
      → *Il fuoco entra nel pannello e non ne esce finché è aperto*

- [ ] **QA-217** ★ · Modal — Chiudere con Esc
      → *Si chiude e il fuoco torna sul bottone che lo ha aperto*
