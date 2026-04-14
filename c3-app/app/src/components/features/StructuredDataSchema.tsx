import { useEffect } from 'react';

/**
 * Base type for all JSON-LD schemas
 */
export interface JsonLdSchema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

/**
 * Organization Schema - for knowledge panels
 */
export const createOrganizationSchema = (config: {
  name: string;
  description: string;
  url: string;
  logo?: string;
  image?: string;
  email?: string;
  phone?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  sameAs?: string[];
  founder?: { name: string; url?: string }[];
  foundingDate?: string;
}): JsonLdSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: config.name,
  description: config.description,
  url: config.url,
  logo: config.logo || `${config.url}/logo.png`,
  image: config.image || `${config.url}/image.jpg`,
  email: config.email,
  phone: config.phone,
  address: config.address && {
    '@type': 'PostalAddress',
    streetAddress: config.address.streetAddress,
    addressLocality: config.address.addressLocality,
    postalCode: config.address.postalCode,
    addressCountry: config.address.addressCountry,
  },
  sameAs: config.sameAs || [],
  ...(config.founder && { founder: config.founder }),
  ...(config.foundingDate && { foundingDate: config.foundingDate }),
});

/**
 * LocalBusiness Schema - for Google Maps and local search
 */
export const createLocalBusinessSchema = (config: {
  name: string;
  type: 'LocalBusiness' | 'SoftwareCompany' | 'ProfessionalService' | string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  phone: string;
  email: string;
  url: string;
  image?: string;
  priceRange?: string;
  businessHours?: Array<{
    dayOfWeek: string;
    opens: string;
    closes: string;
  }>;
  rating?: { ratingValue: number; reviewCount: number };
}): JsonLdSchema => ({
  '@context': 'https://schema.org',
  '@type': config.type,
  name: config.name,
  description: config.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: config.address.streetAddress,
    addressLocality: config.address.addressLocality,
    postalCode: config.address.postalCode,
    addressCountry: config.address.addressCountry,
  },
  telephone: config.phone,
  email: config.email,
  url: config.url,
  image: config.image,
  ...(config.priceRange && { priceRange: config.priceRange }),
  ...(config.businessHours && {
    openingHoursSpecification: config.businessHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    })),
  }),
  ...(config.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: config.rating.ratingValue,
      reviewCount: config.rating.reviewCount,
    },
  }),
});

/**
 * Course Schema - for course listings
 */
export const createCourseSchema = (config: {
  name: string;
  description: string;
  provider: string;
  providerUrl: string;
  image?: string;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  rating?: { ratingValue: number; reviewCount: number };
  price?: { currency: string; value: string };
  hasCourseInstance?: Array<{
    courseMode: 'Online' | 'Offline' | 'Hybrid';
    startDate: string;
    endDate?: string;
    location?: string;
  }>;
}): JsonLdSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: config.name,
  description: config.description,
  provider: {
    '@type': 'Organization',
    name: config.provider,
    url: config.providerUrl,
  },
  image: config.image,
  ...(config.duration && { duration: config.duration }),
  ...(config.level && { educationalLevel: config.level }),
  ...(config.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: config.rating.ratingValue,
      reviewCount: config.rating.reviewCount,
    },
  }),
  ...(config.price && {
    offers: {
      '@type': 'Offer',
      priceCurrency: config.price.currency,
      price: config.price.value,
    },
  }),
  ...(config.hasCourseInstance && {
    hasCourseInstance: config.hasCourseInstance.map((instance) => ({
      '@type': 'CourseInstance',
      courseMode: instance.courseMode,
      startDate: instance.startDate,
      endDate: instance.endDate,
      location: instance.location,
    })),
  }),
});

/**
 * JobPosting Schema - for job listings
 */
export const createJobPostingSchema = (config: {
  title: string;
  description: string;
  hireOrganization: { name: string; url: string; logo?: string };
  jobLocation: { streetAddress: string; addressLocality: string; addressCountry: string };
  baseSalary?: { currency: string; minValue: number; maxValue: number };
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY';
  datePosted: string;
  validThrough: string;
}): JsonLdSchema => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: config.title,
  description: config.description,
  hiringOrganization: {
    '@type': 'Organization',
    name: config.hireOrganization.name,
    url: config.hireOrganization.url,
    logo: config.hireOrganization.logo,
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.jobLocation.streetAddress,
      addressLocality: config.jobLocation.addressLocality,
      addressCountry: config.jobLocation.addressCountry,
    },
  },
  ...(config.baseSalary && {
    baseSalary: {
      '@type': 'PriceSpecification',
      priceCurrency: config.baseSalary.currency,
      minPrice: config.baseSalary.minValue,
      maxPrice: config.baseSalary.maxValue,
    },
  }),
  employmentType: config.employmentType,
  datePosted: config.datePosted,
  validThrough: config.validThrough,
});

