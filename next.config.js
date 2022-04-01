const gitVersion = require('git-tag-version');

const BASE_PATH = process.env.BASE_PATH || '';

module.exports = {
  trailingSlash: true,
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  images: {
    loader: 'imgix',
    path: ''
  },

  publicRuntimeConfig: {
    basePath: BASE_PATH,
    appVersion: `${gitVersion() || '0.0.0'}`.split(/-|_/)[0]
  },

  // Fix issue with node build
  // in some environments: https://stackoverflow.com/questions/67478532/module-not-found-cant-resolve-fs-nextjs
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback, // include other fallback
      fs: false // the solution
    };
    return config;
  }
};
