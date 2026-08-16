const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 960, deviceScaleFactor: 2 });
  await page.goto('https://gordaomod.expostacker.com.br', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const out = path.join(__dirname, '..', 'public', 'cases', 'gordaomod-card.jpg');
  await page.screenshot({ path: out, type: 'jpeg', quality: 85, clip: { x: 0, y: 0, width: 1280, height: 960 } });
  console.log('Screenshot salvo em: ' + out);
  await browser.close();
})();
