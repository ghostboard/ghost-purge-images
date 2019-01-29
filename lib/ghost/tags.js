const async = require('async');
const request = require('request');

module.exports = {
  isBeingUsed(upload, tags, callback) {
    const path = upload.path;
    async.eachSeries(tags, (tag, cb) => {
      const inFeat = tag.feature_image && tag.feature_image.includes(path);
      const used = inFeat;
      if (used) {
        return callback(null, true);
      }
      cb();
    }, (err) => {
      callback(err, false);
    });
  },
  list(params, callback) {
    let totalPages = 1;
    let currentPage = 1;
    let output = [];
    async.whilst(
      () => currentPage <= totalPages,
      (done) => {
        const url = `${params.url}ghost/api/v2/content/tags/?limit=100&page=${currentPage}&fields=feature_image&key=${params.contentAPIKey}`;
        request.get(url, (err, http, body) => {
          if (err) {
            return done(err);
          }
          try {
            body = JSON.parse(body);
          } catch (e) {
            return done('API Tags - Not valid JSON response', body);
          }
          const hasPosts = body && body.tags && body.tags.length >= 0;
          const hasPages = body && body.meta && body.meta.pagination
                          && body.meta.pagination.pages;
          const valid = hasPosts && hasPages;
          if (!valid) {
            return done('API Tags - Not valid response', body);
          }
          totalPages = body.meta.pagination.pages;
          currentPage += 1;
          output = output.concat(body.tags);
          done();
        });
      }, (err) => {
        callback(err, output);
      }
    );
  }
};
