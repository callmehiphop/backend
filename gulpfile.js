'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function () {
  return browserify({
    entries: ['./index.js'],
    standalone: 'backend'
  })
  .bundle()
  .pipe(source('backend.js'))
  .pipe(gulp.dest('./'));
});