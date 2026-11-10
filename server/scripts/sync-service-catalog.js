const path = require('node:path');
const fs = require('node:fs/promises');
const { createHash } = require('node:crypto');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { Service } = require('../models/Schemas');
const catalog = require('../../shared/service-catalog.json');
const legacy = { 'Website Development':'custom-website-development', 'Web App Development':'web-applications', 'UI/UX Design':'uiux-research-design', 'App Development':'cross-platform-applications', 'SEO & Marketing':'digital-marketing', 'AI Chatbot':'ai-agents-chatbots', Automation:'business-workflow-automation', Analytics:'business-intelligence-dashboards', 'API Platform':'api-integrations-webhooks', 'Brand Identity':'logo-visual-identity' };
const slugify = title => title.toLowerCase().normalize('NFKC').trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'item';
(async () => {
  const uri = process.env.MONGODB_URI || '';
  if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27018\/rizqara_local(?:\?|$)/.test(uri)) throw new Error('Catalog sync is restricted to the isolated local database on port 27018.');
  await mongoose.connect(uri);
  const records = await Service.find().lean();
  const apply = process.argv.includes('--apply');
  if (apply) {
    const directory = path.join(__dirname, '../../.local-data');
    await fs.mkdir(directory, {recursive:true});
    await fs.writeFile(path.join(directory, `services-before-${Date.now()}.json`), JSON.stringify(records, null, 2), {mode:0o600});
  }
  let changes=0;
  const matched = new Set();
  for (const category of catalog.categories) for (const offering of category.offerings) {
    const existing = records.find(s => s.catalogKey === offering.key || legacy[s.title] === offering.key || s.title.toLowerCase() === offering.title.toLowerCase());
    if (existing) matched.add(existing.id);
    const data = { title:offering.title, title_bn:offering.title_bn, description:offering.summary, description_bn:offering.summary_bn, details:`${offering.summary} ${category.description}`, details_bn:`${offering.summary_bn} ${category.description_bn}`, icon:category.icon, capabilities:offering.deliverables, capabilities_bn:offering.deliverables, process:catalog.process, process_bn:catalog.process_bn, categoryId:category.id, catalogKey:offering.key, displayOrder:category.order*100+offering.order, image:category.image, imageAlt:category.imageAlt, gallery:[] };
    const revision=createHash('sha256').update(JSON.stringify(data)).digest('hex');
    if (existing?.catalogRevision === revision) continue;
    changes++;
    console.log(`${existing ? 'UPDATE' : 'ADD'} ${offering.title}`);
    if (!apply) continue;
    if (existing) {
      const oldSlug=slugify(existing.title);
      const result=await Service.updateOne({_id:existing._id,__v:existing.__v ?? 0}, {$set:{...data,catalogRevision:revision,slug:existing.slug || `${oldSlug}-${existing.id.slice(0,8)}`,previousSlugs:[...new Set([...(existing.previousSlugs||[]),oldSlug,`${oldSlug}-${existing.id}`,existing.title.toLowerCase().trim().replace(/\s+/g,'-').replace(/[^\w-]/g,'')])]},$inc:{__v:1}}, {runValidators:true});
      if (result.modifiedCount !== 1) throw new Error(`Concurrent edit: ${existing.id}`);
    } else await Service.create({id:`svc-${offering.key}`,slug:offering.key,...data,catalogRevision:revision});
  }
  for (const record of records.filter(s => !matched.has(s.id) && !s.catalogKey)) {
    const category=catalog.categories.find(c => c.id === (['AI Strategy','Generative AI','MLOps'].includes(record.title) ? 'ai-automation' : 'enterprise-custom-solutions'));
    if (record.categoryId === category.id && record.image === category.image) continue;
    changes++;
    console.log(`PRESERVE specialist: ${record.title}`);
    if (apply) {
      const result=await Service.updateOne({_id:record._id,__v:record.__v ?? 0}, {$set:{categoryId:category.id,image:category.image,imageAlt:category.imageAlt},$inc:{__v:1}}, {runValidators:true});
      if(result.modifiedCount !== 1) throw new Error(`Concurrent edit: ${record.id}`);
    }
  }
  console.log(`${apply ? 'Applied' : 'Dry run:'} ${changes} changes; ${catalog.categories.length} categories, ${catalog.categories.reduce((n,c)=>n+c.offerings.length,0)} core offerings. No records deleted.`);
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>mongoose.disconnect());
