const request = require('request');

function isBeingUsed(upload, posts) {
  const path = upload.path;
  for (const post of posts) {
    const inBody = post.html && post.html.includes(path);
    const inFeat = post.feature_image && post.feature_image.includes(path);
    const inOG = post.og_image && post.og_image.includes(path);
    const inTw = post.twitter_image && post.twitter_image.includes(path);
    const isUsed = inBody || inFeat || inOG || inTw;
    if (isUsed) {
      return true;
    }
  }
  return false
}

async function list(params) {
  let totalPages = 1;
  let currentPage = 1;
  let output = [];
  do {
    await new Promise((resolve, reject) => {
      const requestParams = {
        method: 'GET',
        headers: {
          Authorization: `Ghost ${params.authToken}`
        },
        url: `${params.url}ghost/api/v2/admin/posts/?limit=100&page=${currentPage}&formats=html,mobiledoc`
      };
      request(requestParams, (err, http, body) => {
        if (err) {
          return reject(err);
        }
        try {
          body = JSON.parse(body);
        } catch (e) {
          return reject('API Posts - Not valid JSON response', body);
        }
        const hasPosts = body && body.posts && body.posts.length >= 0;
        const hasPages = body && body.meta && body.meta.pagination
          && body.meta.pagination.pages;
        const valid = hasPosts && hasPages;
        if (!valid) {
          return reject('API Posts - Not valid response', body);
        }
        totalPages = body.meta.pagination.pages;
        currentPage += 1;
        output = output.concat(body.posts);
        resolve();
      });
    });
  } while (currentPage <= totalPages);
  return output;
}

module.exports = {
  isBeingUsed,
  list
};
