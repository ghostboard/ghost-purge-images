#!/usr/bin/env node

process.title = 'ghost-purge-images';

const argv = process.argv.slice(2);
const display = require('../display.js');
const purge = require('../purge.js');

const hasCommand = argv && argv.length > 0;
if (!hasCommand) {
  console.log('Please provide a command, check the docs');
  process.exit(1);
}
const command = argv[0];

switch (command) {
  case 'purge':
    purge.run();
    break;
  case 'display':
    display.run();
    break;
  default:
    console.log(`Command '${command}' not found, check the docs and try again`);
    process.exit(1);
    break;
}
