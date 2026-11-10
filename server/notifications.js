const { Message, CareerApplication } = require('./models/Schemas');
async function sendNotification(item, kind, request = fetch) {
    const response = await request('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(10000),
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `rizqara-${kind}-${item.id}` },
        body: JSON.stringify({ from: process.env.NOTIFICATION_FROM, to: [process.env.NOTIFICATION_TO], reply_to: item.email,
            subject: kind === 'message' ? 'New website inquiry' : 'New career application',
            text: `Name: ${item.name}\nEmail: ${item.email}\n${kind === 'message' ? `Subject: ${item.subject}\n\n${item.message}` : `Job: ${item.jobId}\nExperience: ${item.experience}\nReason: ${item.reason}\nReview the CV in the protected admin dashboard.`}` }),
    });
    if (!response.ok) throw new Error(`Notification provider returned ${response.status}`);
}
async function deliverPending(request = fetch) {
    if (!process.env.RESEND_API_KEY || !process.env.NOTIFICATION_FROM || !process.env.NOTIFICATION_TO) return;
    for (const [kind, model] of [['message', Message], ['application', CareerApplication]]) {
        await model.updateMany({ notificationStatus: 'sending', notificationAttempts: { $gte: 5 }, notificationNextAttempt: { $lte: new Date() } }, { $set: { notificationStatus: 'failed' } });
        for (let index = 0; index < 10; index++) {
            const item = await model.findOneAndUpdate({ notificationStatus: { $in: ['pending', 'sending'] }, notificationAttempts: { $lt: 5 }, notificationNextAttempt: { $lte: new Date() } }, { $set: { notificationStatus: 'sending', notificationNextAttempt: new Date(Date.now() + 5 * 60000) }, $inc: { notificationAttempts: 1 } }, { returnDocument: 'after' });
            if (!item) break;
            try {
                await sendNotification(item, kind, request);
                await model.updateOne({ _id: item._id }, { $set: { notificationStatus: 'sent' } });
            } catch {
                await model.updateOne({ _id: item._id }, { $set: { notificationStatus: item.notificationAttempts >= 5 ? 'failed' : 'pending', notificationNextAttempt: new Date(Date.now() + 60000 * 2 ** item.notificationAttempts) } });
            }
        }
    }
}
function startNotifications() {
    let running = false;
    const tick = async () => { if (running) return; running = true; try { await deliverPending(); } catch { console.error('Notification queue is temporarily unavailable'); } finally { running = false; } };
    void tick(); const timer = setInterval(tick, 30000); timer.unref(); return () => clearInterval(timer);
}
module.exports = { deliverPending, sendNotification, startNotifications };
