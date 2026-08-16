const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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

const scoresPath = path.join(__dirname, '..', 'src', 'data', 'scores.json');
let existing = {};
if (fs.existsSync(scoresPath)) {
  const data = JSON.parse(fs.readFileSync(scoresPath, 'utf8'));
  data.projects.forEach(p => { existing[p.slug] = p; });
}

const results = [];

(async () => {
  // Abre Chrome com remote debugging
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--remote-debugging-port=9222']
  });

  // Importa lighthouse dinamicamente
  const lighthouse = await import('lighthouse');
  const lighthouseFn = lighthouse.default || lighthouse;
  const lighthouseReport = lighthouseFn.flow ? lighthouseFn : (lighthouseFn.default || lighthouseFn);

  for (const site of sites) {
    if (existing[site.slug] && existing[site.slug].scores.total > 0) {
      console.log('Mantendo: ' + site.slug + ' — ' + existing[site.slug].scores.total);
      results.push(existing[site.slug]);
      continue;
    }

    try {
      console.log('Avaliando: ' + site.slug + '...');
      const result = await lighthouseReport(site.url, {
        port: 9222,
        output: 'json',
        onlyCategories: ['accessibility', 'seo', 'best-practices'],
        throttlingMethod: 'simulate',
        maxWaitForLoad: 60000,
        logLevel: 'error'
      });

      const lhr = result.lhr;
      const accessibility = Math.round((lhr.categories.accessibility?.score ?? 0) * 100);
      const seo = Math.round((lhr.categories['seo']?.score ?? 0) * 100);
      const bestPractices = Math.round((lhr.categories['best-practices']?.score ?? 0) * 100);

      // Performance separado
      let performance = 0;
      try {
        const perfResult = await lighthouseReport(site.url, {
          port: 9222,
          output: 'json',
          onlyCategories: ['performance'],
          throttlingMethod: 'simulate',
          maxWaitForLoad: 60000,
          logLevel: 'error'
        });
        performance = Math.round((perfResult.lhr.categories.performance?.score ?? 0) * 100);
      } catch(e) {
        console.log('  Performance skip');
      }

      const total = Math.round((performance + accessibility + seo + bestPractices) / 4);

      results.push({
        slug: site.slug,
        url: site.url,
        scores: { performance, accessibility, seo, bestPractices, total },
        evaluatedAt: new Date().toISOString()
      });

      console.log('  Score: ' + total + ' (P:' + performance + ' A:' + accessibility + ' S:' + seo + ' B:' + bestPractices + ')');
    } catch (e) {
      console.log('  ERRO: ' + (e.message || '').substring(0, 200));
      results.push({
        slug: site.slug,
        url: site.url,
        scores: { performance: 0, accessibility: 0, seo: 0, bestPractices: 0, total: 0 },
        evaluatedAt: new Date().toISOString(),
        error: (e.message || '').substring(0, 200)
      });
    }
  }

  await browser.close();

  results.sort((a, b) => b.scores.total - a.scores.total);
  results.forEach((r, i) => { r.rank = i + 1; });

  const output = {
    generatedAt: new Date().toISOString(),
    projects: results
  };

  fs.writeFileSync(scoresPath, JSON.stringify(output, null, 2));
  console.log('\nRanking final:');
  results.forEach((r) => {
    console.log('  ' + r.rank + '. ' + r.slug + ' — ' + r.scores.total + ' pts');
  });
})();
