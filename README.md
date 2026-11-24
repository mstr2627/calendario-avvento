# Calendario dell'Avvento dalla A alla Z

Materiale per un calendario dell'Avvento di una classe prima elementare:
una parola natalizia per ogni lettera dell'alfabeto, con

- una **carta da stampare** per ogni lettera: disegno in bianco e nero da colorare,
  prima lettera grande e vuota da colorare, altre lettere tratteggiate da ripassare;
- un **QR code** su ogni carta che apre la pagina della lettera sul sito;
- un **sito** con una pagina per ogni lettera con la parola letta ad alta voce,
  il disegno da colorare col dito, la parola da ripassare e (per Jingle Bells,
  Kris Kringle e White Christmas) il link alla canzone.

Sito: https://wootr0p.github.io/calendario-avvento/ (pubblicato da GitHub Pages dal ramo `gh-pages`:
dopo ogni modifica su `main` aggiornare anche `gh-pages`, per esempio con `git push origin main:gh-pages`).

## Lettere a sorpresa

Ogni lettera si scopre solo col suo QR code: le pagine hanno un nome casuale (`p/<codice>.html`,
codici in `dati/parole.json`), non hanno link alle altre lettere e la pagina iniziale non le elenca.

## Stampare

- [`stampa/carte-8.pdf`](stampa/carte-8.pdf): 8 carte per foglio A4 (4 fogli)
- [`stampa/carte-12.pdf`](stampa/carte-12.pdf): 12 carte per foglio A4 (3 fogli)

Stampare al 100% (senza "adatta alla pagina") e ritagliare lungo le linee tratteggiate grigie.

## Modificare

Le parole sono in [`dati/parole.json`](dati/parole.json): lì si cambiano anche i link
delle canzoni. I disegni sono in [`strumenti/disegni.py`](strumenti/disegni.py), le lettere
in [`strumenti/lettere.py`](strumenti/lettere.py). Dopo una modifica:

```
pip install segno
python3 strumenti/genera.py          # rigenera disegni, QR, pagine e carte
npm install playwright && npx playwright install chromium
node strumenti/stampa-pdf.js         # rigenera i PDF
```

Le canzoni non sono nel repository: i pulsanti portano a una ricerca su YouTube.
Tutti i disegni sono originali e il materiale non contiene dati personali.
