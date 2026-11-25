// Production admin cookies belong to the website host. Vercel proxies /api to Render.
const onPublicSite = typeof window !== 'undefined' &&
  ['rizqara.tech', 'www.rizqara.tech'].includes(window.location.hostname);
export const API_URL = (onPublicSite ? '/api' : (import.meta.env.VITE_API_URL || '/api')).replace(/\/$/, '');
export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export const ADMIN_SESSION_ENDED = 'rizqara-admin-session-ended';

function reportAdminSessionEnded(response: Response) {
  if (response.status === 401) window.dispatchEvent(new Event(ADMIN_SESSION_ENDED));
}

export async function apiRequest(path: string, options: RequestInit = {}) {
  const route = path.replace(/^\//, '').split('?')[0];
  const publicSubmission = options.method === 'POST' && /^(messages|careerApplications)$/.test(route);
  const privateRoute = !publicSubmission && /^(analytics\/summary|courses|messages|careerApplications|applications|auth\/(session|logout))(\/|$)/.test(route);
  const response = await fetch(`${API_URL}/${path.replace(/^\//, '')}`, {
    ...options,
    credentials: 'include',
    ...(privateRoute ? { cache: 'no-store' as const } : {}),
    signal: options.signal || AbortSignal.timeout(15000),
  });
  if (privateRoute && route !== 'auth/session') reportAdminSessionEnded(response);
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(data.error || `Request failed (${response.status})`, response.status);
  }
  return response;
}
export async function getCollection(collection: string, signal?: AbortSignal) {
  const items: any[] = [];
  const privateCollection = collection === 'messages' || collection === 'careerApplications' || collection === 'courses';
  for (let offset = 0; ; offset += 100) {
    let response: Response | undefined;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const attemptSignal = signal ? AbortSignal.any([signal, AbortSignal.timeout(10000)]) : AbortSignal.timeout(10000);
        response = await fetch(`${API_URL}/${collection}?limit=100&offset=${offset}`, {credentials:'include', signal:attemptSignal, ...(privateCollection ? { cache: 'no-store' as const } : {})});
        if (privateCollection && !attemptSignal.aborted) reportAdminSessionEnded(response);
        if (response.ok) break;
        if (![408, 429, 500, 502, 503, 504].includes(response.status) || attempt === 2) throw new Error(`Collection unavailable (${response.status})`);
      } catch (error) {
        if (signal?.aborted || attempt === 2 || (response && ![408,429,500,502,503,504].includes(response.status))) throw error;
      }
      await new Promise<void>((resolve, reject) => {
        const onAbort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); };
        const timer = setTimeout(() => { signal?.removeEventListener('abort', onAbort); resolve(); }, 500 * (attempt + 1));
        if (signal?.aborted) onAbort(); else signal?.addEventListener('abort', onAbort, {once:true});
      });
    }
    if (!response?.ok) throw new Error('Collection unavailable');
    const page = await response.json();
    if (!Array.isArray(page)) throw new Error('Invalid collection response');
    items.push(...page);
    if (response.headers.get('X-Has-More') !== 'true') return items;
  }
}
