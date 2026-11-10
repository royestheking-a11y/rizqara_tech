export const getProxiedImage = (url: string | undefined | null) => {
  if (!url) return '';
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  if (url.startsWith('blob:') || url.startsWith('data:image/')) return url;
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) return '';
    if (parsed.hostname === 'res.cloudinary.com' && parsed.pathname.includes('/upload/') && !parsed.pathname.includes('q_auto')) {
      parsed.pathname = parsed.pathname.replace('/upload/', '/upload/q_auto,f_auto/');
    }
    return parsed.href;
  } catch { return ''; }
};
