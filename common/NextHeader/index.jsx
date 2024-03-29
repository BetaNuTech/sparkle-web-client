import Head from 'next/head';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const basePath = publicRuntimeConfig.basePath || '';

export const NextHeader = () => (
  <Head>
    <title>Sparkle</title>

    {/* TODO: meta description */}
    <meta name="description" content="" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
    />

    <link rel="manifest" href={`${basePath}/manifest.json`} />
    <link rel="apple-touch-icon" href={`${basePath}/apple-touch-icon.png`} />
    <link
      rel="icon"
      type="image/png"
      href={`${basePath}/img/standalone-app/icon-72x72.png`}
    />

    <meta name="theme-color" content="#3071ef" />
  </Head>
);
