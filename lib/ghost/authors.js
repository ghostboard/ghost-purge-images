const axios = require('axios');

function isBeingUsed(upload, authors) {
  const path = upload.path;
  const filename = path.substring(path.lastIndexOf('/') + 1);
  for (const author of authors) {
    const inProfile = author.profile_image && author.profile_image.includes(filename);
    const inCover = author.cover_image && author.cover_image.includes(filename);
    const isUsed = !!(inProfile || inCover);
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
    const apiUrl = `${url}ghost/api/v3/content/authors/?limit=100&page=${currentPage}&fields=cover_image,profile_image&key=${contentAPIKey}`;
    const body = await axios.get(apiUrl).then((res) => res.data);
    const hasPosts = body && body.authors && body.authors.length >= 0;
    const hasPages = body && body.meta && body.meta.pagination && body.meta.pagination.pages;
    const valid = hasPosts && hasPages;
    if (!valid) {
      throw Error(`Authors API - Not valid response: ${JSON.stringify(body)}`);
    }
    totalPages = body.meta.pagination.pages;
    currentPage += 1;
    output = output.concat(body.authors);
  } while (currentPage <= totalPages);
  return output;
}

module.exports = {
  isBeingUsed,
  list
};
