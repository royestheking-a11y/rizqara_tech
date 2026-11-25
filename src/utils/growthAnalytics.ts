import { API_URL } from './api';
import { readConsent } from './consent';

const campaignKey = 'rizqara_hot_plate_source';
const campaignSources = ['facebook', 'instagram', 'linkedin', 'case_study'];

export function rememberScorecardCampaign() {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source');
    try {
        if (params.get('utm_campaign') === 'hot_plate_walkthrough' && source && campaignSources.includes(source)) {
            sessionStorage.setItem(campaignKey, source);
        }
    } catch { /* The scorecard works without analytics storage. */ }
}

export function trackGrowth(action: 'estimate_completed' | 'estimate_shared' | 'booking_clicked' | 'inquiry_sent' | 'academy_sample_click' | 'restaurant_quote_clicked' | 'restaurant_inquiry_sent' | 'restaurant_scorecard_view') {
    if (!readConsent().analytics || !crypto.randomUUID) return;
    const path = window.location.pathname;
    if (/^\/(admin|api)(\/|$)/i.test(path)) return;
    try {
        let visitor = localStorage.getItem('rizqara_visitor_id');
        if (!visitor) {
            visitor = crypto.randomUUID();
            localStorage.setItem('rizqara_visitor_id', visitor);
        }
        const source = action.startsWith('restaurant_') ? sessionStorage.getItem(campaignKey) : null;
        void fetch(`${API_URL}/analytics/view`, {
            method: 'POST', credentials: 'include', keepalive: true,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventId: crypto.randomUUID(), visitor, path, consent: true, action, ...(source && campaignSources.includes(source) ? { source } : {}) }),
        }).catch(() => {});
    } catch { /* Analytics must not interrupt the task. */ }
}
