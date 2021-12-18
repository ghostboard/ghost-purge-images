const fs = require('fs');
const { promisify } = require('util');
const { resolve } = require('path');
const argv = require('minimist')(process.argv.slice(2));
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const DEFAULT_CONTENT_IMAGES_PATH = argv['images-path'] || argv.images_path || argv.IMAGES_PATH || 'content/images';
const DEFAULT_CONTENT_MEDIA_PATH = argv['media-path'] || argv.media_path || argv.MEDIA_PATH || 'content/media';

async function _listFiles(dir) {
  let output = [];
  const subdirs = await readdir(dir);
  const promises = subdirs.map(async (subdir) => {
    const path = resolve(dir, subdir);
    const pathStat = await stat(path);
    if (pathStat.isDirectory()) {
      const folderList = await _listFiles(path);
      output = output.concat(folderList);
    } else {
      const item = {
        path,
        size: pathStat.size
      };
      output.push(item);
    }
  });
  await Promise.all(promises);
  return output;
}

async function list(folders = [DEFAULT_CONTENT_IMAGES_PATH, DEFAULT_CONTENT_MEDIA_PATH]) {
  const promises = folders.map((folder) => _listFiles(folder));
  const output = await Promise.all(promises)
  return output.flat(1);
}

async function remove(file) {
  return unlink(file);
}

module.exports = {
  list,
  remove
};
