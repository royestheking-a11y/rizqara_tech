export type Consent = { essential: true; analytics: boolean; marketing: boolean };
export function readConsent(): Consent {
  try {
    const value = JSON.parse(localStorage.getItem('rizqara_cookie_preferences') || '{}');
    return { essential: true, analytics: value.analytics === true, marketing: value.marketing === true };
  } catch { return { essential: true, analytics: false, marketing: false }; }
}
function addScript(id: string, src: string, attrs: Record<string, string> = {}) {
  if (document.getElementById(id)) return;
  const element = document.createElement('script'); element.id = id; element.src = src; element.async = true;
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  document.head.appendChild(element);
}
export function applyConsent(value: Consent) {
  const w = window as any;
  w['ga-disable-G-7G1R0QKGK7'] = !value.analytics;
  w['ga-disable-G-4L0KG6DTDR'] = !value.analytics;
  w.dataLayer ||= [];
  w.gtag ||= function () { w.dataLayer.push(arguments); };
  w.gtag('consent', 'update', { analytics_storage: value.analytics ? 'granted' : 'denied', ad_storage: value.marketing ? 'granted' : 'denied', ad_user_data: value.marketing ? 'granted' : 'denied', ad_personalization: value.marketing ? 'granted' : 'denied' });
  if (value.analytics) {
    if (!document.getElementById('consent-google-analytics')) {
      w.gtag('js', new Date()); w.gtag('config', 'G-7G1R0QKGK7'); w.gtag('config', 'G-4L0KG6DTDR');
    }
    addScript('consent-google-analytics', 'https://www.googletagmanager.com/gtag/js?id=G-7G1R0QKGK7');
    addScript('consent-ahrefs', 'https://analytics.ahrefs.com/analytics.js', { 'data-key': 'UF5/om+cgdHk4tNoGug/QQ' });
  }
  if (value.marketing) addScript('consent-ads', 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6203232556836361', { crossorigin: 'anonymous' });
}
export function saveConsent(value: Consent, choice: string) {
  const previous = readConsent();
  localStorage.setItem('rizqara_cookie_consent', choice);
  localStorage.setItem('rizqara_cookie_preferences', JSON.stringify(value));
  // Reload on revocation: removing a script element cannot undo its running code.
  if ((previous.analytics && !value.analytics) || (previous.marketing && !value.marketing)) {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (/^(_ga|_gid|_gat|_gcl)/.test(name)) {
        document.cookie = `${name}=; Max-Age=0; path=/`;
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}`;
      }
    }
    location.reload();
    return;
  }
  applyConsent(value);
}
