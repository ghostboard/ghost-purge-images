#!/usr/bin/env node

process.title = 'ghost-purge-images';

const command = process.argv.slice(2);
const display = require('../display.js');
const purge = require('../purge.js');

switch (command) {
  case 'purge':
    purge.run();
    break;
  case 'display':
    display.run();
    break;
  default:
    console.log('Please provide a command, check the docs');
    process.exit(1);
    break;
}
