const request = require('request');

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
  let totalPages = 1;
  let currentPage = 1;
  let output = [];
  do {
    const url = `${params.url}ghost/api/v3/content/authors/?limit=100&page=${currentPage}&fields=cover_image,profile_image&key=${params.contentAPIKey}`;
    await new Promise((resolve, reject) => {
      request.get(url, (err, http, body) => {
        if (err) {
          return reject(err);
        }
        try {
          body = JSON.parse(body);
        } catch (e) {
          return reject('API Authors - Not valid JSON response ' + body);
        }
        const hasPosts = body && body.authors && body.authors.length >= 0;
        const hasPages = body && body.meta && body.meta.pagination
          && body.meta.pagination.pages;
        const valid = hasPosts && hasPages;
        if (!valid) {
          return reject('API Authors - Not valid response ' + body);
        }
        totalPages = body.meta.pagination.pages;
        currentPage += 1;
        output = output.concat(body.authors);
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
