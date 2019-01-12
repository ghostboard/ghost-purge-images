const async = require('async');
const request = require('request');

function getCredentials(url, callback) {
  request.get(url, (err, http, body) => {
    const proceed = !err && body;
    if (!proceed) {
      return callback(`fetchGhostAPI - Invalid response err=${err} body=${body}`);
    }
    const ghostInit = body.indexOf('ghost.init(');
    const hasGhostAPI = ghostInit !== -1;
    if (!hasGhostAPI) {
      return callback('Ghost API not available');
    }
    const clientId = body.indexOf('clientId:', ghostInit);
    const clientIdStart = body.indexOf('"', clientId);
    const clientIdEnd = body.indexOf('"', clientIdStart + 1);
    const clientIdValue = body.substring(clientIdStart + 1, clientIdEnd);
    const secretId = body.indexOf('clientSecret:', ghostInit);
    const secretIdStart = body.indexOf('"', secretId);
    const secretIdEnd = body.indexOf('"', secretIdStart + 1);
    const secretIdValue = body.substring(secretIdStart + 1, secretIdEnd);
    const output = {
      clientId: clientIdValue,
      clientSecret: secretIdValue
    };
    callback(null, output);
  });
}

function fetchPosts(params, callback) {
  let totalPages = 1;
  let currentPage = 1;
  let output = [];
  async.whilst(
    () => currentPage <= totalPages,
    (done) => {
      const url = `${params.url}ghost/api/v0.1/posts/?limit=100&page=${currentPage}&client_id=${params.clientId}&client_secret=${params.clientSecret}`;
      request.get(url, (err, http, body) => {
        if (err) {
          return done(err);
        }
        try {
          body = JSON.parse(body);
        } catch (e) {
          return done('API Posts - Not valid JSON response', body);
        }
        const hasPosts = body && body.posts && body.posts.length > 0;
        const hasPages = body && body.meta && body.meta.pagination
                        && body.meta.pagination.pages;
        const valid = hasPosts && hasPages;
        if (!valid) {
          return done('API Posts - Not valid response', body);
        }
        totalPages = body.meta.pagination.pages;
        currentPage++;
        output = output.concat(body.posts);
        done();
      });
    }, (err) => {
      callback(err, output);
    }
  );
}

function fetchPages(params, callback) {
  let totalPages = 1;
  let currentPage = 1;
  let output = [];
  async.whilst(
    () => currentPage <= totalPages,
    (done) => {
      const url = `${params.url}ghost/api/v0.1/posts/?filter=page:true&limit=100&page=${currentPage}&client_id=${params.clientId}&client_secret=${params.clientSecret}`;
      request.get(url, (err, http, body) => {
        if (err) {
          return done(err);
        }
        try {
          body = JSON.parse(body);
        } catch (e) {
          return done('API Posts - Not valid JSON response', body);
        }
        const hasPosts = body && body.posts && body.posts.length > 0;
        const hasPages = body && body.meta && body.meta.pagination
                        && body.meta.pagination.pages;
        const valid = hasPosts && hasPages;
        if (!valid) {
          return done('API Posts - Not valid response', body);
        }
        totalPages = body.meta.pagination.pages;
        currentPage++;
        output = output.concat(body.posts);
        done();
      });
    }, (err) => {
      callback(err, output);
    }
  );
}

module.exports = {
  fetch(cb) {
    let config = null;
    try {
      config = require('../../config.production.json');
    } catch (err) {
      return cb(`Error reading config.production.json ${err}`);
    }
    if (!config) {
      return cb('Can not find config.production.json');
    }
    const url = config.url;

    async.waterfall([
      function(callback) {
        getCredentials(url, callback);
      },
      function(credentials, callback) {
        const params = credentials;
        params.url = url;
        async.parallel({
          posts(contentCb) {
            fetchPosts(params, contentCb);
          },
          pages(contentCb) {
            fetchPages(params, contentCb);
          }
        }, (err, out) => {
          callback(err, out.posts.concat(out.pages));
        });
      }
    ], cb);
  }
};
