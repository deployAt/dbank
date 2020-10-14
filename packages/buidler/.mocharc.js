'use strict';
module.exports = {
  'allow-uncaught': true,
  diff: true,
  extension: ['js'],
  recursive: true,
  reporter: 'spec',
  slow: 75,
  spec: 'test/**/*.test.js',
  timeout: 20000,
  ui: 'bdd',
  watch: false,
  'watch-files': ['contracts/**/*.sol', 'test/**/*.js'],
};
