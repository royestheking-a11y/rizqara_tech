import { API_URL } from './api';
import { readConsent } from './consent';

export function trackGrowth(action: 'estimate_completed' | 'estimate_shared' | 'booking_clicked' | 'inquiry_sent') {
    if (!readConsent().analytics || !crypto.randomUUID) return;
    const path = window.location.pathname;
    if (/^\/(admin|api)(\/|$)/i.test(path)) return;
    try {
        let visitor = localStorage.getItem('rizqara_visitor_id');
        if (!visitor) {
            visitor = crypto.randomUUID();
            localStorage.setItem('rizqara_visitor_id', visitor);
        }
        void fetch(`${API_URL}/analytics/view`, {
            method: 'POST', credentials: 'include', keepalive: true,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventId: crypto.randomUUID(), visitor, path, consent: true, action }),
        }).catch(() => {});
    } catch { /* Analytics must not interrupt the task. */ }
}
