const gitVersion = require('git-tag-version');

const BASE_PATH = process.env.BASE_PATH || '';

module.exports = {
  trailingSlash: true,
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,

  publicRuntimeConfig: {
    basePath: BASE_PATH,
    appVersion: `${gitVersion() || '0.0.0'}`.split(/-|_/)[0]
  }
};
