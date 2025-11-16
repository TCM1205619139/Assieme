'use strict';

const jsAppBridge = require('..');
const assert = require('assert').strict;

assert.strictEqual(jsAppBridge(), 'Hello from jsAppBridge');
console.info('jsAppBridge tests passed');
