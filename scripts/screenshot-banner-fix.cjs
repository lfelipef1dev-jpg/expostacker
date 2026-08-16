const puppeteer = require('puppeteer');
const path = require('path');

const sites = [
  { slug: 'medellin-ecommerce', url: 'https://medellin.expostacker.com.br', zoom: 0.6 },
  { slug: 'tigrebet', url: 'https://tigrebet.expostacker.com.br', zoom: 0.65 },
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

      // Aplica zoom out pra caber mais conteudo no 900x900
      await page.addStyleTag({
        content: `html { transform: scale(${site.zoom}); transform-origin: top center; width: ${100 / site.zoom}%; }`
      });
      await new Promise(r => setTimeout(r, 1500));

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
