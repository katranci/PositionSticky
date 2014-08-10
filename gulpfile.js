var gulp    = require('gulp'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglify'),
    jshint  = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    jsdoc   = require('gulp-jsdoc'),
    karma   = require('gulp-karma'),
    rename  = require('gulp-rename'),
    webpack = require('gulp-webpack');


var testFiles = [
  'test/*.spec.js'
];


gulp.task('default', ['test-local', 'lint', 'build', 'jsdoc']);


gulp.task('test-local', function() {
  return gulp.src(testFiles)
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'run'
      }))
      .on('error', function(err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });
});


gulp.task('test-sauce', function() {
  return gulp.src(testFiles)
      .pipe(karma({
        configFile: 'karma-ci.conf.js',
        action: 'run'
      }));
});


gulp.task('build', function() {
  return gulp.src('./src/PositionSticky.js')
      .pipe(webpack({
        output: {
          library: 'PositionSticky',
          libraryTarget: 'umd'
        }
      }))
      .pipe(rename('PositionSticky.js'))
      .pipe(gulp.dest('dist'))
      .pipe(uglify())
      .pipe(rename('PositionSticky.min.js'))
      .pipe(gulp.dest('dist'));
});


gulp.task('jsdoc', function() {
  return gulp.src('./src/*.js')
      .pipe(jsdoc.parser({}))
      .pipe(jsdoc.generator('./docs', {}, {
        showPrivate: true
      }));
});


gulp.task('lint', function() {
  return gulp.src('./src/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});