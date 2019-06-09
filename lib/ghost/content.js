const async = require('async');
const auth = require('./auth.js');
const posts = require('./posts.js');
const pages = require('./pages.js');
const tags = require('./tags.js');
const authors = require('./authors.js');
const settings = require('./settings.js');
const argv = require('minimist')(process.argv.slice(2));

let config = null;
try {
  const configPath = `${process.cwd()}/config.production.json`;
  config = require(configPath);
} catch (err) {
  throw Error(`Error reading config.production.json ${err}`);
}
const contentAPIKey = argv['content-key'] || argv['CONTENT-KEY'];
const adminAPIKey = argv['admin-key'] || argv['ADMIN-KEY'];
const hasContentKey = !!contentAPIKey;
const hasAdminKey = !!adminAPIKey;
const hasKeys = hasContentKey && hasAdminKey;
if (!hasKeys) {
  if (!hasContentKey) {
    console.log('🔑 Required parameter CONTENT-KEY is missing!');
  }
  if (!hasAdminKey) {
    console.log('🔑 Required parameter ADMIN-KEY is missing!');
  }

  console.log('❓ Need a key?');
  console.log('  - On your Ghost admin > Integrations > Create custom integration');
  console.log('  - Copy Content API & Admin API Keys');
  console.log('💡 Need help? Check https://ghostboard.io/blog/how-to-integrate-ghostboard-with-ghost-content-api/');
  console.log('Add your keys, example: ghost-purge-images display --content-key=b9e67a87885747c684dcd61654 --admin-key=5c4c84c28bb28eaaf1250d1a...');
  process.exit(1);
}

module.exports = {
  fetch(cb) {
    if (!config) {
      return cb('Can not find config.production.json');
    }
    let url = config.url;
    if (!url.endsWith('/')) {
      url += '/';
    }
    const params = {
      url,
      adminAPIKey,
      contentAPIKey,
      authToken: auth.getToken(adminAPIKey)
    };
    async.parallel({
      authors(apiCb) {
        authors.list(params, apiCb);
      },
      pages(apiCb) {
        pages.list(params, apiCb);
      },
      posts(apiCb) {
        posts.list(params, apiCb);
      },
      settings(apiCb) {
        settings.list(params, apiCb);
      },
      tags(apiCb) {
        tags.list(params, apiCb);
      }
    }, (err, out) => {
      if (err) {
        return cb(err, null);
      }
      cb(null, out);
    });
  }
};
