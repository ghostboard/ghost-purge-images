const async = require('async');
const ghost = require('./ghost');

module.exports = {
  filterUnused(params, callback) {
    const uploads = params.uploads;
    const stories = params.stories.list;
    const result = {
      totalSpace: 0,
      totalUploads: uploads.length,
      list: []
    };
    async.eachSeries(uploads, (upload, cb) => {
      const path = upload.path;
      let found = false;
      for (let i = 0, total = stories.length; !found && i < total; i++) {
        const story = stories[i];
        const inBody = story.html && story.html.includes(path);
        const inFeat = story.feature_image && story.feature_image.includes(path);
        const inOG = story.og_image && story.og_image.includes(path);
        const inTw = story.twitter_image && story.twitter_image.includes(path);
        const isLogo = params.stories.publicationLogo.includes(path);
        const isCover = params.stories.publicationCover.includes(path);
        const used = inBody || inFeat || inOG || inTw || isLogo || isCover;
        if (used) {
          found = true;
          // console.log('>> This file is used ', path);
        }
      }
      if (!found) {
        result.totalSpace += upload.size;
        result.list.push(upload);
      }
      cb();
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
      console.log('❔ Want to delete this files? Run `ghost-purge-images purge`');
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
