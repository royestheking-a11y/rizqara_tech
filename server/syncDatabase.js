const { createHash } = require('node:crypto');
const { Service, Carousel, CaseStudy, GalleryItem } = require('./models/Schemas');
const catalog = require('../shared/service-catalog.json');

const legacy = {
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

const slugify = title => title.toLowerCase().normalize('NFKC').trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'item';

const DEFAULT_CAROUSEL_SLIDES = [
    {
        id: "0mpe4fgn9",
        title: "Building Software That Scales Businesses",
        title_bn: "বিল্ডিং সফ্টওয়্যার যা ব্যবসা স্কেল করে",
        subtitle: "We design, develop, and grow high-performance digital products for modern companies.",
        subtitle_bn: "আমরা আধুনিক কোম্পানিগুলির জন্য উচ্চ-ক্ষমতা সম্পন্ন ডিজিটাল পণ্য ডিজাইন, বিকাশ এবং বৃদ্ধি করি।",
        image: "https://res.cloudinary.com/dhutfywg2/image/upload/v1767756500/rizqaratech/uploads/msanw3h3avwxq3i6owo2.jpg",
        cta: "View Projects",
        cta_bn: "এখনই যোগাযোগ করুন"
    },
    {
        id: "ayi3qrui3",
        title: "A Team Built on Skill & Innovation",
        title_bn: "দক্ষতা ও উদ্ভাবনের উপর নির্মিত একটি দল",
        subtitle: "Designers, developers, and strategists working together to build excellence",
        subtitle_bn: "ডিজাইনার, ডেভেলপার এবং কৌশলবিদরা একসাথে কাজ করে উৎকর্ষ গড়ে তুলতে",
        image: "https://res.cloudinary.com/dhutfywg2/image/upload/v1779604917/rizqaratech/uploads/gwejren4ixwo3ff86zu0.jpg",
        cta: "Contact Now",
        cta_bn: "এখনই যোগাযোগ করুন"
    },
    {
        id: "hvgmvfh3w",
        title: "Automate Your Business with AI",
        title_bn: "এআই দিয়ে আপনার ব্যবসা স্বয়ংক্রিয় করুন",
        subtitle: "Chatbots, automation & smart systems that work 24/7",
        subtitle_bn: "চ্যাটবট, অটোমেশন এবং স্মার্ট সিস্টেম যা ২৪/৭ কাজ করে",
        image: "https://res.cloudinary.com/dhutfywg2/image/upload/v1777735794/rizqaratech/uploads/gmynwnsakou41q2d03mb.jpg",
        cta: "View Services",
        cta_bn: "সেবাসমূহ দেখুন"
    },
    {
        id: "gglh9n01x",
        title: "Control Your Business with Real-Time Insights",
        title_bn: "রিয়েল-টাইম তথ্যের মাধ্যমে আপনার ব্যবসা পরিচালনা করুন",
        subtitle: "Track performance, monitor growth, and make smarter decisions",
        subtitle_bn: "পারফরম্যান্স ট্র্যাক করুন, বৃদ্ধি পর্যবেক্ষণ করুন এবং আরও স্মার্ট সিদ্ধান্ত নিন",
        image: "https://res.cloudinary.com/dhutfywg2/image/upload/v1777737162/rizqaratech/uploads/fi9z8dcpgrmbbuwqotyn.jpg",
        cta: "Contact Now",
        cta_bn: "এখনই যোগাযোগ করুন"
    }
];

const DEFAULT_GALLERY_ITEMS = [
    {
        id: "gal-1",
        title: "Annual Tech Summit 2026",
        title_bn: "বার্ষিক টেক সামিট ২০২৬",
        image: "/images/gallery/IMG_20260408_012644_958.jpg",
        date: "2026-05-15",
        category: "Event",
        category_bn: "ইভেন্ট",
        location: "Dhaka HQ, Bangladesh",
        location_bn: "ঢাকা হেডকোয়ার্টার, বাংলাদেশ",
        description: "Annual gathering bringing together technology leaders, partners, and innovators to discuss future product roadmaps.",
        description_bn: "ভবিষ্যতের পণ্যের রোডম্যাপ নিয়ে আলোচনা করতে প্রযুক্তি নেতা, অংশীদার এবং উদ্ভাবকদের বার্ষিক সম্মেলন।"
    },
    {
        id: "gal-2",
        title: "Team Building Workshop",
        title_bn: "টিম বিল্ডিং ওয়ার্কশপ",
        image: "/images/gallery/IMG_20260408_012704_466.jpg",
        date: "2026-06-01",
        category: "Workshop",
        category_bn: "ওয়ার্কশপ",
        location: "Dhaka HQ, Bangladesh",
        location_bn: "ঢাকা হেডকোয়ার্টার, বাংলাদেশ",
        description: "Hands-on collaborative sprint exploring modern system architecture and user experience paradigms.",
        description_bn: "আধুনিক সিস্টেম আর্কিটেকচার এবং ব্যবহারকারী অভিজ্ঞতার দৃষ্টান্ত অন্বেষণে হ্যান্ডস-অন সহযোগিতামূলক স্প্রিন্ট।"
    },
    {
        id: "gal-3",
        title: "UI/UX Brainstorming Session",
        title_bn: "ইউআই/ইউএক্স ব্রেনস্টর্মিং সেশন",
        image: "/images/gallery/IMG_20260408_012720_062.jpg",
        date: "2026-06-20",
        category: "Design",
        category_bn: "ডিজাইন",
        location: "Dhaka HQ, Bangladesh",
        location_bn: "ঢাকা হেডকোয়ার্টার, বাংলাদেশ",
        description: "Interactive design workshop refining user flow wireframes and high-fidelity interaction components.",
        description_bn: "ইউজার ফ্লো ওয়্যারফ্রেম এবং হাই-ফিডেলিটি ইন্টারঅ্যাকশন উপাদান পরিমার্জনকারী ইন্টারেক্টিভ ডিজাইন ওয়ার্কশপ।"
    },
    {
        id: "gal-4",
        title: "Global Client Strategy Meeting",
        title_bn: "গ্লোবাল ক্লায়েন্ট স্ট্র্যাটেজি মিটিং",
        image: "/images/gallery/IMG_20260408_012735_385.jpg",
        date: "2026-07-10",
        category: "Meeting",
        category_bn: "মিটিং",
        location: "Dhaka HQ, Bangladesh",
        location_bn: "ঢাকা হেডকোয়ার্টার, বাংলাদেশ",
        description: "Executive session with international stakeholders reviewing scalable digital infrastructure deliveries.",
        description_bn: "স্কেলেবল ডিজিটাল অবকাঠামো বিতরণ পর্যালোচনা করতে আন্তর্জাতিক অংশীদারদের সাথে নির্বাহী অধিবেশন।"
    }
];

async function syncDatabase() {
    try {
        console.log('[Sync] Checking database synchronization...');

        // 1. Sync Services from Service Catalog
        const records = await Service.find().lean();
        const matched = new Set();
        let serviceChanges = 0;

        for (const category of catalog.categories) {
            for (const offering of category.offerings) {
                const existing = records.find(s => s.catalogKey === offering.key || legacy[s.title] === offering.key || s.title?.toLowerCase() === offering.title.toLowerCase());
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
                    gallery: existing?.gallery || []
                };

                const revision = createHash('sha256').update(JSON.stringify(data)).digest('hex');
                if (existing?.catalogRevision === revision && existing.categoryId === category.id) continue;

                serviceChanges++;
                if (existing) {
                    const oldSlug = slugify(existing.title);
                    await Service.updateOne(
                        { _id: existing._id },
                        {
                            $set: {
                                ...data,
                                catalogRevision: revision,
                                slug: existing.slug || offering.key,
                                previousSlugs: [...new Set([...(existing.previousSlugs || []), oldSlug, `${oldSlug}-${existing.id}`])]
                            },
                            $inc: { __v: 1 }
                        }
                    );
                } else {
                    await Service.create({
                        id: `svc-${offering.key}`,
                        slug: offering.key,
                        ...data,
                        catalogRevision: revision
                    });
                }
            }
        }

        // Preserve specialist services
        for (const record of records.filter(s => !matched.has(s.id) && !s.catalogKey)) {
            const catId = record.categoryId || (['AI Strategy', 'Generative AI', 'MLOps'].includes(record.title) ? 'ai-automation' : 'enterprise-custom-solutions');
            const category = catalog.categories.find(c => c.id === catId);
            if (record.categoryId === catId && record.image === category?.image) continue;

            serviceChanges++;
            await Service.updateOne(
                { _id: record._id },
                {
                    $set: {
                        categoryId: catId,
                        image: record.image || category?.image,
                        imageAlt: record.imageAlt || category?.imageAlt
                    },
                    $inc: { __v: 1 }
                }
            );
        }

        if (serviceChanges > 0) {
            console.log(`[Sync] Updated ${serviceChanges} service records to match catalog.`);
        }

        // 2. Sync Carousel Slides
        const carouselCount = await Carousel.countDocuments();
        if (carouselCount === 0) {
            await Carousel.insertMany(DEFAULT_CAROUSEL_SLIDES);
            console.log('[Sync] Seeded default carousel slides.');
        } else {
            // Ensure real slides exist
            for (const slide of DEFAULT_CAROUSEL_SLIDES) {
                await Carousel.updateOne(
                    { id: slide.id },
                    { $setOnInsert: slide },
                    { upsert: true }
                );
            }
        }

        // 3. Sync Gallery Items
        for (const item of DEFAULT_GALLERY_ITEMS) {
            await GalleryItem.updateOne(
                { id: item.id },
                {
                    $set: {
                        title: item.title,
                        title_bn: item.title_bn,
                        image: item.image,
                        date: item.date,
                        category: item.category,
                        category_bn: item.category_bn,
                        location: item.location,
                        location_bn: item.location_bn,
                        description: item.description,
                        description_bn: item.description_bn
                    }
                },
                { upsert: true }
            );
        }

        console.log('[Sync] Database synchronization completed successfully.');
    } catch (err) {
        console.error('[Sync] Synchronization warning:', err.message);
    }
}

module.exports = { syncDatabase };
