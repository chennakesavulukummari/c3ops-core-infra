import React from 'react';

/**
 * Google Analytics 4 Hook for React
 * Provides functions to track page views, events, and user properties
 * Measurement ID: G-7SRJYX3DT9
 */

export interface GAEventParams {
  [key: string]: string | number | boolean | string[] | undefined;
}

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Initialize Google Analytics
 * This is called automatically in index.html but can be called manually if needed
 */
export const initializeGA = (measurementId: string = 'G-7SRJYX3DT9') => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    }
    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: true,
    });
  }
};

/**
 * Track a page view event
 * @param pagePath - The path of the page (e.g., '/about')
 * @param pageTitle - The title of the page
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      send_page_view: true,
    });
  }
};

/**
 * Track a custom event
 * @param eventName - The name of the event
 * @param params - Event parameters
 */
export const trackEvent = (eventName: string, params?: GAEventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params || {});
  }
};

/**
 * Track a button click
 * @param buttonName - Name/label of the button
 * @param buttonText - Display text of the button
 */
export const trackButtonClick = (buttonName: string, buttonText?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_text: buttonText || '',
  });
};

/**
 * Track a form submission
 * @param formName - Name of the form
 * @param formData - Form data object
 */
export const trackFormSubmission = (
  formName: string,
  formData?: Record<string, unknown>
) => {
  trackEvent('form_submission', {
    form_name: formName,
    ...formData,
  });
};

/**
 * Track a link click
 * @param linkUrl - URL of the link
 * @param linkText - Display text of the link
 * @param linkType - Type of link (internal/external)
 */
export const trackLinkClick = (
  linkUrl: string,
  linkText?: string,
  linkType?: string
) => {
  trackEvent('link_click', {
    link_url: linkUrl,
    link_text: linkText || '',
    link_type: linkType || 'internal',
  });
};

/**
 * Track a CTA click (Call-to-Action)
 * @param ctaName - Name of the CTA
 * @param ctaSection - Section where CTA appears
 */
export const trackCTAClick = (ctaName: string, ctaSection?: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_section: ctaSection || '',
  });
};

/**
 * Track an assessment booking
 * @param email - User email
 * @param company - Company name
 */
export const trackAssessmentBooking = (email: string, company?: string) => {
  trackEvent('assessment_booked', {
    email,
    company: company || '',
    booking_source: document.location.pathname,
  });
};

/**
 * Track a file download
 * @param fileName - Name of the file
 * @param fileType - Type of file (pdf, doc, etc.)
 */
export const trackFileDownload = (fileName: string, fileType?: string) => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType || 'unknown',
  });
};

/**
 * Track a video play
 * @param videoTitle - Title of the video
 * @param videoUrl - URL of the video
 */
export const trackVideoPlay = (videoTitle: string, videoUrl?: string) => {
  trackEvent('video_play', {
    video_title: videoTitle,
    video_url: videoUrl || '',
  });
};

/**
 * Track a scroll event
 * @param scrollDepth - Percentage of page scrolled (25, 50, 75, 100)
 */
export const trackScrollDepth = (scrollDepth: number) => {
  trackEvent('scroll_depth', {
    scroll_percentage: scrollDepth,
  });
};

/**
 * Set user properties
 * @param userId - Unique user ID
 * @param properties - User properties object
 */
export const setUserProperties = (
  userId: string,
  properties?: Record<string, string | number>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-7SRJYX3DT9', {
      user_id: userId,
      ...properties,
    });
  }
};

/**
 * Track an error event
 * @param errorMessage - Error message
 * @param errorType - Type of error
 */
export const trackError = (errorMessage: string, errorType?: string) => {
  trackEvent('error', {
    error_message: errorMessage,
    error_type: errorType || 'unknown',
  });
};

/**
 * React Hook for tracking page views
 * Use this in your route components
 */
export const usePageView = (pagePath: string, pageTitle?: string) => {
  React.useEffect(() => {
    trackPageView(pagePath, pageTitle);
  }, [pagePath, pageTitle]);
};

/**
 * Google Analytics Component
 * Initializes GA4 and provides tracking context
 */
export const GoogleAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  React.useEffect(() => {
    // GA4 is already loaded via index.html script tag
    // This component ensures GA is available throughout the app
    if (typeof window !== 'undefined' && !window.gtag) {
      initializeGA();
    }
  }, []);

  return <>{children}</>;
};

export default {
  trackPageView,
  trackEvent,
  trackButtonClick,
  trackFormSubmission,
  trackLinkClick,
  trackCTAClick,
  trackAssessmentBooking,
  trackFileDownload,
  trackVideoPlay,
  trackScrollDepth,
  setUserProperties,
  trackError,
  usePageView,
  GoogleAnalyticsProvider,
};
