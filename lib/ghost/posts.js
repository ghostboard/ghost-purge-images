const async = require('async');
const request = require('request');

module.exports = {
  isBeingUsed(upload, posts, callback) {
    const path = upload.path;
    async.eachSeries(posts, (post, cb) => {
      const inBody = post.html && post.html.includes(path);
      const inFeat = post.feature_image && post.feature_image.includes(path);
      const inOG = post.og_image && post.og_image.includes(path);
      const inTw = post.twitter_image && post.twitter_image.includes(path);
      const used = inBody || inFeat || inOG || inTw;
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
        const url = `${params.url}ghost/api/v2/content/posts/?limit=100&page=${currentPage}&key=${params.contentAPIKey}`;
        request.get(url, (err, http, body) => {
          if (err) {
            return done(err);
          }
          try {
            body = JSON.parse(body);
          } catch (e) {
            return done('API Posts - Not valid JSON response', body);
          }
          const hasPosts = body && body.posts && body.posts.length >= 0;
          const hasPages = body && body.meta && body.meta.pagination
                          && body.meta.pagination.pages;
          const valid = hasPosts && hasPages;
          if (!valid) {
            return done('API Posts - Not valid response', body);
          }
          totalPages = body.meta.pagination.pages;
          currentPage += 1;
          output = output.concat(body.posts);
          done();
        });
      }, (err) => {
        callback(err, output);
      }
    );
  }
};