/**
 * Event Schema - for webinars and workshops
 */
export const createEventSchema = (config: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: { name: string; address?: { streetAddress: string; addressLocality: string } };
  organizer: { name: string; url: string };
  image?: string;
  url?: string;
  isOnline?: boolean;
  attendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
}): JsonLdSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: config.name,
  description: config.description,
  startDate: config.startDate,
  ...(config.endDate && { endDate: config.endDate }),
  ...(config.location && {
    location: {
      '@type': 'Place',
      name: config.location.name,
      ...(config.location.address && {
        address: {
          '@type': 'PostalAddress',
          streetAddress: config.location.address.streetAddress,
          addressLocality: config.location.address.addressLocality,
        },
      }),
    },
  }),
  organizer: {
    '@type': 'Organization',
    name: config.organizer.name,
    url: config.organizer.url,
  },
  image: config.image,
  url: config.url,
  ...(config.attendanceMode && { eventAttendanceMode: config.attendanceMode }),
});

/**
 * Service Schema - for service offerings
 */
export const createServiceSchema = (config: {
  name: string;
  description: string;
  provider: { name: string; url: string };
  areaServed?: string[];
  priceRange?: string;
  rating?: { ratingValue: number; reviewCount: number };
  image?: string;
}): JsonLdSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: config.name,
  description: config.description,
  provider: {
    '@type': 'Organization',
    name: config.provider.name,
    url: config.provider.url,
  },
  ...(config.areaServed && { areaServed: config.areaServed }),
  ...(config.priceRange && { priceRange: config.priceRange }),
  ...(config.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: config.rating.ratingValue,
      reviewCount: config.rating.reviewCount,
    },
  }),
  image: config.image,
});

/**
 * BreadcrumbList Schema - for navigation
 */
export const createBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>
): JsonLdSchema => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * FAQ Schema - for expandable snippets
 */
export const createFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
): JsonLdSchema => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

/**
 * Article Schema - for blog posts and articles
 */
export const createArticleSchema = (config: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: { name: string; url?: string };
  publisher: { name: string; logo?: string };
  mainEntityOfPage?: string;
}): JsonLdSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: config.headline,
  description: config.description,
  image: config.image,
  datePublished: config.datePublished,
  ...(config.dateModified && { dateModified: config.dateModified }),
  author: {
    '@type': 'Person',
    name: config.author.name,
    ...(config.author.url && { url: config.author.url }),
  },
  publisher: {
    '@type': 'Organization',
    name: config.publisher.name,
    logo: config.publisher.logo,
  },
  ...(config.mainEntityOfPage && { mainEntityOfPage: config.mainEntityOfPage }),
});

/**
 * Inject JSON-LD schema into document head
 */
export const injectSchema = (schema: JsonLdSchema, id?: string) => {
  // Remove existing script with same ID if provided
  if (id) {
    const existing = document.querySelector(`script[id="${id}"]`);
    if (existing) {
      existing.remove();
    }
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  if (id) {
    script.id = id;
  }
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * React component to inject JSON-LD schema
 * Usage: <StructuredDataSchema schema={schema} />
 */
export const StructuredDataSchema = ({
  schema,
  id,
}: {
  schema: JsonLdSchema;
  id?: string;
}) => {
  useEffect(() => {
    injectSchema(schema, id);
  }, [schema, id]);

  return null;
};

/**
 * Inject multiple schemas
 */
export const injectMultipleSchemas = (
  schemas: Array<{ schema: JsonLdSchema; id?: string }>
) => {
  schemas.forEach(({ schema, id }) => {
    injectSchema(schema, id);
  });
};

/**
 * React component for multiple schemas
 * Usage: <MultipleStructuredData schemas={[{schema: org}, {schema: faq}]} />
 */
export const MultipleStructuredData = ({
  schemas,
}: {
  schemas: Array<{ schema: JsonLdSchema; id?: string }>;
}) => {
  useEffect(() => {
    injectMultipleSchemas(schemas);
  }, [schemas]);

  return null;
};

export default StructuredDataSchema;
