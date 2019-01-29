const async = require('async');
const request = require('request');
const posts = require('./posts.js');

module.exports = {
  isBeingUsed(upload, pages, callback) {
    // Pages have same properties as posts
    // Then use the same function
    // Doc: https://docs.ghost.org/api/content/#pages
    posts.isBeingUsed(upload, pages, callback);
  },
  list(params, callback) {
    let totalPages = 1;
    let currentPage = 1;
    let output = [];
    async.whilst(
      () => currentPage <= totalPages,
      (done) => {
        const url = `${params.url}ghost/api/v2/content/pages/?limit=100&page=${currentPage}&key=${params.contentAPIKey}`;
        request.get(url, (err, http, body) => {
          if (err) {
            return done(err);
          }
          try {
            body = JSON.parse(body);
          } catch (e) {
            return done('API Pages - Not valid JSON response', body);
          }
          const hasPosts = body && body.pages && body.pages.length >= 0;
          const hasPages = body && body.meta && body.meta.pagination
                          && body.meta.pagination.pages;
          const valid = hasPosts && hasPages;
          if (!valid) {
            return done('API Pages - Not valid response', body);
          }
          totalPages = body.meta.pagination.pages;
          currentPage += 1;
          output = output.concat(body.pages);
          done();
        });
      }, (err) => {
        callback(err, output);
      }
    );
  }
};
