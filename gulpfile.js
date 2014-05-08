var gulp = require('gulp'),
  sass = require('gulp-sass'),
  coffee = require('gulp-coffee'),
  coffeelint = require('gulp-coffeelint'),
  jade = require('gulp-jade'),
  liveReloadServer = require('tiny-lr'),
  livereload = require('gulp-livereload'),
  gutil = require('gulp-util'),
  ejs = require('gulp-ejs'),
  gulpif = require('gulp-if'),
  concat = require('gulp-concat'),
  express = require('express');

var lr = liveReloadServer();

gulp.task('scripts', function() {
  return gulp.src([
      'src/bower_components/jquery/dist/jquery.min.js',
      'src/bower_components/foundation/js/foundation.min.js',
      'src/coffee/**/*.coffee'
    ])
    .pipe(gulpif(/[.]coffee$/, coffeelint({
        "indentation": {
            "name": "indentation",
            "value": 4,
            "level": "error"
        }
    })))
    .pipe(gulpif(/[.]coffee$/, coffeelint.reporter()))
    .pipe(gulpif(/[.]coffee$/, coffee({bare: true}).on('error', gutil.log)))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(livereload(lr));
});

gulp.task('styles', function() {
  return gulp.src(['src/sass/**/*.scss'])
    .pipe(sass({errLogToConsole: true}).on('error', function(err){
        gutil.log(gutil.colors.red('Error in SASS syntax'), err);
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(livereload(lr));
});

gulp.task('html', function() {
  var companies = require('./src/data/companies').sort(function(a, b) {
    if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
    if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
    return 0;
  });

  return gulp.src(['src/html/index.html'])
    .pipe(ejs({companies: companies}))
    .pipe(gulp.dest('.'))
    .pipe(livereload(lr));
})

function startExpress() {
  var app = express();
  app.use(express.static(__dirname));
  app.listen(4000);
}

function startLiveReload() {
  lr.listen(35729);
}

gulp.task('default', ['scripts', 'styles', 'html'], function() {
  gulp.watch('src/coffee/**', ['scripts']);
  gulp.watch('src/sass/**', ['styles']);
  gulp.watch(['src/html/**', 'src/data/**'], ['html']);

  startExpress();
  startLiveReload();
});