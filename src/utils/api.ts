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
    const response = await apiRequest(`${collection}?limit=100&offset=${offset}`, { signal });
    const page = await response.json();
    if (!Array.isArray(page)) throw new Error('Invalid collection response');
    items.push(...page);
    if (response.headers.get('X-Has-More') !== 'true') return items;
  }
}
