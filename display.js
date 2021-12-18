const ghost = require('./lib/ghost');
const core = require('./lib/core');

async function run() {
  try {
    const startTime = Date.now();
    const [uploads, content] = await Promise.all([
      ghost.uploads.list(),
      ghost.content.fetch()
    ]);
    const input = {
      uploads,
      content
    };
    const unused = core.filterUnused(input);
    core.display(unused);
    console.log(`⏱  Completed in ${(Date.now()-startTime)/1000}s`);
    return process.exit(0);
  } catch (err) {
    console.log(`❌ Error: ${err}`);
  }
}

module.exports = {
  run
};
