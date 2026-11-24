// Crea i PDF da stampare a partire da stampa/carte-8.html e stampa/carte-12.html.
// Richiede Playwright: npm install playwright && npx playwright install chromium
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const nome of ['carte-8', 'carte-12', 'carte-8-senza-qr', 'carte-12-senza-qr', 'insegnante']) {
    const html = path.resolve(__dirname, '..', 'stampa', nome + '.html');
    if (!fs.existsSync(html)) continue;
    await page.goto('file://' + html);
    await page.pdf({ path: path.resolve(__dirname, '..', 'stampa', nome + '.pdf'), preferCSSPageSize: true, printBackground: true });
    console.log('Creato stampa/' + nome + '.pdf');
  }
  await browser.close();
})();
