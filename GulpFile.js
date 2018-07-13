'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    fractal = require('./styleguide/fractal.js'),
    logger = fractal.cli.console,
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    run = require('gulp-run'),
    runSequence = require('run-sequence'),
    gutil = require('gulp-util');


// gulp.task('default', ['sass', 'sass:watch']);

gulp.task('img-opt', function() {

    if (gutil.env.BRANCH === 'master') {
        return gulp.src('_site/images/**/')
        .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }]
            }))
        .pipe(gulp.dest('_site/images'))
    }
});


gulp.task('sass', function() {
   return gulp.src('scss/**/*.scss')
       .pipe(sass().on('error', sass.logError))
       .pipe(autoprefixer({grid: false}))
       .pipe(cleanCSS())
       .pipe(gulp.dest('./')
       .pipe(gulp.dest('./styleguide/public/css/'))
    )
});


gulp.task('sass:watch', function () {
    gulp.watch(['scss/**/*.scss', 'scss/*.scss', 'styleguide/components/**/*.scss','styleguide/*.scss'], ['sass']);
});

gulp.task('fractal:start', function(){
    const server = fractal.web.server({
        sync: true
    });
    server.on('error', err => logger.error(err.message));
    return server.start().then(() => {
        logger.success(`Fractal server is now running at ${server.url}`);
    });
});

gulp.task('build:jekyll', function() {
    var shellCommand = 'bundle exec jekyll build';

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

gulp.task('style', function(callback) {
    runSequence('fractal:start', 'sass:watch', callback);
});

gulp.task('build', function(callback) {
    runSequence('sass', 'build:jekyll', 'img-opt');
});
