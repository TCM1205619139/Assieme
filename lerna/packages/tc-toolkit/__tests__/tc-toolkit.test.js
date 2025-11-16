'use strict';

const tcToolkit = require('..');
const assert = require('assert').strict;

assert.strictEqual(tcToolkit(), 'Hello from tcToolkit');
console.info('tcToolkit tests passed');
