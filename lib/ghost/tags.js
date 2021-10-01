const axios = require('axios');

function isBeingUsed(upload, tags) {
  const path = upload.path;
  const filename = path.substring(path.lastIndexOf('/') + 1);
  for (const tag of tags) {
    const inFeat = tag.feature_image && tag.feature_image.includes(filename);
    const isUsed = inFeat;
    if (isUsed) {
      return true;
    }
  }
  return false;
}

async function list(params) {
  const { url, contentAPIKey } = params;
  let totalPages = 1;
  let currentPage = 1;
  let output = [];
  do {
    const apiUrl = `${url}ghost/api/v3/content/tags/?limit=100&page=${currentPage}&fields=feature_image&key=${contentAPIKey}`;
    const body = await axios.get(apiUrl).then((res) => res.data);
    const hasPosts = body && body.tags && body.tags.length >= 0;
    const hasPages = body && body.meta && body.meta.pagination && body.meta.pagination.pages;
    const valid = hasPosts && hasPages;
    if (!valid) {
      throw Error(`Tags API - Not valid response: ${JSON.stringify(body)}`);
    }
    totalPages = body.meta.pagination.pages;
    currentPage += 1;
    output = output.concat(body.tags);
  } while (currentPage <= totalPages);
  return output;
}

module.exports = {
  isBeingUsed,
  list
};
