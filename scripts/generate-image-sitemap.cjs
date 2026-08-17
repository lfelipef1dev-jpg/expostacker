// generate-image-sitemap.cjs — generates an image sitemap after build
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://expostacker.com.br';
const distDir = path.join(__dirname, '..', 'dist');

const cases = [
  'tigrebet', 'medellin-ecommerce', 'seeds-experience', 'marken-fassi',
  'gerenciador-frotas', 'vivamais', 'gordaomod', 'solmais',
  'sanatto-facilities', 'sistema-faturamento-saas', 'vendamais'
];

const pages = [
  { url: '/pt/', images: ['/logo.png', '/favicon.png'] },
  { url: '/en/', images: ['/logo.png', '/favicon.png'] },
];

// Add case pages with their hero images
cases.forEach((slug) => {
  pages.push({
    url: `/pt/cases/${slug}/`,
    images: [`/cases/${slug}-hero.jpg`, `/cases/${slug}.svg`, `/banner/${slug}-banner.jpg`].filter((img) => {
      const filePath = path.join(distDir, img);
      return fs.existsSync(filePath);
    }),
  });
  pages.push({
    url: `/en/cases/${slug}/`,
    images: [`/cases/${slug}-hero.jpg`, `/cases/${slug}.svg`, `/banner/${slug}-banner.jpg`].filter((img) => {
      const filePath = path.join(distDir, img);
      return fs.existsSync(filePath);
    }),
  });
});

// Add contact pages
pages.push({ url: '/pt/contato/', images: ['/logo.png'] });
pages.push({ url: '/en/contato/', images: ['/logo.png'] });

const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map((page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
${page.images.map((img) => `    <image:image>
      <image:loc>${SITE_URL}${img}</image:loc>
    </image:image>`).join('\n')}
  </url>`).join('\n')}
</urlset>
`;

const outputPath = path.join(distDir, 'sitemap-images.xml');
fs.writeFileSync(outputPath, imageSitemap.trim());
console.log(`Image sitemap generated: ${outputPath} (${pages.length} pages)`);
