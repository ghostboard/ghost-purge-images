const async = require('async');
const ghost = require('./lib/ghost');
const core = require('./lib/core');

module.exports = {
  run() {
    async.waterfall([
      function(callback) {
        async.parallel({
          uploads(cb) {
            ghost.uploads.list(cb);
          },
          stories(cb) {
            ghost.stories.fetch(cb);
          }
        }, callback);
      },
      function(out, callback) {
        core.filterUnused(out, callback);
      },
      function(out, callback) {
        core.display(out, callback);
      }
    ], (err, out) => {
      if (err) {
        console.log(`❌ Error: ${err}`);
      }
      return process.exit(-1);
    });
  }
};
