const auth = require('./auth.js');
const Posts = require('./posts.js');
const Pages = require('./pages.js');
const Tags = require('./tags.js');
const Authors = require('./authors.js');
const Settings = require('./settings.js');
const argv = require('minimist')(process.argv.slice(2));
const CUSTOM_URL = argv['url'] || argv.URL || false;
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
	let url;
	if (CUSTOM_URL) {
		url = CUSTOM_URL;
	} else{
		let config = null;
		try {
			const configPath = `${process.cwd()}/config.production.json`;
			config = require(configPath);
		} catch (err) {
			throw Error(`Error reading config.production.json ${err}`);
		}
		if (!config) {
			throw Error('Can not find config.production.json');
		}
		if (!config.url) {
			throw Error('Can not find property "url" in config.production.json');
		}
		url = config.url;
	}

  if (!url.endsWith('/')) {
    url += '/';
  }
  const params = {
    url,
    adminAPIKey,
    contentAPIKey,
    authToken: auth.getToken(adminAPIKey)
  };

  const [
      authors,
      pages,
      posts,
      settings,
      tags
  ] = await Promise.all([
      Authors.list(params),
      Pages.list(params),
      Posts.list(params),
      Settings.list(params),
      Tags.list(params)
  ])
  return {
    authors,
    pages,
    posts,
    settings,
    tags
  };
}

module.exports = {
  fetch
};
