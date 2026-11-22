const { readFile } = require('node:fs/promises');
const path = require('node:path');
const starterCourses = require('./starter-courses.json');

const builtInResources = new Map(starterCourses.map(course => [
    course.downloadUrl, course.downloadUrl.slice('starter:'.length) + '.md',
]));

function isStarterResource(value) {
    return builtInResources.has(value);
}

async function getStarterResource(value) {
    const filename = builtInResources.get(value);
    if (!filename) return null;
    return { filename, content: await readFile(path.join(__dirname, filename), 'utf8') };
}

async function seedStarterCourses(Course) {
    const marker = Course.db.collection('academy_setup');
    const id = 'initial-course-packs-v1';
    if (await marker.findOne({ _id: id })) return;

    await Course.init();
    for (const course of starterCourses) {
        try {
            await Course.updateOne({ id: course.id }, { $setOnInsert: course }, { upsert: true, runValidators: true });
        } catch (error) {
            if (error.code !== 11000 || !await Course.exists({ id: course.id })) throw error;
        }
    }
    await marker.updateOne({ _id: id }, { $setOnInsert: { completedAt: new Date() } }, { upsert: true });
}

module.exports = { seedStarterCourses, isStarterResource, getStarterResource };
