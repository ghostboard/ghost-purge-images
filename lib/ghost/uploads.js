const fs = require('fs');
const { promisify } = require('util');
const { resolve } = require('path');
const argv = require('minimist')(process.argv.slice(2));
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const DEFAULT_CONTENT_IMAGES_PATH = argv['images-path'] || argv.images_path || argv.IMAGES_PATH || 'content/images';
const DEFAULT_CONTENT_MEDIA_PATH = argv['media-path'] || argv.media_path || argv.MEDIA_PATH || 'content/media';
const EXCLUDE_EXTENSION = argv['exclude-ext'] || argv.exclude_ext || argv.EXCLUDE_EXT || [];

async function _listFiles(dir, excludeExtensions = []) {
  let output = [];
  const subdirs = await readdir(dir);
  const promises = subdirs.map(async (subdir) => {
    const path = resolve(dir, subdir);
    const pathStat = await stat(path);
    if (pathStat.isDirectory()) {
			const isImageSizes = path.includes('/images/size/');
			if (!isImageSizes) {
				const folderList = await _listFiles(path, excludeExtensions);
				output = output.concat(folderList);
			}
    } else {
	    const shouldExclude = excludeExtensions.some((extension) => {
		    return path.endsWith(`.${extension}`);
	    });
	    if (!shouldExclude) {
		    const item = {
			    path,
			    size: pathStat.size
		    };
		    output.push(item);
	    }
    }
  });
  await Promise.all(promises);
  return output;
}

async function list(folders = [DEFAULT_CONTENT_IMAGES_PATH, DEFAULT_CONTENT_MEDIA_PATH], excludeExtensions = EXCLUDE_EXTENSION) {
  const excludedExtensions = typeof excludeExtensions === 'string' ? excludeExtensions.split(',') : excludeExtensions;
	const promises = folders.map((folder) => _listFiles(folder, excludedExtensions));
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
