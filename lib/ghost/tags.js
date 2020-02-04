const request = require('request');

function isBeingUsed(upload, tags) {
  const path = upload.path;
  for (const tag of tags) {
    const inFeat = tag.feature_image && tag.feature_image.includes(path);
    const isUsed = inFeat;
    if (isUsed) {
      return true;
    }
  }
  return false;
}

async function list(params) {
  let totalPages = 1;
  let currentPage = 1;
  let output = [];
  do {
    await new Promise((resolve, reject) => {
      const url = `${params.url}ghost/api/v3/content/tags/?limit=100&page=${currentPage}&fields=feature_image&key=${params.contentAPIKey}`;
      request.get(url, (err, http, body) => {
        if (err) {
          return reject(err);
        }
        try {
          body = JSON.parse(body);
        } catch (e) {
          return reject('API Tags - Not valid JSON response', body);
        }
        const hasPosts = body && body.tags && body.tags.length >= 0;
        const hasPages = body && body.meta && body.meta.pagination
          && body.meta.pagination.pages;
        const valid = hasPosts && hasPages;
        if (!valid) {
          return reject('API Tags - Not valid response', body);
        }
        totalPages = body.meta.pagination.pages;
        currentPage += 1;
        output = output.concat(body.tags);
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
