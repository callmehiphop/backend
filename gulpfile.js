'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var karma = require('karma');
var jshint = require('gulp-jshint');

var paths = {
  scripts: ['./index.js', './lib/*.js', '!./lib/lodash.custom.js'],
  tests: ['./test/spec/*.spec.js'],
  karma: __dirname + '/karma.conf.js'
};

gulp.task('browserify', ['test'], function () {
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

gulp.task('jshint', function () {
  return gulp.src(paths.scripts.concat(paths.tests))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['jshint', 'karma']);
gulp.task('default', ['browserify']);
