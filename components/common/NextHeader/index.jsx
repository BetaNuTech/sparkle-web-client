import Head from 'next/head';

export const NextHeader = () => (
  <Head>
    <meta charset="utf-8" />
    <title>Sparkle</title>

    {/* TODO: meta description */}
    <meta name="description" content="" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
    />

    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="apple-touch-icon.png" />

    <meta name="theme-color" content="#3071ef" />
  </Head>
);
