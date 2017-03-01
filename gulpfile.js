var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var del = require('del');
var download = require("gulp-download");
var exec = require('child_process').exec;

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

gulp.task('make-big-list', function(cb) {
  exec('node ./bin/myBreweries.js ./data/geobeer.json ./node_modules/geobeer/breweries/ ./app/myBreweryList.geojson', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('make-my-list', function(cb) {
  exec('node ./bin/myBreweries.js ./data/geobeer.json ./node_modules/geobeer/breweries/ ./app/myBreweryList.geojson mine', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
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

gulp.task('build', ['clean:dist', 'make-big-list', 'graphics', 'data', 'fonts', 'useref']);

gulp.task('my-breweries', ['make-my-list', 'data']);
