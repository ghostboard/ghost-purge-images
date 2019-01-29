const async = require('async');
const request = require('request');

module.exports = {
  isBeingUsed(upload, authors, callback) {
    const path = upload.path;
    async.eachSeries(authors, (author, cb) => {
      const inProfile = author.profile_image && author.profile_image.includes(path);
      const inCover = author.cover_image && author.cover_image.includes(path);
      const used = inProfile || inCover;
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
        const url = `${params.url}ghost/api/v2/content/authors/?limit=100&page=${currentPage}&fields=cover_image,profile_image&key=${params.contentAPIKey}`;
        request.get(url, (err, http, body) => {
          if (err) {
            return done(err);
          }
          try {
            body = JSON.parse(body);
          } catch (e) {
            return done('API Authors - Not valid JSON response', body);
          }
          const hasPosts = body && body.authors && body.authors.length >= 0;
          const hasPages = body && body.meta && body.meta.pagination
                          && body.meta.pagination.pages;
          const valid = hasPosts && hasPages;
          if (!valid) {
            return done('API Authors - Not valid response', body);
          }
          totalPages = body.meta.pagination.pages;
          currentPage += 1;
          output = output.concat(body.authors);
          done();
        });
      }, (err) => {
        callback(err, output);
      }
    );
  }
};
