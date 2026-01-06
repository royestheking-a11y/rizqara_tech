const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    title_bn: String,
    description: { type: String, required: true },
    description_bn: String,
    icon: { type: String, required: true },
    details: { type: String, required: true },
    details_bn: String,
    capabilities: [String],
    capabilities_bn: [String],
    process: [String],
    process_bn: [String],
    image: String,
    gallery: [String]
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    title_bn: String,
    category: { type: String, required: true },
    category_bn: String,
    image: { type: String, required: true },
    status: { type: String, enum: ['Live', 'Ongoing', 'Completed'], required: true },
    description: { type: String, required: true },
    description_bn: String,
    tech: [String],
    gallery: [String],
    link: String
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    name_bn: String,
    role: { type: String, required: true },
    role_bn: String,
    company: { type: String, required: true },
    content: { type: String, required: true },
    content_bn: String,
    rating: { type: Number, required: true }
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    title_bn: String,
    excerpt: { type: String, required: true },
    excerpt_bn: String,
    content: { type: String, required: true },
    content_bn: String,
    date: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    category_bn: String
}, { timestamps: true });

const JobSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    title_bn: String,
    type: { type: String, enum: ['Full-time', 'Contract', 'Part-time'], required: true },
    location: { type: String, required: true },
    location_bn: String,
    salary: { type: String, required: true },
    description: { type: String, required: true },
    description_bn: String
}, { timestamps: true });

const VideoSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    title_bn: String,
    thumbnail: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, enum: ['Demo', 'Ad', 'Showcase'], required: true },
    comments: [{
        id: String,
        user: String,
        text: String,
        date: String
    }]
}, { timestamps: true });

const CarouselSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    title_bn: String,
    subtitle: { type: String, required: true },
    subtitle_bn: String,
    image: { type: String, required: true },
    cta: { type: String, required: true },
    cta_bn: String
}, { timestamps: true });

const BuildOptionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    category: { type: String, enum: ['type', 'feature', 'time'], required: true },
    label: { type: String, required: true },
    label_bn: String,
    value: { type: Number, required: true }
}, { timestamps: true });

const MessageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, required: true },
    read: { type: Boolean, default: false },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

const CareerApplicationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    experience: { type: String, required: true },
    reason: { type: String, required: true },
    cvUrl: { type: String, required: true },
    cvName: { type: String, required: true },
    jobId: String,
    date: { type: String, required: true },
    status: { type: String, default: 'New', enum: ['New', 'Reviewed', 'Rejected', 'Pending'] } // Added Pending to match DataContext
}, { timestamps: true });

const PromotionSchema = new mongoose.Schema({
    id: { type: String, default: 'promo_config' },
    isActive: { type: Boolean, default: false },
    offerRate: String,
    serviceName: String,
    serviceName_bn: String,
    expiryDate: String,
    description: String,
    description_bn: String
}, { timestamps: true });

module.exports = {
    Service: mongoose.model('Service', ServiceSchema),
    Project: mongoose.model('Project', ProjectSchema),
    Review: mongoose.model('Review', ReviewSchema),
    Blog: mongoose.model('Blog', BlogSchema),
    Job: mongoose.model('Job', JobSchema),
    Video: mongoose.model('Video', VideoSchema),
    Carousel: mongoose.model('Carousel', CarouselSchema),
    BuildOption: mongoose.model('BuildOption', BuildOptionSchema),
    Message: mongoose.model('Message', MessageSchema),
    CareerApplication: mongoose.model('CareerApplication', CareerApplicationSchema),
    Promotion: mongoose.model('Promotion', PromotionSchema)
};
