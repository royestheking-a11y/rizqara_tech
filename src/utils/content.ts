type Content = { id: string; title: string; slug?: string; previousSlugs?: string[] };
export function slugify(title: string) {
  return title.toLowerCase().normalize('NFKC').trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'item';
}
export function getSlug(value: string | Content) {
  return typeof value === 'string' ? slugify(value) : value.slug || `${slugify(value.title)}-${value.id.slice(0, 8)}`;
}
export function matchesContent(value: Content, candidate?: string) {
  return !!candidate && [value.id, getSlug(value), `${slugify(value.title)}-${value.id}`, `${getSlug(value)}-${value.id}`, slugify(value.title), value.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, ''), ...(value.previousSlugs || [])].includes(candidate);
}
