const ghost = require('./lib/ghost');
const core = require('./lib/core');

async function run() {
  try {
    const input = {
      uploads: await ghost.uploads.list(),
      content: await ghost.content.fetch()
    };
    const unused = core.filterUnused(input);
    await core.purge(unused);
    return process.exit(0);
  } catch (err) {
    console.log(`❌ Error: ${err}`);
  }
}

module.exports = {
  run
};
