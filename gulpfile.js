'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var karma = require('karma');

var paths = {
  karma: __dirname + '/karma.conf.js'
};

gulp.task('browserify', function () {
  return browserify({
    entries: ['./index.js'],
    standalone: 'backend'
  })
  .bundle()
  .pipe(source('backend.js'))
  .pipe(gulp.dest('./'));
});

gulp.task('karma', function (done) {
  karma.server.start({
    configFile: paths.karma,
    singleRun: true
  }, done);
});