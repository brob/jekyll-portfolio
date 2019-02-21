var project = require('./_project.js');
var gulp    = require('gulp');
var run = require('gulp-run');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');


gulp.task('serve:jekyll', function () {
    var shellCommand = "bundle exec jekyll serve";
    return gulp.src('*')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});

gulp.task('browser-sync', function(done) {
    browserSync.init({
        server: {
            baseDir: "./_site"
        }
    });
    done();
});

gulp.task('default', gulp.series('watch','browser-sync'));
