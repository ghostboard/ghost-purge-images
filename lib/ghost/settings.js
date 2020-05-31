const request = require('request');

function isBeingUsed(upload, settings) {
  const path = upload.path;
  const filename = path.substring(path.lastIndexOf('/') + 1);
  const inLogo = settings.logo && settings.logo.includes(filename);
  const inCover = settings.cover_image && settings.cover_image.includes(filename);
  const isUsed = inLogo || inCover;
  return !!isUsed;
}

function list(params) {
  return new Promise(((resolve, reject) => {
    const url = `${params.url}ghost/api/v3/content/settings/?key=${params.contentAPIKey}`;
    request.get(url, (err, http, body) => {
      if (err) {
        return reject(err);
      }
      try {
        body = JSON.parse(body);
      } catch (e) {
        return reject(`API Settings - Not valid JSON response ${JSON.stringify(body)}`);
      }
      const hasData = body && body.settings;
      if (!hasData) {
        return reject(`API Settings - Not valid response${JSON.stringify(body)}`);
      }
      resolve(body.settings);
    });
  }));
}

module.exports = {
  isBeingUsed,
  list
};
