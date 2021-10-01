const axios = require('axios');

function isBeingUsed(upload, posts) {
  const path = upload.path;
  const filename = path.substring(path.lastIndexOf('/') + 1);
  for (const post of posts) {
    const inBody = post.html && post.html.includes(filename);
    const inFeat = post.feature_image && post.feature_image.includes(filename);
    const inOG = post.og_image && post.og_image.includes(filename);
    const inTw = post.twitter_image && post.twitter_image.includes(filename);
    const isUsed = inBody || inFeat || inOG || inTw;
    if (isUsed) {
      return true;
    }
  }
  return false
}

async function list(params) {
  const { url, authToken } = params;
  let totalPages = 1;
  let currentPage = 1;
  let output = [];
  do {
    const apiUrl = `${url}ghost/api/v2/admin/posts/?limit=100&page=${currentPage}&formats=html,mobiledoc`;
    const body = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Ghost ${authToken}`
      }
    }).then((res) => res.data);
    const hasPosts = body && body.posts && body.posts.length >= 0;
    const hasPages = body && body.meta && body.meta.pagination && body.meta.pagination.pages;
    const valid = hasPosts && hasPages;
    if (!valid) {
      throw Error(`Posts API - Not valid response: ${JSON.stringify(body)}`);
    }
    totalPages = body.meta.pagination.pages;
    currentPage += 1;
    output = output.concat(body.posts);
  } while (currentPage <= totalPages);
  return output;
}

module.exports = {
  isBeingUsed,
  list
};
