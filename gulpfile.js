var gulp        = require('gulp'),
    bower       = require('gulp-bower'),
    del         = require('del'),
    runSequence = require('run-sequence');

gulp.task('default', function(callback) {
  runSequence('clean', 'bower', 'copy', 'clean-bower-dir', callback);
});

// Remove PositionSticky bower package directories
gulp.task('clean', del.bind(null, ['demos', 'dist', 'docs']));

// Install PositionSticky through bower
gulp.task('bower', function() { return bower(); });

// Copy files from bower installation directory to the root directory
gulp.task('copy', function() {
  return gulp.src([
    './bower_components/PositionSticky/**/*',
    '!./bower_components/PositionSticky/bower.json',
    '!./bower_components/PositionSticky/.bower.json'
  ]).pipe(gulp.dest('./'))
});

// Remove bower installation directory
gulp.task('clean-bower-dir', del.bind(null, 'bower_components'));