const axios = require('axios');
const isInCard = require('./isInCard');

function isBeingUsed(upload, posts) {
  const path = upload.path;
  const contentFolderIndex = path.indexOf('/content/');
  const pathFile = path.substring(contentFolderIndex);
  for (const post of posts) {
    const inFeat = post.feature_image && post.feature_image.includes(pathFile);
    const inOG = post.og_image && post.og_image.includes(pathFile);
    const inTw = post.twitter_image && post.twitter_image.includes(pathFile);
    const isUsed = inFeat || inOG || inTw;
    if (isUsed) {
      return true;
    }
    const inAnyCard = isInCard(pathFile, post.mobiledoc);
    if (inAnyCard) {
      return true;
    }
    const inBody = post.html && post.html.includes(pathFile);
    if (inBody) {
      return true;
    }
  }
  return false;
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
