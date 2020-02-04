const request = require('request');
const posts = require('./posts.js');

function isBeingUsed(upload, pages) {
  // Pages have same properties as posts
  // Then use the same function
  // Doc: https://docs.ghost.org/api/content/#pages
  return posts.isBeingUsed(upload, pages);
}

async function list(params) {
  let totalPages = 1;
  let currentPage = 1;
  let output = [];
  do {
    await new Promise((resolve, reject) => {
      const url = `${params.url}ghost/api/v3/content/pages/?limit=100&page=${currentPage}&key=${params.contentAPIKey}`;
      request.get(url, (err, http, body) => {
        if (err) {
          return reject(err);
        }
        try {
          body = JSON.parse(body);
        } catch (e) {
          return reject('API Pages - Not valid JSON response', body);
        }
        const hasPosts = body && body.pages && body.pages.length >= 0;
        const hasPages = body && body.meta && body.meta.pagination
          && body.meta.pagination.pages;
        const valid = hasPosts && hasPages;
        if (!valid) {
          return reject('API Pages - Not valid response', body);
        }
        totalPages = body.meta.pagination.pages;
        currentPage += 1;
        output = output.concat(body.pages);
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
