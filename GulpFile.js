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
    gutil = require('gulp-util'),
    fs = require('fs'),
    request = require('request');
fractal.web.set('builder.dest', 'styles'); // destination for the static export

require('dotenv').config();

require('require-dir')('./gulp-src', { recurse: true });




function download(uri, filename, callback){
    request.head(uri, function(err, res, body){      
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

gulp.task('img-opt', function () {

    if (gutil.env.BRANCH === 'master') {
        return gulp.src('_site/images/**/')
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }]
            }))
            .pipe(gulp.dest('_site/images'))
    }
});




gulp.task('sass:watch', function () {
    gulp.watch(['scss/**/*.scss', 'scss/*.scss', 'styleguide/components/**/*.scss', 'styleguide/*.scss'], ['sass']);
});

gulp.task('fractal:start', function () {
    const server = fractal.web.server({
        sync: true
    });
    server.on('error', err => logger.error(err.message));
    return server.start().then(() => {
        logger.success(`Fractal server is now running at ${server.url}`);
    });
});

gulp.task('fractal:build', function () {
    const builder = fractal.web.builder();
    builder.on('progress', (completed, total) => logger.update(`Exported ${completed} of ${total} items`, 'info'));
    builder.on('error', err => logger.error(err.message));
    return builder.build().then(() => {
        logger.success('Fractal build completed!');
    });
});

gulp.task('build:jekyll', function () {
    var shellCommand = 'bundle exec jekyll build';

    return gulp.src('')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});


gulp.task('lambda:build', function () {
    var shellCommand = "netlify-lambda build lambda_build";

    return gulp.src('')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});




// For just working on styleguide and not running jekyll server
gulp.task('style:watch', function (callback) {
    runSequence('fractal:start', 'sass:watch', callback);
});

// For just building styleguide. 
// This is the build command for the style-guide branch deploy on netlify 
gulp.task('style:build', function (callback) {
    runSequence('sass', 'fractal:build', callback);
});

// Master branch deploy builder
gulp.task('build', function (callback) {
    runSequence('sass', 'status:get', 'image:get', 'build:jekyll', 'lambda:build', 'img-opt');
});
