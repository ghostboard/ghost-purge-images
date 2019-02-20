const async = require('async');
const posts = require('./posts.js');
const pages = require('./pages.js');
const tags = require('./tags.js');
const authors = require('./authors.js');
const settings = require('./settings.js');
const argv = process.argv.slice(2);
const hasParam = argv.length >= 2;

let config = null;
try {
  const configPath = `${process.cwd()}/config.production.json`;
  config = require(configPath);
} catch (err) {
  throw Error(`Error reading config.production.json ${err}`);
}
let contentAPIKey = null;
const hasKey = hasParam && argv[1].includes('key=');
if (!hasKey) {
  console.log('🔑 Required parameter KEY is missing!');
  console.log('❓ Need a key?');
  console.log('  - On your Ghost admin > Integrations > Create custom integration');
  console.log('  - Copy Content API Key');
  console.log('💡 Need help? Check https://ghostboard.io/blog/how-to-integrate-ghostboard-with-ghost-content-api/');
  console.log('At the end of the command add `key=YOUR_KEY` Example: ghost-purge-images display key=b9e67a87885747c684dcd61654');
  process.exit(1);
}
contentAPIKey = argv[1].split('=')[1];

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
      contentAPIKey
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
