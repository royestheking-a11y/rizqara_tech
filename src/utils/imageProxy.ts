export const getProxiedImage = (url: string | undefined | null, width?: number, height?: number) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;

    // If it's a Cloudinary URL, serve it directly with optimizations
    if (url.includes('cloudinary.com')) {
        let optimizedUrl = url;
        
        // Inject optimization flags if not present
        if (url.includes('/upload/')) {
            const transformations = [];
            if (!url.includes('q_auto')) transformations.push('q_auto');
            if (!url.includes('f_auto')) transformations.push('f_auto');
            
            // Add resizing if requested
            if (width || height) {
                let resize = 'c_limit';
                if (width) resize += `,w_${width}`;
                if (height) resize += `,h_${height}`;
                transformations.push(resize);
            }

            if (transformations.length > 0) {
                optimizedUrl = url.replace('/upload/', `/upload/${transformations.join(',')}/`);
            }
        }
        return optimizedUrl;
    }

    // For other external images, use the backend proxy to bypass ISP blocks
    const API_URL = import.meta.env.VITE_API_URL || 'https://rizqaratech-backend.onrender.com/api';
    let proxiedUrl = `${API_URL}/proxy-image?url=${encodeURIComponent(url)}`;
    if (width) proxiedUrl += `&width=${width}`;
    if (height) proxiedUrl += `&height=${height}`;
    
    return proxiedUrl;
};
