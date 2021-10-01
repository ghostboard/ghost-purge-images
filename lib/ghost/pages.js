const axios = require('axios');
const posts = require('./posts.js');

function isBeingUsed(upload, pages) {
  // Pages have same properties as posts
  // Then use the same function
  // Doc: https://docs.ghost.org/api/content/#pages
  return posts.isBeingUsed(upload, pages);
}

async function list(params) {
  const { url, authToken } = params;
  let totalPages = 1;
  let currentPage = 1;
  let output = [];
  do {
    const apiUrl = `${url}ghost/api/v2/admin/pages/?limit=100&page=${currentPage}&formats=html,mobiledoc`;
    const body = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Ghost ${authToken}`
      }
    }).then((res) => res.data);
    const hasPosts = body && body.pages && body.pages.length >= 0;
    const hasPages = body && body.meta && body.meta.pagination && body.meta.pagination.pages;
    const valid = hasPosts && hasPages;
    if (!valid) {
      throw Error(`Pages API - Not valid response: ${JSON.stringify(body)}`);
    }
    totalPages = body.meta.pagination.pages;
    currentPage += 1;
    output = output.concat(body.pages);
  } while (currentPage <= totalPages);
  return output;
}

module.exports = {
  isBeingUsed,
  list
};
