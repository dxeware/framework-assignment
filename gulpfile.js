"use strict";

// get our packages
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

// Files we're concerned about
var files = ['./**/*.js', '!./node_modules/**'];
var testFiles = ['./test/*.js'];

// task to run jshint
gulp.task('lint', function() {
  return gulp.src(files)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', { verbose: true }));
});

// task to run our tests
gulp.task('test', function() {
  return gulp.src(testFiles)
    .pipe(mocha())
    .on('end', function() {
      process.exit();
    });
});

// Set up which files to watch and what tasks
// to run on file change
gulp.task('watch', function() {
  gulp.watch(files, ['lint']);
  gulp.watch(files, ['test']);
});

gulp.task('default', ['lint', 'test']);
