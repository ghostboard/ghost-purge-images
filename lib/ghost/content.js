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

const contentAPIKey = argv['content-key'] || argv.content_key || argv.CONTENT_KEY;
const adminAPIKey = argv['admin-key'] || argv.admin_key || argv.ADMIN_KEY;
const hasContentKey = !!contentAPIKey;
const hasAdminKey = !!adminAPIKey;
const hasKeys = hasContentKey && hasAdminKey;
if (!hasKeys) {
  if (!hasContentKey) {
    console.log('🔑 Required parameter CONTENT_KEY is missing!');
  }
  if (!hasAdminKey) {
    console.log('🔑 Required parameter ADMIN_KEY is missing!');
  }
  console.log('❓ Need a key?');
  console.log('  - On your Ghost admin > Integrations > Create custom integration');
  console.log('  - Copy Content API & Admin API Keys');
  console.log('💡 Need help? Check https://ghostboard.io/blog/how-to-integrate-ghostboard-with-ghost-content-api/');
  console.log('Example: ghost-purge-images display --content-key=b9e67a87885747c684dcd61654 --admin-key=5c4c84c28bb28eaaf1250d1a');
  process.exit(1);
}

async function fetch() {
  if (!config) {
    throw Error('Can not find config.production.json');
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

  return {
    authors: await authors.list(params),
    pages: await pages.list(params),
    posts: await posts.list(params),
    settings: await settings.list(params),
    tags: await tags.list(params)
  };
}

module.exports = {
  fetch
};
