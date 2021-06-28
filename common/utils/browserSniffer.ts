import platform from 'platform';
import getConfig from 'next/config';

const firebaseConfig = getConfig() || {};
const publicRuntimeConfig = firebaseConfig.publicRuntimeConfig || {};
const APP_VERSION = publicRuntimeConfig.appVersion || 'v0.0.0';
const OS = platform.os.family;
const BROWSER = platform.name;

// Used to identify app, OS, browswer and app version
export const userAgent = `Web Client${OS && ' · '}${OS}${
  BROWSER && ' · '
}${BROWSER} (Sparkle v${APP_VERSION})`;
