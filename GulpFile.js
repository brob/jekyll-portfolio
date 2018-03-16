'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    run = require('gulp-run'),
    runSequence = require('run-sequence'),
    gutil = require('gulp-util');


// gulp.task('default', ['sass', 'sass:watch']);

gulp.task('img-opt', function() {
    return gulp.src('_site/images/**/')
      .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }]
        }))
       .pipe(gulp.dest('_site/images'))
});


gulp.task('sass', function() {
   return gulp.src('scss/**/*.scss')
       .pipe(sass().on('error', sass.logError))
       .pipe(autoprefixer({grid: false}))
       .pipe(cleanCSS())
       .pipe(gulp.dest('./'))
});


gulp.task('sass:watch', function () {
    gulp.watch(['scss/**/*.scss', 'scss/*.scss'], ['sass']);
});

gulp.task('build:jekyll', function() {
    var shellCommand = 'jekyll build';

    return gulp.src('')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});

gulp.task('serve:jekyll', function() {
    var shellCommand = "bundle exec jekyll serve";

    return gulp.src('')
    .pipe(run(shellCommand))
    .on('error', gutil.log);
});

gulp.task('default', function(callback) {
    runSequence('sass:watch', 'serve:jekyll', callback);
});

gulp.task('build', function(callback) {
    runSequence('sass', 'build:jekyll', 'img-opt');
});
