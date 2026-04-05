import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    type?: 'website' | 'article' | 'profile';
    canonical?: string;
    jsonLd?: Record<string, any>;
    breadcrumbs?: { name: string; item: string }[];
}

export default function SEO({
    title,
    description,
    keywords,
    image = '/assets/Eliezerperezphoto.webp',
    type = 'website',
    canonical,
    jsonLd,
    breadcrumbs
}: SEOProps) {
    const location = useLocation();
    const siteUrl = 'https://eliezerperez.com';
    const currentUrl = canonical || `${siteUrl}${location.pathname}`;

    // Schema.org Default (ProfessionalService / Person) - Focado na França
    const defaultJsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Eliezer Pérez",
        "image": `${siteUrl}/logo.webp`,
        "logo": `${siteUrl}/logo.webp`,
        "url": siteUrl,
        "telephone": "",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Paris",
            "addressCountry": "FR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 48.8566,
            "longitude": 2.3522
        },
        "priceRange": "€€€",
        "description": "Expert en automatisation n8n et IA basé à Paris. Solutions sur-mesure pour PME et Startups em France.",
        "sameAs": [
            "https://github.com/sierraperez",
            "https://linkedin.com/in/sierraperezeliezer"
        ],
        "knowsAbout": ["n8n", "AI Automation", "Web Development", "Node.js", "React"],
        "areaServed": "France"
    };

    // Breadcrumb Schema
    const breadcrumbSchema = breadcrumbs ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((b, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": b.name,
            "item": b.item.startsWith('http') ? b.item : `${siteUrl}${b.item}`
        }))
    } : null;

    // Merger for multiple schemas
    const schemas = [jsonLd || defaultJsonLd];
    if (breadcrumbSchema) schemas.push(breadcrumbSchema);

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{title} | Eliezer Pérez</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords || "expert n8n paris, automatisation workflow france, freelance n8n lyon, développeur ia paris, consultant n8n, intégration api n8n, automatisation process pme"} />
            <link rel="canonical" href={currentUrl} />

            {/* Hreflang for International SEO (France focus) */}
            <link rel="alternate" href={currentUrl} hrefLang="x-default" />
            <link rel="alternate" href={currentUrl} hrefLang="fr-fr" />
            <link rel="alternate" href={currentUrl} hrefLang="en-us" />

            {/* Open Graph */}
            <meta property="og:title" content={`${title} | Eliezer Pérez`} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />
            <meta property="og:site_name" content="Eliezer Pérez Portfolio" />
            <meta property="og:locale" content="fr_FR" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${title} | Eliezer Pérez`} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />

            {/* Structured Data (JSON-LD) */}
            {schemas.map((schema, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}
        </Helmet>
    );
}
