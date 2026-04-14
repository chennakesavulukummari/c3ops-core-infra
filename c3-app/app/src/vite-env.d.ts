/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INDEXNOW_KEY?: string;
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string;
  readonly VITE_BING_SITE_VERIFICATION?: string;
  readonly VITE_GOOGLE_GA_ID?: string;
  readonly VITE_GTM_ID?: string;
  readonly VITE_FACEBOOK_PIXEL_ID?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_APP_DESCRIPTION?: string;
  readonly VITE_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
