import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const catalog=JSON.parse(await readFile(new URL('shared/service-catalog.json',root)));
const response=await fetch('http://localhost:5001/api/services');
assert.equal(response.status,200);
const records=await response.json();
const offerings=catalog.categories.flatMap(c=>c.offerings);
assert.equal(catalog.categories.length,7);
assert.equal(offerings.length,44);
assert.equal(new Set(offerings.map(o=>o.key)).size,44);
for(const category of catalog.categories) {
  await access(new URL(`public${category.image}`,root));
  await access(new URL(`public${category.image.replace('.webp','-card.webp')}`,root));
  for(const offering of category.offerings) {
    const matches=records.filter(s=>s.catalogKey===offering.key);
    assert.equal(matches.length,1,`${offering.title}: exactly one record`);
    assert.equal(matches[0].title,offering.title);
    assert.equal(matches[0].categoryId,category.id);
    assert.equal(matches[0].image,category.image);
    assert.equal(matches[0].capabilities.length,3);
    assert.equal(matches[0].process.length,4);
  }
}
for(const title of ['Custom Software','AI Strategy','Generative AI','MLOps']) assert.ok(records.some(s=>s.title===title),`Preserved ${title}`);
assert.equal(records.length,48, '44 core offerings and four preserved specialists');
console.log(`Verified ${offerings.length} requested offerings, 7 category images with 7 thumbnails, and 4 preserved specialist services.`);
