const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');

async function convertImage(input) {
  const ext = path.extname(input).toLowerCase();
  const base = input.replace(ext, '');
  const output = `${base}.webp`;

  if (fs.existsSync(output)) {
    return output;
  }

  try {
    await sharp(input)
      .webp({ quality: 85, effort: 4 })
      .toFile(output);
    return output;
  } catch (err) {
    console.error('Falha ao converter:', input, err.message);
    return null;
  }
}

async function main() {
  const bannerDir = path.join(publicDir, 'banner');
  const casesDir = path.join(publicDir, 'cases');

  const bannerJpg = fs.readdirSync(bannerDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  const caseJpg = fs.readdirSync(casesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

  const inputs = [
    ...bannerJpg.map(f => path.join(bannerDir, f)),
    ...caseJpg.map(f => path.join(casesDir, f)),
  ];

  const generated = [];
  for (const input of inputs) {
    const out = await convertImage(input);
    if (out) generated.push(out);
  }

  console.log(`Imagens otimizadas: ${generated.length}`);
}

main().catch(console.error);
