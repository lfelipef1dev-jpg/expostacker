const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://tigrebet.expostacker.com.br', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Rola 100px para baixo pra centralizar os 4 cards
  await page.evaluate(() => { window.scrollBy(0, 100); });
  await new Promise(r => setTimeout(r, 500));

  const out = path.join(__dirname, '..', 'public', 'banner', 'tigrebet-banner-preview.jpg');
  await page.screenshot({ path: out, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 900, height: 900 } });
  console.log('OK: tigrebet-banner-preview.jpg');
  await browser.close();
})();
