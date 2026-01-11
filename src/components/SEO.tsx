import React from 'react';
import { Helmet } from 'react-helmet-async';

type SEOProps = {
    title: string;
    description: string;
    canonical?: string;
    image?: string;
    type?: string;
};

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    canonical,
    image = 'https://rizqaratech.vercel.app/og-image.png',
    type = 'website'
}) => {
    const fullTitle = title.includes('|') ? title : `${title} | RizQara Tech`; // Auto-append brand if missing
    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            {canonical && <meta property="og:url" content={canonical} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};
