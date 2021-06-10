const gitVersion = require('git-tag-version');

module.exports = {
  trailingSlash: true,

  publicRuntimeConfig: {
    appVersion: `${gitVersion() || '0.0.0'}`.split(/-|_/)[0]
  }
};
