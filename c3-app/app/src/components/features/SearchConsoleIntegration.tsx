import { useEffect } from 'react';

export interface SearchConsoleConfig {
  googleVerificationCode?: string;
  bingVerificationCode?: string;
  enableAutoVerification?: boolean;
}

/**
 * Utility to inject Google Search Console verification meta tag
 */
export const injectGoogleSearchConsoleTag = (verificationCode: string) => {
  const existingTag = document.querySelector(
    'meta[name="google-site-verification"]'
  ) as HTMLMetaElement;

  if (existingTag) {
    existingTag.content = verificationCode;
  } else {
    const tag = document.createElement('meta');
    tag.setAttribute('name', 'google-site-verification');
    tag.content = verificationCode;
    document.head.appendChild(tag);
  }
};

/**
 * Utility to inject Bing Webmaster Tools verification meta tag
 */
export const injectBingWebmasterTag = (verificationCode: string) => {
  const existingTag = document.querySelector(
    'meta[name="msvalidate.01"]'
  ) as HTMLMetaElement;

  if (existingTag) {
    existingTag.content = verificationCode;
  } else {
    const tag = document.createElement('meta');
    tag.setAttribute('name', 'msvalidate.01');
    tag.content = verificationCode;
    document.head.appendChild(tag);
  }
};

/**
 * Component to inject Search Console verification meta tags
 * Usage: <SearchConsoleIntegration googleVerificationCode="..." bingVerificationCode="..." />
 */
export const SearchConsoleIntegration = ({
  googleVerificationCode = (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as unknown as string) || '',
  bingVerificationCode = (import.meta.env.VITE_BING_SITE_VERIFICATION as unknown as string) || '',
  enableAutoVerification = true,
}: SearchConsoleConfig = {}) => {
  useEffect(() => {
    if (enableAutoVerification) {
      if (googleVerificationCode) {
        injectGoogleSearchConsoleTag(googleVerificationCode);
      }
      if (bingVerificationCode) {
        injectBingWebmasterTag(bingVerificationCode);
      }
    }
  }, [googleVerificationCode, bingVerificationCode, enableAutoVerification]);

  return null; // This component doesn't render anything
};

/**
 * Setup guide information for Google Search Console
 */
export const GOOGLE_SEARCH_CONSOLE_SETUP = {
  title: 'Google Search Console Setup Guide',
  steps: [
    {
      step: 1,
      title: 'Access Google Search Console',
      instructions: [
        'Go to https://search.google.com/search-console',
        'Click "Add Property"',
        'Enter your domain URL (e.g., https://www.c3ops.io)',
      ],
    },
    {
      step: 2,
      title: 'Choose Verification Method',
      instructions: [
        'Select "URL prefix" property type',
        'Click Continue',
        'Choose verification method: Meta tag, HTML file, DNS record, Google Analytics, or Google Tag Manager',
      ],
    },
    {
      step: 3,
      title: 'Meta Tag Verification (Recommended)',
      instructions: [
        'Copy the meta tag provided',
        'The environment variable will be: VITE_GOOGLE_SITE_VERIFICATION=<verification-code>',
        'Our <SearchConsoleIntegration /> component will auto-inject this tag',
        'Click Verify',
      ],
    },
    {
      step: 4,
      title: 'Verify Ownership',
      instructions: [
        'Ensure the meta tag is in the <head> section',
        'Wait for verification (usually instantaneous)',
        'You should see "Ownership verified"',
      ],
    },
    {
      step: 5,
      title: 'Submit Sitemap',
      instructions: [
        'Navigate to "Sitemaps" in the left menu',
        'Click "Add/Test sitemap"',
        'Enter: /sitemap.xml',
        'Google will crawl and index your URLs',
      ],
    },
    {
      step: 6,
      title: 'Monitor Performance',
      instructions: [
        'View search performance metrics',
        'Monitor impressions, clicks, CTR',
        'Check for crawl errors',
        'View top queries and pages',
      ],
    },
  ],
  keyMetrics: [
    'Impressions: How often your site appears in search',
    'Clicks: How often users click your search result',
    'CTR (Click-Through Rate): Impressions ÷ Clicks',
    'Average Position: Average ranking position',
  ],
};

/**
 * Setup guide information for Bing Webmaster Tools
 */
export const BING_WEBMASTER_TOOLS_SETUP = {
  title: 'Bing Webmaster Tools Setup Guide',
  steps: [
    {
      step: 1,
      title: 'Access Bing Webmaster Tools',
      instructions: [
        'Go to https://www.bing.com/webmaster/home',
        'Sign in with Microsoft account',
        'Click "Add a site"',
      ],
    },
    {
      step: 2,
      title: 'Verify Site Ownership',
      instructions: [
        'Enter your domain URL',
        'Choose verification method:',
        '  - Meta tag (Recommended)',
        '  - XML file upload',
        '  - CNAME record',
        '  - HTML file',
      ],
    },
    {
      step: 3,
      title: 'Meta Tag Verification',
      instructions: [
        'Copy the meta tag from Bing',
        'Set environment variable: VITE_BING_SITE_VERIFICATION=<code>',
        'Our component auto-injects: <meta name="msvalidate.01" content="..." />',
        'Click Verify',
      ],
    },
    {
      step: 4,
      title: 'Submit Sitemap',
      instructions: [
        'Go to "Sitemaps" section',
        'Click "Submit sitemap"',
        'Enter: https://yourdomain.com/sitemap.xml',
        'Bing will crawl your content',
      ],
    },
    {
      step: 5,
      title: 'Configure Crawl Settings',
      instructions: [
        'Go to "Crawl control" section',
        'Adjust crawl rate if needed',
        'Disallow paths if necessary',
        'Set geographic targeting',
      ],
    },
    {
      step: 6,
      title: 'Analyze Performance',
      instructions: [
        'Review search traffic data',
        'Check top queries and pages',
        'Monitor crawl errors',
        'View inbound links',
      ],
    },
  ],
  benefits: [
    "Bing's market share increased to ~3-4% globally",
    'Integrates with Microsoft Advertising',
    'Useful for targeting enterprise users',
    'Provides link analysis tools',
    'Mobile-friendliness testing',
  ],
};

/**
 * React component to display setup instructions
 * Usage: <SearchConsoleSetupGuide />
 */
export const SearchConsoleSetupGuide = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Search Console Setup Guide</h1>

      <section style={{ marginTop: '30px' }}>
        <h2>Google Search Console</h2>
        <ol>
          {GOOGLE_SEARCH_CONSOLE_SETUP.steps.map((step) => (
            <li key={step.step} style={{ marginBottom: '15px' }}>
              <strong>{step.title}</strong>
              <ul>
                {step.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <h3>Key Metrics to Monitor:</h3>
        <ul>
          {GOOGLE_SEARCH_CONSOLE_SETUP.keyMetrics.map((metric, idx) => (
            <li key={idx}>{metric}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2>Bing Webmaster Tools</h2>
        <ol>
          {BING_WEBMASTER_TOOLS_SETUP.steps.map((step) => (
            <li key={step.step} style={{ marginBottom: '15px' }}>
              <strong>{step.title}</strong>
              <ul>
                {step.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <h3>Key Benefits:</h3>
        <ul>
          {BING_WEBMASTER_TOOLS_SETUP.benefits.map((benefit, idx) => (
            <li key={idx}>{benefit}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default SearchConsoleIntegration;
