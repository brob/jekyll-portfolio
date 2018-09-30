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
    fs = require('file-system'),
    request = require('request');
fractal.web.set('builder.dest', 'styles'); // destination for the static export

require('dotenv').config();

var buildSrc = "./";

// gulp.task('default', ['sass', 'sass:watch']);

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


gulp.task('sass', function () {
    return gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ grid: false }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./styleguide/public/css/'))
        .pipe(gulp.dest('./'))
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

gulp.task('serve:jekyll', function () {
    var shellCommand = "bundle exec jekyll serve";

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

gulp.task('status:get', function () {
    var url = `https://api.netlify.com/api/v1/forms/${process.env.APPROVED_COMMENTS_FORM_ID}/submissions/?access_token=${process.env.API_AUTH}`;
    request(url, function (err, response, body) {
        if (!err && response.statusCode === 200) {
            var body = JSON.parse(body);
            var statuses = [];
            // massage the data into the shape we want,
            for (var item in body) {
                var data = body[item].data;
                var status = {
                    status: data.doing,
                    imgUrl: data.imgUrl,
                    date: body[item].created_at
                };

                statuses.push(status);

            }

            // write our data to a file where our site generator can get it.
            fs.writeFile(buildSrc + "/_data/statuses.json", JSON.stringify(statuses, null, 2), function (err) {
                if (err) {
                    console.log(err);
                    //   done();
                } else {
                    console.log("Comments data saved.");
                    //   done();
                }
            });

        } else {
            console.log("Couldn't get comments from Netlify");
            //   exit();
        }
    });
});

gulp.task('default', function (callback) {
    runSequence('sass:watch', 'fractal:start', 'status:get', 'serve:jekyll', callback);
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
    runSequence('sass', 'status:get', 'build:jekyll', 'lambda:build', 'img-opt');
});
