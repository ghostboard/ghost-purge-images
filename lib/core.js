const async = require('async');
const ghost = require('./ghost');

module.exports = {
  filterUnused(params, callback) {
    const uploads = params.uploads;
    const content = params.content;
    const result = {
      totalSpace: 0,
      totalUploads: uploads.length,
      list: []
    };
    async.eachSeries(uploads, (upload, cb) => {
      // For each upload, check if its being used in any Resource
      async.parallel({
        authors(usedCb) {
          ghost.authors.isBeingUsed(upload, content.authors, usedCb);
        },
        pages(usedCb) {
          ghost.pages.isBeingUsed(upload, content.pages, usedCb);
        },
        posts(usedCb) {
          ghost.posts.isBeingUsed(upload, content.posts, usedCb);
        },
        settings(usedCb) {
          ghost.settings.isBeingUsed(upload, content.settings, usedCb);
        },
        tags(usedCb) {
          ghost.tags.isBeingUsed(upload, content.tags, usedCb);
        }
      }, (err, out) => {
        const used = out.authors || out.pages || out.posts || out.settings || out.tags;
        if (!used) {
          result.totalSpace += upload.size;
          result.list.push(upload);
        }
        cb();
      });
    }, (err) => {
      callback(err, result);
    });
  },
  display(result, callback) {
    console.clear();
    const hasUnused = result.list.length === 0;
    if (hasUnused) {
      console.log('Completed but nothing to do here...');
      console.log('Congrats, all images are being used 👍');
      return callback();
    }
    console.log('👇 Unused images that can be removed:');
    async.eachSeries(result.list, (item, eachCb) => {
      console.log(`- ${item.path} (${(item.size / 1000000).toFixed(2)} MB)`);
      eachCb();
    }, (err) => {
      if (err) {
        return callback(err);
      }
      console.log('');
      console.log('📊 Summary:');
      console.log(`- ${result.list.length} files of ${result.totalUploads} uploaded images (${(result.list.length * 100 / result.totalUploads).toFixed(2)}%)`);
      console.log(`- Total space: ${(result.totalSpace / 1000000).toFixed(2)}MB`);
      console.log('');
      console.log('❔ Want to delete this files? Run `ghost-purge-images purge key=YOUR_KEY`');
      console.log('🎁 Open source tool by David Burgos from https://ghostboard.io');
      callback();
    });
  },
  purge(result, callback) {
    console.clear();
    const output = {
      space: 0,
      files: 0
    };
    const hasUnused = result.list.length === 0;
    if (hasUnused) {
      console.log('Completed but nothing to do here...');
      console.log('Congrats, all images are being used 👍');
      return callback();
    }
    console.log('👇 Starting to delete unused images:');
    async.eachSeries(result.list, (item, eachCb) => {
      ghost.uploads.remove(item.path, (err) => {
        if (err) {
          console.log(`❌ ${item.path}`);
          console.log(` Error:${err}`);
        } else {
          console.log(`✅ ${item.path}`);
          output.files += 1;
          output.space += item.size;
        }
        eachCb();
      });
    }, (err) => {
      if (err) {
        return callback(err);
      }
      console.log('');
      console.log('📊 Summary:');
      console.log(`- ${output.files} files removed`);
      console.log(`- Saved space: ${(output.space / 1000000).toFixed(2)}MB`);
      console.log('');
      console.log('🎁 Open source tool by David Burgos from https://ghostboard.io');
      callback();
    });
  }
};
