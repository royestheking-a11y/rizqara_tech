import React from 'react';
import { Helmet } from 'react-helmet-async';

type SEOProps = {
    title: string;
    description: string;
    keywords?: string;
    canonical?: string;
    image?: string;
    type?: string;
    schema?: object;
};

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    canonical,
    image = 'https://rizqara.tech/og-image.png',
    type = 'website',
    schema
}) => {
    // Optimization: More concise brand tagline
    const fullTitle = title.includes('|') ? title : `${title} | RizQara Tech`;
    
    // Default Organization Schema
    const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "RizQara Tech",
        "url": "https://rizqara.tech",
        "logo": "https://rizqara.tech/logo.png",
        "sameAs": [
            "https://facebook.com/rizqaratechology/",
            "https://twitter.com/rizqaratech",
            "https://instagram.com/rizqaratech",
            "https://linkedin.com/company/rizqara-tech",
            "https://www.youtube.com/@rizqaratech", // Added YouTube
            "https://medium.com/@rizqaratech"
        ]
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {canonical && <link rel="canonical" href={canonical} />}
            
            {/* Self-referencing Hreflang for SEO */}
            <link rel="alternate" hrefLang="en" href={canonical || "https://rizqara.tech/"} />

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

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(schema || defaultSchema)}
            </script>
        </Helmet>
    );
};
