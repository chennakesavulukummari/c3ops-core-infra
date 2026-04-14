import { useEffect, useCallback } from 'react';

interface IndexNowConfig {
  key: string;
  engines?: ('bing' | 'yandex' | 'duckduckgo' | 'google')[];
}

const INDEX_NOW_ENDPOINTS = {
  bing: 'https://www.bing.com/indexnow',
  yandex: 'https://yandex.com/indexnow',
  duckduckgo: 'https://duckduckgo.com/indexnow',
  google: 'https://www.google.com/ping',
};

/**
 * Hook to submit URLs to IndexNow for instant indexing
 * Usage: useIndexNow({ key: import.meta.env.VITE_INDEXNOW_KEY })
 */
export const useIndexNow = (config?: IndexNowConfig) => {
  const indexNowKey = config?.key || (import.meta.env.VITE_INDEXNOW_KEY as unknown as string);
  const engines = config?.engines || ['bing', 'yandex'];

  const submitUrl = useCallback(
    async (url: string) => {
      if (!indexNowKey) {
        console.warn('IndexNow key not configured');
        return;
      }

      const payload = {
        host: window.location.hostname,
        key: indexNowKey,
        urlList: [url],
      };

      // Submit to each configured search engine
      for (const engine of engines) {
        try {
          if (engine === 'google') {
            // Google uses a different endpoint
            const pingUrl = `${INDEX_NOW_ENDPOINTS.google}?sitemap=${encodeURIComponent(
              `${window.location.origin}/sitemap.xml`
            )}`;
            await fetch(pingUrl, { method: 'GET' });
          } else {
            const response = await fetch(INDEX_NOW_ENDPOINTS[engine], {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });

            if (!response.ok) {
              console.warn(
                `IndexNow submission to ${engine} failed:`,
                response.statusText
              );
            } else {
              console.log(`✓ URL submitted to ${engine}`);
            }
          }
        } catch (error) {
          console.warn(`IndexNow ${engine} submission error:`, error);
        }
      }
    },
    [indexNowKey, engines]
  );

  return { submitUrl };
};

/**
 * Component to auto-submit current page to IndexNow on load
 * Usage: <IndexNowTracker />
 */
export const IndexNowTracker = ({ engines = ['bing', 'yandex'] }: { engines?: ('bing' | 'yandex' | 'duckduckgo' | 'google')[] } = {}) => {
  const { submitUrl } = useIndexNow({ key: '', engines });

  useEffect(() => {
    // Submit current page URL to IndexNow on component mount
    const currentUrl = window.location.href;
    submitUrl(currentUrl);
  }, [submitUrl]);

  return null; // This component doesn't render anything
};

/**
 * Batch submit multiple URLs to IndexNow
 * Usage: submitBatchToIndexNow(['url1', 'url2'], { key: 'your-key' })
 */
export const submitBatchToIndexNow = async (
  urls: string[],
  config?: IndexNowConfig
) => {
  const indexNowKey = config?.key || (import.meta.env.VITE_INDEXNOW_KEY as unknown as string);
  const engines = config?.engines || ['bing', 'yandex'];

  if (!indexNowKey) {
    throw new Error('IndexNow key is required');
  }

  if (urls.length === 0) {
    throw new Error('At least one URL is required');
  }

  const payload = {
    host: new URL(urls[0]).hostname,
    key: indexNowKey,
    urlList: urls,
  };

  const results: Record<string, boolean> = {};

  for (const engine of engines) {
    try {
      const response = await fetch(INDEX_NOW_ENDPOINTS[engine], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      results[engine] = response.ok;
      if (!response.ok) {
        console.warn(
          `Batch submission to ${engine} failed:`,
          response.statusText
        );
      } else {
        console.log(`✓ Batch of ${urls.length} URLs submitted to ${engine}`);
      }
    } catch (error) {
      results[engine] = false;
      console.warn(`IndexNow ${engine} batch error:`, error);
    }
  }

  return results;
};

export default IndexNowTracker;
