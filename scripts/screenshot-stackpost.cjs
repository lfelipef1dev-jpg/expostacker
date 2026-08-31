const puppeteer = require('puppeteer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const URL = 'https://stackpost.expostacker.com.br';
const SLUG = 'stackpost';
const PUBLIC = path.join(__dirname, '..', 'public');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // === BANNER 900x900 ===
  console.log('Capturando banner 900x900...');
  await page.setViewport({ width: 900, height: 900, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  const bannerJpg = path.join(PUBLIC, 'banner', `${SLUG}-banner.jpg`);
  await page.screenshot({
    path: bannerJpg,
    type: 'jpeg',
    quality: 90,
    clip: { x: 0, y: 0, width: 900, height: 900 }
  });
  console.log('OK banner jpg: ' + bannerJpg);

  // Converter para webp
  const bannerWebp = path.join(PUBLIC, 'banner', `${SLUG}-banner.webp`);
  await sharp(bannerJpg)
    .resize(900, 900, { fit: 'cover' })
    .webp({ quality: 85 })
    .toFile(bannerWebp);
  console.log('OK banner webp: ' + bannerWebp);

  // === HERO 1440x900 ===
  console.log('Capturando hero 1440x900...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  const heroJpg = path.join(PUBLIC, 'cases', `${SLUG}-hero.jpg`);
  await page.screenshot({
    path: heroJpg,
    type: 'jpeg',
    quality: 90,
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });
  console.log('OK hero jpg: ' + heroJpg);

  // Converter para webp
  const heroWebp = path.join(PUBLIC, 'cases', `${SLUG}-hero.webp`);
  await sharp(heroJpg)
    .resize(1440, 900, { fit: 'cover' })
    .webp({ quality: 85 })
    .toFile(heroWebp);
  console.log('OK hero webp: ' + heroWebp);

  await browser.close();
  console.log('Done.');
})();
