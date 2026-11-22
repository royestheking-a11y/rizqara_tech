const studies = require('../src/data/case-studies.json');
const updated = studies.find(study => study.id === 'st2usv9cb');

async function publishDocumentedCaseStudy(CaseStudy) {
    const fields = ['title', 'title_bn', 'description', 'description_bn', 'problem', 'problem_bn',
        'solution', 'solution_bn', 'impact', 'impact_bn'];
    const copy = Object.fromEntries(fields.map(field => [field, updated[field]]));
    await CaseStudy.updateOne({
        id: updated.id,
        title: 'From Outdated to Premium: Complete Website Transformation for Hot Plate Restaurant',
        updatedAt: new Date('2026-11-10T17:14:34.379Z'),
    }, {
        $set: copy,
        $unset: { growthBefore: '', growthAfter: '' },
        $inc: { __v: 1 },
    }, { runValidators: true });
}

module.exports = { publishDocumentedCaseStudy };
