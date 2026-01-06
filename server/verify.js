require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const { Service, Project, Review, Blog, Job, Video, Carousel, BuildOption, Message, Promotion, CareerApplication } = require('./models/Schemas');

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB via ' + process.env.MONGODB_URI.split('@')[1]); // Log safe part of URI

        const counts = await Promise.all([
            Service.countDocuments(),
            Project.countDocuments(),
            Review.countDocuments(),
            Blog.countDocuments(),
            Job.countDocuments(),
            Video.countDocuments(),
            Carousel.countDocuments(),
            BuildOption.countDocuments(),
            Message.countDocuments(),
            Promotion.countDocuments(),
            CareerApplication.countDocuments()
        ]);

        console.log('--- Migration Verification Report ---');
        console.log(`Services: ${counts[0]}`);
        console.log(`Projects: ${counts[1]}`);
        console.log(`Reviews: ${counts[2]}`);
        console.log(`Blogs: ${counts[3]}`);
        console.log(`Jobs: ${counts[4]}`);
        console.log(`Videos: ${counts[5]}`);
        console.log(`Carousel Slides: ${counts[6]}`);
        console.log(`Build Options: ${counts[7]}`);
        console.log(`Messages: ${counts[8]}`);
        console.log(`Promotion Config: ${counts[9]}`);
        console.log(`Career Applications: ${counts[10]}`);
        console.log('-------------------------------------');

        if (counts.some(c => c === 0 && c !== counts[8] && c !== counts[10])) {
            // Messages/Applications might be 0 naturally, but others should have data
            console.warn('WARNING: Some core collections appear empty!');
        } else {
            console.log('SUCCESS: All core collections contain data.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Verification Error:', error);
        process.exit(1);
    }
};

verify();
