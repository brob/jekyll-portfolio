'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync');


gulp.task('default', ['sass', 'sass:watch']);

gulp.task('sass', function() {
   return gulp.src('scss/**/*.scss')
       .pipe(sass().on('error', sass.logError))
       .pipe(autoprefixer())
       .pipe(gulp.dest('./'))
});

gulp.task('sass:watch', function () {
    gulp.watch(['scss/**/*.scss', 'scss/*.scss'], ['sass']);
});
