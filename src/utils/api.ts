export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
export async function apiRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}/${path.replace(/^\//, '')}`, {
    ...options,
    credentials: 'include',
    signal: options.signal || AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return response;
}
export async function getCollection(collection: string, signal?: AbortSignal) {
  const items: any[] = [];
  for (let offset = 0; ; offset += 100) {
    let response: Response | undefined;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const attemptSignal = signal ? AbortSignal.any([signal, AbortSignal.timeout(10000)]) : AbortSignal.timeout(10000);
        response = await fetch(`${API_URL}/${collection}?limit=100&offset=${offset}`, {credentials:'include', signal:attemptSignal});
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
