import { useEffect } from 'react';

export interface OpenGraphConfig {
  title: string;
  description: string;
  url?: string;
  type?: 'website' | 'article' | 'business.business' | 'product';
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export interface TwitterCardConfig {
  title: string;
  description: string;
  image?: string;
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  creator?: string;
  site?: string;
}

// Predefined Open Graph configurations for different page types
export const OG_CONFIGS = {
  homepage: {
    title: 'C3Ops - AI-Driven FinOps Platform | Reduce Cloud Costs 20-30%',
    description:
      'Save 20-30% on cloud costs with C3Ops AI-Driven FinOps Platform. Expert-led multi-cloud cost optimization for AWS, Azure, GCP.',
    type: 'website' as const,
    image: `${(import.meta.env.BASE_URL as unknown as string) || '/'}hero-page-c3ops-dashboard.png`,
    imageAlt: 'C3Ops Dashboard',
  },
  pricing: {
    title: 'C3Ops Pricing - Transparent FinOps Platform Pricing',
    description:
      'Flexible, transparent pricing for cloud cost optimization. Pay for value delivered.',
    type: 'website' as const,
  },
  about: {
    title: 'About C3Ops - Multi-Cloud FinOps Leaders',
    description:
      'Founded by certified FinOps professionals. Helping enterprises optimize cloud spending across AWS, Azure, and GCP.',
    type: 'website' as const,
  },
  blog: {
    title: 'C3Ops Blog - FinOps Insights & Cloud Cost Optimization',
    description:
      'Expert insights on cloud cost optimization, FinOps best practices, and multi-cloud strategies.',
    type: 'website' as const,
  },
  course: {
    title: 'FinOps Training & Certification | C3Ops Academy',
    description:
      'Comprehensive FinOps training for AWS, Azure, and GCP. Get certified in cloud cost optimization.',
    type: 'website' as const,
  },
} as const;

/**
 * Utility function to set Open Graph meta tags
 * Call this in useEffect to update OG tags dynamically
 */
export const setOpenGraphTags = (config: OpenGraphConfig) => {
  const getOrCreateMetaTag = (
    property: string,
    isMeta: boolean = false
  ): HTMLMetaElement => {
    const attr = isMeta ? 'name' : 'property';
    let tag = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement;

    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, property);
      document.head.appendChild(tag);
    }

    return tag;
  };

  // Basic OG tags
  getOrCreateMetaTag('og:title').content = config.title;
  getOrCreateMetaTag('og:description').content = config.description;
  getOrCreateMetaTag('og:type').content = config.type || 'website';

  if (config.url) {
    getOrCreateMetaTag('og:url').content = config.url;
  }

  if (config.image) {
    getOrCreateMetaTag('og:image').content = config.image;
    if (config.imageAlt) {
      getOrCreateMetaTag('og:image:alt').content = config.imageAlt;
    }
    if (config.imageWidth) {
      getOrCreateMetaTag('og:image:width').content = String(config.imageWidth);
    }
    if (config.imageHeight) {
      getOrCreateMetaTag('og:image:height').content = String(config.imageHeight);
    }
  }

  // Article-specific tags
  if (config.type === 'article') {
    if (config.publishedTime) {
      getOrCreateMetaTag('article:published_time').content = config.publishedTime;
    }
    if (config.modifiedTime) {
      getOrCreateMetaTag('article:modified_time').content = config.modifiedTime;
    }
    if (config.author) {
      getOrCreateMetaTag('article:author').content = config.author;
    }
    if (config.section) {
      getOrCreateMetaTag('article:section').content = config.section;
    }
    if (config.tags && config.tags.length > 0) {
      config.tags.forEach((tag, index) => {
        getOrCreateMetaTag(`article:tag:${index}`).content = tag;
      });
    }
  }

  // Locale
  if (config.locale) {
    getOrCreateMetaTag('og:locale').content = config.locale;
  }

  // Update title tag
  document.title = config.title;
};

/**
 * Set Twitter Card meta tags
 */
export const setTwitterCardTags = (config: TwitterCardConfig) => {
  const getOrCreateMetaTag = (name: string): HTMLMetaElement => {
    let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    return tag;
  };

  getOrCreateMetaTag('twitter:card').content = config.card || 'summary_large_image';
  getOrCreateMetaTag('twitter:title').content = config.title;
  getOrCreateMetaTag('twitter:description').content = config.description;

  if (config.image) {
    getOrCreateMetaTag('twitter:image').content = config.image;
  }

  if (config.creator) {
    getOrCreateMetaTag('twitter:creator').content = config.creator;
  }

  if (config.site) {
    getOrCreateMetaTag('twitter:site').content = config.site;
  }
};

/**
 * React component to set OG tags
 * Usage: <OpenGraphMeta {...OG_CONFIGS.homepage} />
 */
export const OpenGraphMeta = (config: OpenGraphConfig) => {
  useEffect(() => {
    setOpenGraphTags({
      ...config,
      url: config.url || window.location.href,
      locale: config.locale || 'en_US',
    });
  }, [config]);

  return null; // This component doesn't render anything
};

/**
 * React component to set Twitter Card tags
 * Usage: <TwitterCardMeta title="..." description="..." />
 */
export const TwitterCardMeta = (config: TwitterCardConfig) => {
  useEffect(() => {
    setTwitterCardTags(config);
  }, [config]);

  return null;
};

/**
 * Compound component for all social meta tags
 * Usage: <SocialMetaTags ogConfig={...} twitterConfig={...} />
 */
export const SocialMetaTags = ({
  ogConfig,
  twitterConfig,
}: {
  ogConfig?: OpenGraphConfig;
  twitterConfig?: TwitterCardConfig;
}) => {
  return (
    <>
      {ogConfig && <OpenGraphMeta {...ogConfig} />}
      {twitterConfig && <TwitterCardMeta {...twitterConfig} />}
    </>
  );
};

export default OpenGraphMeta;
