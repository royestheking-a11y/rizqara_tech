const path = require('node:path');
const fs = require('node:fs');
const { createHash } = require('node:crypto');
const { Service, Project, Carousel, CaseStudy, GalleryItem, Review, Blog, Video } = require('./models/Schemas');

const catalogPath = path.join(__dirname, '../shared/service-catalog.json');
const conceptsPath = path.join(__dirname, '../src/data/project-concepts.json');
const carouselPath = path.join(__dirname, '../src/data/carousel.json');
const caseStudiesPath = path.join(__dirname, '../src/data/case-studies.json');
const reviewsPath = path.join(__dirname, '../src/data/reviews.json');
const blogsPath = path.join(__dirname, '../src/data/blogs.json');
const videosPath = path.join(__dirname, '../src/data/videos.json');

const legacyServiceMap = {
  'Website Development': 'custom-website-development',
  'Web App Development': 'web-applications',
  'UI/UX Design': 'uiux-research-design',
  'App Development': 'cross-platform-applications',
  'SEO & Marketing': 'digital-marketing',
  'AI Chatbot': 'ai-agents-chatbots',
  'Automation': 'business-workflow-automation',
  'Analytics': 'business-intelligence-dashboards',
  'API Platform': 'api-integrations-webhooks',
  'Brand Identity': 'logo-visual-identity'
};

const slugify = title =>
  title.toLowerCase().normalize('NFKC').trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'item';

