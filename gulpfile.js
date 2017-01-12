var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var del = require('del');


gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src([
      'node_modules/font-awesome/fonts/fontawesome-webfont.*'
    ])
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});
