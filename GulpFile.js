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



function download(uri, filename, callback){
    request.head(uri, function(err, res, body){      
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

function cleanFile(filePath, callback) {
    fs.truncate(filePath, 0, callback);
}

function getId(imageUrl) {
    if (imageUrl.endsWith('.jpg')) {
        // protects against imgur URL changes from 'app' source
        let idSplit = imageUrl.split('.j');
        imageUrl = idSplit[0];
    }
    let imgUrlSplit = imageUrl.split('/');
    let imgId = imgUrlSplit[imgUrlSplit.length - 1];

    return imgId;
}

function buildStatuses(body) {
    let data = body.data;
    let imgId = getId(data.imgUrl);

    const status = {
        status: data.doing,
        imgUrl: data.imgUrl,
        localUrl: `/images/statusImages/${imgId}.jpg`,
        date: body.created_at
    };
    return status;
}


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


gulp.task('image:get', function() {
    function imageNeeds() {
        // Creates array of all image IDs in JSON file
        let idList = fs.readFileSync('_data/statuses.json', 'utf8', function(err, contents) {
            return statuses;
        });
        let jsonEncoded = JSON.parse(idList);
        const statusImageIds = jsonEncoded.map(status => getId(status.imgUrl));
        return statusImageIds;
    } 
    function currentlyDownloaded() {
        // Creates array of images currently in the project
        const files = fs.readdirSync('./images/statusImages', (err, files) => {
            return files;        
        });
        const imageIds = files.map(imageUrl => getId(imageUrl));
        return imageIds;
    }

    const imageIdList = imageNeeds();
    const downloadedIdList = currentlyDownloaded();
    console.log(imageIdList, downloadedIdList);
    // Filters IDs to find images we need to download
    let needToDownload = imageIdList.filter(e => ! downloadedIdList.includes(e));

    needToDownload.forEach(fileId => {
        let url = `https://imgur.com/download/${fileId}`;
        let fileName = `./images/statusImages/${fileId}.jpg`
        download(url, fileName, function() {
            console.log(`Downloaded ${url}`);
        })
    });
});

gulp.task('status:get', function () {
    // URL for data store
    let url = `https://api.netlify.com/api/v1/forms/${process.env.STATUS_FORM_ID}/submissions/?access_token=${process.env.API_AUTH}`;
    let statusFile = `./_data/statuses.json`;

    cleanFile(statusFile, function() {
        // Erases JSON file
        console.log(`${statusFile} cleaned`);
        request(url, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                let bodyArray = JSON.parse(body);
                let statuses = bodyArray.map(buildStatuses);

                // Write the status to a data file
                fs.writeFileSync(statusFile, JSON.stringify(statuses, null, 2), function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Status data saved.");
                    }
                });
                console.log(`${statusFile} rebuilt from data`);
    
            } else {
                console.log("Couldn't get statuses from Netlify");
            }
        });
    });
    
});
gulp.task('default', function (callback) {
    runSequence('sass:watch', 'fractal:start', 'status:get', 'image:get', 'serve:jekyll', callback);
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