async function syncDatabase() {
  const summary = {};

  // 1. SYNC SERVICES
  if (fs.existsSync(catalogPath)) {
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const records = await Service.find().lean();
    let serviceChanges = 0;
    const matched = new Set();

    for (const category of catalog.categories) {
      for (const offering of category.offerings) {
        const existing = records.find(
          s => s.catalogKey === offering.key || legacyServiceMap[s.title] === offering.key || s.title.toLowerCase() === offering.title.toLowerCase()
        );
        if (existing) matched.add(existing.id);

        const data = {
          title: offering.title,
          title_bn: offering.title_bn,
          description: offering.summary,
          description_bn: offering.summary_bn,
          details: `${offering.summary} ${category.description}`,
          details_bn: `${offering.summary_bn} ${category.description_bn}`,
          icon: category.icon,
          capabilities: offering.deliverables,
          capabilities_bn: offering.deliverables,
          process: catalog.process,
          process_bn: catalog.process_bn,
          categoryId: category.id,
          catalogKey: offering.key,
          displayOrder: category.order * 100 + offering.order,
          image: category.image,
          imageAlt: category.imageAlt,
        };

        const revision = createHash('sha256').update(JSON.stringify(data)).digest('hex');
        if (existing?.catalogRevision === revision && existing?.categoryId === category.id) continue;

        serviceChanges++;
        if (existing) {
          const oldSlug = slugify(existing.title);
          await Service.updateOne(
            { _id: existing._id },
            {
              $set: {
                ...data,
                catalogRevision: revision,
                slug: existing.slug || `${oldSlug}-${existing.id.slice(0, 8)}`,
                previousSlugs: [...new Set([...(existing.previousSlugs || []), oldSlug, `${oldSlug}-${existing.id}`])]
              }
            }
          );
        } else {
          await Service.create({
            id: `svc-${offering.key}`,
            slug: offering.key,
            ...data,
            gallery: [],
            catalogRevision: revision
          });
        }
      }
    }

    // Preserve and ensure categoryId on specialist records
    for (const record of records.filter(s => !matched.has(s.id) && !s.catalogKey)) {
      const category = catalog.categories.find(
        c => c.id === (['AI Strategy', 'Generative AI', 'MLOps'].includes(record.title) ? 'ai-automation' : 'enterprise-custom-solutions')
      );
      if (record.categoryId !== category.id || !record.image) {
        serviceChanges++;
        await Service.updateOne(
          { _id: record._id },
          { $set: { categoryId: category.id, image: record.image || category.image, imageAlt: category.imageAlt } }
        );
      }
    }
    summary.services = { total: (await Service.countDocuments()), syncedChanges: serviceChanges };
  }

  // 2. SYNC PROJECT CONCEPTS
  if (fs.existsSync(conceptsPath)) {
    const concepts = JSON.parse(fs.readFileSync(conceptsPath, 'utf8'));
    let projectChanges = 0;
    for (const concept of concepts) {
      const existing = await Project.findOne({ id: concept.id }).lean();
      if (!existing) {
        await Project.create({
          id: concept.id,
          slug: concept.slug || slugify(concept.title),
          title: concept.title,
          category: concept.category,
          status: concept.status || 'Concept',
          image: concept.image,
          description: concept.description,
          tech: concept.tech || [],
          features: concept.features || [],
          gallery: concept.gallery || []
        });
        projectChanges++;
      }
    }
    summary.projects = { total: (await Project.countDocuments()), newlySeeded: projectChanges };
  }

  // 3. SYNC CAROUSEL SLIDES
  if (fs.existsSync(carouselPath)) {
    const slides = JSON.parse(fs.readFileSync(carouselPath, 'utf8'));
    let carouselChanges = 0;
    const slideIds = slides.map(s => s.id);
    await Carousel.deleteMany({ id: { $nin: slideIds } });
    for (const slide of slides) {
      const existing = await Carousel.findOne({ id: slide.id }).lean();
      if (!existing) {
        await Carousel.create(slide);
        carouselChanges++;
      } else if (existing.title !== slide.title || existing.image !== slide.image) {
        await Carousel.updateOne({ id: slide.id }, { $set: slide });
        carouselChanges++;
      }
    }
    summary.carousel = { total: (await Carousel.countDocuments()), updated: carouselChanges };
  }

  // 4. SYNC CASE STUDIES
  if (fs.existsSync(caseStudiesPath)) {
    const caseStudies = JSON.parse(fs.readFileSync(caseStudiesPath, 'utf8'));
    let caseChanges = 0;
    for (const study of caseStudies) {
      const existing = await CaseStudy.findOne({ id: study.id }).lean();
      if (!existing) {
        await CaseStudy.create(study);
        caseChanges++;
      } else if (!existing.slug || existing.slug !== study.slug) {
        await CaseStudy.updateOne({ id: study.id }, { $set: { slug: study.slug } });
        caseChanges++;
      }
    }
    summary.caseStudies = { total: (await CaseStudy.countDocuments()), updated: caseChanges };
  }

  // 5. SYNC GALLERY ITEMS
  const richGalleryItems = [
    {
      id: 'gal-1',
      title: 'Annual Tech Summit 2026',
      title_bn: 'বার্ষিক টেক সামিট ২০২৬',
      date: '2026-05-15',
      category: 'Event',
      category_bn: 'ইভেন্ট',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      location: 'Dhaka HQ, Bangladesh',
      location_bn: 'ঢাকা হেডকোয়ার্টার, বাংলাদেশ',
      description: 'Our annual gathering of engineers, innovators, and industry leaders exploring what next-generation software and AI can achieve.',
      description_bn: 'আমাদের প্রকৌশলী, উদ্ভাবক এবং শিল্প নেতাদের বার্ষিক সম্মেলন যেখানে পরবর্তী প্রজন্মের সফটওয়্যার এবং এআই কী অর্জন করতে পারে তা অন্বেষণ করা হয়।'
    },
    {
      id: 'gal-2',
      title: 'Team Building Workshop',
      title_bn: 'টিম বিল্ডিং কর্মশালা',
      date: '2026-06-01',
      category: 'Workshop',
      category_bn: 'ওয়ার্কশপ',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      location: 'Dhaka HQ, Bangladesh',
      location_bn: 'ঢাকা হেডকোয়ার্টার, বাংলাদেশ',
      description: 'Collaborative problem solving, design thinking sprints, and cross-functional engineering alignment.',
      description_bn: 'সহযোগিতামূলক সমস্যা সমাধান, ডিজাইন থিংকিং স্প্রিন্ট এবং ক্রস-ফাংশনাল ইঞ্জিনিয়ারিং সমন্বয়।'
    },
    {
      id: 'gal-3',
      title: 'UI/UX Brainstorming Session',
      title_bn: 'UI/UX ব্রেনস্টর্মিং সেশন',
      date: '2026-04-10',
      category: 'Team',
      category_bn: 'টিম',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
      location: 'Dhaka HQ, Bangladesh',
      location_bn: 'ঢাকা হেডকোয়ার্টার, বাংলাদেশ',
      description: 'Deep-dive user journey mapping, design system token refinement, and micro-interaction prototyping.',
      description_bn: 'গভীর ব্যবহারকারী যাত্রা ম্যাপিং, ডিজাইন সিস্টেম টোকেন পরিমার্জন এবং মাইক্রো-ইন্টারঅ্যাকশন প্রোটোটাইপিং।'
    },
    {
      id: 'gal-4',
      title: 'Global Client Strategy Meeting',
      title_bn: 'গ্লোবাল ক্লায়েন্ট কৌশল বৈঠক',
      date: '2026-03-20',
      category: 'Achievement',
      category_bn: 'অর্জিত সাফল্য',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
      location: 'Dhaka HQ, Bangladesh',
      location_bn: 'ঢাকা হেডকোয়ার্টার, বাংলাদেশ',
      description: 'Quarterly review aligning international digital roadmap goals with scalable engineering deliverables.',
      description_bn: 'আন্তর্জাতিক ডিজিটাল রোডম্যাপের লক্ষ্যগুলির সাথে স্কেলেবল ইঞ্জিনিয়ারিং ডেলিভারিবলগুলির সমন্বয়কারী ত্রৈমাসিক পর্যালোচনা।'
    }
  ];

  let galleryChanges = 0;
  for (const item of richGalleryItems) {
    const existing = await GalleryItem.findOne({ id: item.id }).lean();
    if (!existing) {
      await GalleryItem.create(item);
      galleryChanges++;
    } else if (!existing.location || !existing.description) {
      await GalleryItem.updateOne({ id: item.id }, { $set: item });
      galleryChanges++;
    }
  }
  summary.galleryItems = { total: (await GalleryItem.countDocuments()), updated: galleryChanges };

  // 6. SYNC REVIEWS
  if (fs.existsSync(reviewsPath)) {
    const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
    let reviewChanges = 0;
    for (const rev of reviews) {
      const existing = await Review.findOne({ id: rev.id }).lean();
      if (!existing) {
        await Review.create(rev);
        reviewChanges++;
      }
    }
    summary.reviews = { total: await Review.countDocuments(), seeded: reviewChanges };
  }

  // 7. SYNC BLOGS
  if (fs.existsSync(blogsPath)) {
    const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
    let blogChanges = 0;
    for (const blog of blogs) {
      const existing = await Blog.findOne({ id: blog.id }).lean();
      if (!existing) {
        await Blog.create(blog);
        blogChanges++;
      }
    }
    summary.blogs = { total: await Blog.countDocuments(), seeded: blogChanges };
  }

  // 8. SYNC VIDEOS
  if (fs.existsSync(videosPath)) {
    const videos = JSON.parse(fs.readFileSync(videosPath, 'utf8'));
    let videoChanges = 0;
    for (const vid of videos) {
      const existing = await Video.findOne({ id: vid.id }).lean();
      if (!existing) {
        await Video.create(vid);
        videoChanges++;
      }
    }
    summary.videos = { total: await Video.countDocuments(), seeded: videoChanges };
  }

  return summary;
}

module.exports = { syncDatabase };
