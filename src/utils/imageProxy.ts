export const getProxiedImage = (url: string | undefined | null) => {
    if (!url) return '';

    // Only proxy Cloudinary URLs to bypass ISP blocks
    if (url.includes('cloudinary.com')) {
        const API_URL = import.meta.env.VITE_API_URL || 'https://rizqaratech-backend.onrender.com/api'; // Fallback to prod if env missing
        return `${API_URL}/proxy-image?url=${encodeURIComponent(url)}`;
    }

    return url;
};
