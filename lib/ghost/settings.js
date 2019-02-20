const request = require('request');

module.exports = {
  isBeingUsed(upload, settings, callback) {
    const path = upload.path;
    const inLogo = settings.logo && settings.logo.includes(path);
    const inCover = settings.cover_image && settings.cover_image.includes(path);
    const used = inLogo || inCover;
    callback(null, used);
  },
  list(params, callback) {
    const url = `${params.url}ghost/api/v2/content/settings/?key=${params.contentAPIKey}`;
    request.get(url, (err, http, body) => {
      if (err) {
        return callback(err);
      }
      try {
        body = JSON.parse(body);
      } catch (e) {
        return callback('API Settings - Not valid JSON response', body);
      }
      const hasData = body && body.settings;
      if (!hasData) {
        return callback('API Settings - Not valid response', body);
      }
      callback(err, body.settings);
    });
  }
};
