const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const sites = [
  { slug: 'gerenciador-frotas', url: 'https://frotamais.expostacker.com.br' },
  { slug: 'gordaomod', url: 'https://gordaomod.expostacker.com.br' },
  { slug: 'marken-fassi', url: 'https://marken.expostacker.com.br' },
  { slug: 'medellin-ecommerce', url: 'https://medellin.expostacker.com.br' },
  { slug: 'sanatto-facilities', url: 'https://sanatto.expostacker.com.br' },
  { slug: 'seeds-experience', url: 'https://seeds.expostacker.com.br' },
  { slug: 'sistema-faturamento-saas', url: 'https://faturamais.expostacker.com.br' },
  { slug: 'solmais', url: 'https://solmais.expostacker.com.br' },
  { slug: 'tigrebet', url: 'https://tigrebet.expostacker.com.br' },
  { slug: 'vendamais', url: 'https://vendamais.expostacker.com.br' },
  { slug: 'vivamais', url: 'https://vivamais.expostacker.com.br' }
];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const site of sites) {
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      const out = path.join(__dirname, '..', 'public', 'cases', site.slug + '-hero.jpg');
      await page.screenshot({ path: out, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 1440, height: 900 } });
      console.log('OK: ' + site.slug);
      await page.close();
    } catch (e) {
      console.log('ERRO: ' + site.slug + ' - ' + e.message);
    }
  }

  await browser.close();
  console.log('Done.');
})();
