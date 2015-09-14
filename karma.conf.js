module.exports = function (karma) {

  'use strict';

  karma.set({

    singleRun: false,
    autoWatch: false,
    logLevel: karma.LOG_ERROR,

    reporters: ['spec'],
    browsers: [process.env.TRAVIS ? 'Firefox' : 'PhantomJS'],
    plugins: ['karma-*'],

    frameworks: [
      'mocha',
      'chai',
      'browserify'
    ],

    files: [
      'node_modules/jquery/dist/jquery.js',
      'test/spec/*.spec.js',
      {
        pattern: 'test/fixtures/*',
        included: false,
        served: true
      }
    ],

    preprocessors: {
      'test/spec/*.spec.js': ['browserify']
    },

    proxies: {
      '/fixtures': '/base/test/fixtures'
    },

    browserify: {
      transform: ['brfs']
    }

  });

};