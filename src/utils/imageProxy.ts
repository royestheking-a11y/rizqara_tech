export const getProxiedImage = (url: string | undefined | null) => {
    if (!url) return '';

    // Only proxy Cloudinary URLs to bypass ISP blocks
    if (url.includes('cloudinary.com')) {
        // Inject optimization flags if not present
        let optimizedUrl = url;
        if (url.includes('/upload/') && !url.includes('q_auto') && !url.includes('f_auto')) {
            optimizedUrl = url.replace('/upload/', '/upload/q_auto,f_auto/');
        }
        const API_URL = import.meta.env.VITE_API_URL || 'https://rizqaratech-backend.onrender.com/api'; // Fallback to prod if env missing
        return `${API_URL}/proxy-image?url=${encodeURIComponent(optimizedUrl)}`;
    }

    return url;
};
