var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var del = require('del');
var download = require("gulp-download");

var url = 'https://raw.githubusercontent.com/devNoiseConsulting/geoBeer/master/myBreweryList.geojson';

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

gulp.task('images', function() {
  return gulp.src([
      'app/images/**'
    ])
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('favicon', function() {
  return gulp.src([
      'app/favicon.ico'
    ])
    .pipe(gulp.dest('dist/'));
});

gulp.task('graphics', ['favicon', 'images']);

gulp.task('getList', function() {
  return download(url)
  	.pipe(gulp.dest("app/"));
});

gulp.task('data', function() {
  return gulp.src([
      'app/*json'
    ])
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('build', ['clean:dist', 'getList', 'graphics', 'data', 'fonts', 'useref']);
