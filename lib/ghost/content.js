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
  console.log('🔑 Required parameters CONTENT_KEY and ADMIN_KEY are missing!');
  console.log('❓ Need a key?');
  console.log('  - On your Ghost admin > Integrations > Create custom integration');
  console.log('  - Copy Content API Key');
  console.log('💡 Need help? Check https://ghostboard.io/blog/how-to-integrate-ghostboard-with-ghost-content-api/');
  console.log('Example: ghost-purge-images display --content-key=b9e67a87885747c684dcd61654 --admin-key=5c4c84c28bb28eaaf1250d1a');
  process.exit(1);
}
contentAPIKey = argv[1].split('=')[1];

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
    contentAPIKey
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
