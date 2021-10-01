const axios = require('axios');

function isBeingUsed(upload, settings) {
  const path = upload.path;
  const filename = path.substring(path.lastIndexOf('/') + 1);
  const inLogo = settings.logo && settings.logo.includes(filename);
  const inIcon = settings.icon && settings.icon.includes(filename);
  const inCover = settings.cover_image && settings.cover_image.includes(filename);
  const inTwitter = settings.twitter_image && settings.twitter_image.includes(filename);
  const inFacebook = settings.og_image && settings.og_image.includes(filename);
  const isUsed = inLogo || inIcon || inCover || inTwitter || inFacebook;
  return !!isUsed;
}

async function list(params) {
  const { url, contentAPIKey } = params;
  const apiUrl = `${url}ghost/api/v3/content/settings/?key=${contentAPIKey}`;
  const body = await axios.get(apiUrl).then((res) => res.data);
  const hasData = body && body.settings;
  if (!hasData) {
    throw Error(`Settings API - Not valid response: ${JSON.stringify(body)}`);
  }
  return body.settings;
}

module.exports = {
  isBeingUsed,
  list
};
