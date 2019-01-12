const fs = require('fs');

const listDir = function(dir, done) {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = `${dir}/${file}`;
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          listDir(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          const output = {
            path: file,
            size: stat.size
          };
          results.push(output);
          next();
        }
      });
    }());
  });
};

module.exports = {
  list(cb) {
    listDir('content/images', cb);
  },
  remove(file, cb) {
    fs.unlink(file, cb);
  }
};
