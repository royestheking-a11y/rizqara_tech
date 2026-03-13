export const getProxiedImage = (url: string | undefined | null) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;

    // If it's a Cloudinary URL, serve it directly with optimizations
    if (url.includes('cloudinary.com')) {
        // Inject optimization flags if not present
        if (url.includes('/upload/') && !url.includes('q_auto') && !url.includes('f_auto')) {
            return url.replace('/upload/', '/upload/q_auto,f_auto/');
        }
        return url;
    }

    // For other external images, use the backend proxy to bypass ISP blocks
    const API_URL = import.meta.env.VITE_API_URL || 'https://rizqaratech-backend.onrender.com/api';
    return `${API_URL}/proxy-image?url=${encodeURIComponent(url)}`;
};
