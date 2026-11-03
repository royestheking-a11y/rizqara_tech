const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const { GalleryItem } = require('./models/Schemas');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        await GalleryItem.deleteMany({});
        await GalleryItem.insertMany([
            {
                id: 'gal-1',
                title: 'Annual Tech Summit 2026',
                title_bn: 'বার্ষিক টেক সামিট ২০২৬',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
                date: '2026-05-15',
                category: 'Event',
                category_bn: 'ইভেন্ট',
                location: 'Dhaka HQ, Bangladesh',
                location_bn: 'ঢাকা হেডকোয়ার্টার, বাংলাদেশ',
                description: 'Capturing our team synergy, drive for innovation, and the shared milestones that power the next chapter of RizQara Tech.',
                description_bn: 'আমাদের দলীয় সমন্বয়, উদ্ভাবনী স্পৃহা এবং রিজকারা টেকের পরবর্তী অধ্যায়কে এগিয়ে নিয়ে যাওয়ার যৌথ মাইলফলক।'
            },
            {
                id: 'gal-2',
                title: 'Team Building Workshop',
                title_bn: 'টিম বিল্ডিং কর্মশালা',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
                date: '2026-06-01',
                category: 'Workshop',
                category_bn: 'কর্মশালা',
                location: 'Dhaka HQ, Bangladesh',
                location_bn: 'ঢাকা হেডকোয়ার্টার, বাংলাদেশ',
                description: 'This moment reflects our shared passion for technology, collaborative problem solving, and building memorable milestones together.',
                description_bn: 'এই মুহূর্তটি আমাদের টিমের ক্রমাগত সাধনা, সৃজনশীলতা এবং শ্রেষ্ঠত্ব অর্জনের প্রতিশ্রুতির প্রতীক।'
            },
            {
                id: 'gal-3',
                title: 'New Office Setup',
                title_bn: 'নতুন অফিস সেটআপ',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
                date: '2026-06-10',
                category: 'Culture',
                category_bn: 'সংস্কৃতি',
                location: 'Banani Studio, Dhaka',
                location_bn: 'বনানী স্টুডিও, ঢাকা',
                description: 'Designing our dynamic innovation studio to foster creative engineering, cross-functional collaboration, and high-performance development.',
                description_bn: 'সৃজনশীল ইঞ্জিনিয়ারিং এবং উচ্চমানের সফটওয়্যার উদ্ভাবন উৎসাহিত করতে আমাদের আধুনিক ওয়ার্কস্পেস।'
            },
            {
                id: 'gal-4',
                title: 'Code Hackathon Winners',
                title_bn: 'কোড হ্যাকাথন বিজয়ীরা',
                image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
                date: '2026-06-15',
                category: 'Achievement',
                category_bn: 'কৃতিত্ব',
                location: 'Tech Hub Auditorium, Dhaka',
                location_bn: 'টেক হাব অডিটোরিয়াম, ঢাকা',
                description: 'Celebrating 48 hours of rapid prototyping, cutting-edge AI product development, and the relentless engineering excellence of our tech leads.',
                description_bn: '৪৮ ঘণ্টার অবিরাম উদ্ভাবন, এআই প্ল্যাটফর্ম তৈরি এবং আমাদের তরুণ ডেভেলপারদের অসাধারণ সাফল্যের উদযাপন।'
            }
        ]);
        console.log('Inserted gallery items');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
