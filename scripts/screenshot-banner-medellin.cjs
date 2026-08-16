const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://medellin.expostacker.com.br', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  const out = path.join(__dirname, '..', 'public', 'banner', 'medellin-ecommerce-banner.jpg');
  await page.screenshot({ path: out, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 900, height: 900 } });
  console.log('OK: medellin-ecommerce-banner.jpg');
  await browser.close();
})();
