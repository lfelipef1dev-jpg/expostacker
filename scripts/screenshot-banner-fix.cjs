const puppeteer = require('puppeteer');
const path = require('path');

const sites = [
  { slug: 'medellin-ecommerce', url: 'https://medellin.expostacker.com.br' },
  { slug: 'tigrebet', url: 'https://tigrebet.expostacker.com.br' },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const site of sites) {
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 900, height: 900, deviceScaleFactor: 2 });
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      const out = path.join(__dirname, '..', 'public', 'banner', site.slug + '-banner.jpg');
      await page.screenshot({ path: out, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 900, height: 900 } });
      console.log('OK: ' + site.slug);
      await page.close();
    } catch (e) {
      console.log('ERRO: ' + site.slug + ' - ' + e.message);
    }
  }

  await browser.close();
  console.log('Done.');
})();
