import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
const catalog = JSON.parse(await readFile(new URL('../shared/service-catalog.json', import.meta.url)));
const target = new URL('../public/images/services/premium/', import.meta.url);
await mkdir(target, { recursive: true });
for (const category of catalog.categories) {
  const source = new URL(`../assets/service-artwork/${category.imageKey}-v1.png`, import.meta.url);
  for (const [suffix, width] of [['', 1200], ['-card', 640]]) {
    const output = new URL(`${category.imageKey}-v1${suffix}.webp`, target);
    const result = await sharp(source.pathname).resize({ width, withoutEnlargement: true }).webp({ quality: 85, effort: 6 }).toFile(output.pathname);
    console.log(`${category.imageKey}${suffix}: ${Math.round(result.size / 1024)} KB`);
  }
}
