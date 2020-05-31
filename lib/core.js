/* eslint-disable no-await-in-loop */
const ghost = require('./ghost');

function filterUnused(params) {
  const uploads = params.uploads;
  const content = params.content;
  const result = {
    totalSpace: 0,
    totalUploads: uploads.length,
    list: []
  };
  console.log('>> uploads', uploads);
  console.log('>> content', content);
  for (const upload of uploads) {
    const out = {
      authors: ghost.authors.isBeingUsed(upload, content.authors),
      pages: ghost.pages.isBeingUsed(upload, content.pages),
      posts: ghost.posts.isBeingUsed(upload, content.posts),
      settings: ghost.settings.isBeingUsed(upload, content.settings),
      tags: ghost.tags.isBeingUsed(upload, content.tags)
    };
    const used = out.authors || out.pages || out.posts || out.settings || out.tags;
    console.log('>> used', used, 'debug', out.authors, out.pages, out.posts, out.settings, out.tags, upload)
    if (!used) {
      result.totalSpace += upload.size;
      result.list.push(upload);
    }
  }
  return result;
}

function display(result) {
  console.clear();
  const hasUnused = result.list.length === 0;
  if (hasUnused) {
    console.log('Completed but nothing to do here...');
    console.log('Congrats, all images are being used 👍');
    return;
  }
  console.log('👇 Unused images that can be removed:');

  result.list.forEach((item) => {
    console.log(`- ${item.path} (${(item.size / 1000000).toFixed(2)} MB)`);
  });
  console.log('');
  console.log('📊 Summary:');
  console.log(`- ${result.list.length} files of ${result.totalUploads} uploaded images (${(result.list.length * 100 / result.totalUploads).toFixed(2)}%)`);
  console.log(`- Total space: ${(result.totalSpace / 1000000).toFixed(2)}MB`);
  console.log('');
  console.log('❔ Want to delete this files? Run `ghost-purge-images purge key=YOUR_KEY`');
  console.log('🎁 Open source tool by David Burgos from https://ghostboard.io');
  return;
}

async function purge(result) {
  console.clear();
  const output = {
    space: 0,
    files: 0
  };
  const hasUnused = result.list.length === 0;
  if (hasUnused) {
    console.log('Completed but nothing to do here...');
    console.log('Congrats, all images are being used 👍');
    return;
  }
  console.log('👇 Starting to delete unused images:');
  for (const item of result.list) {
    try {
      await ghost.uploads.remove(item.path);
      output.files += 1;
      output.space += item.size;
      console.log(`✅ ${item.path}`);
    } catch (err) {
      console.log(`❌ ${item.path}`);
      console.log(` Error:${err}`);
    }
  }
  console.log('');
  console.log('📊 Summary:');
  console.log(`- ${output.files} files removed`);
  console.log(`- Saved space: ${(output.space / 1000000).toFixed(2)}MB`);
  console.log('');
  console.log('🎁 Open source tool by David Burgos from https://ghostboard.io');
  return;
}

module.exports = {
  filterUnused,
  display,
  purge
};
