const fs = require('fs');
const { promisify } = require('util');
const { resolve } = require('path');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

async function listFiles(dir) {
  let output = [];
  const subdirs = await readdir(dir);
  await Promise.all(subdirs.map(async(subdir) => {
    const path = resolve(dir, subdir);
    const pathStat = await stat(path);
    if (pathStat.isDirectory()) {
      const folderList = await listFiles(path);
      output = output.concat(folderList);
    } else {
      const item = {
        path,
        size: pathStat.size
      };
      output.push(item);
    }
  }));
  return output;
}

module.exports = {
  async list(path = 'content/images') {
    return listFiles(path);
  },
  async remove(file) {
    return unlink(file);
  }
};
