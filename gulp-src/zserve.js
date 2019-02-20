var project = require('./_project.js');
var gulp    = require('gulp');
var run = require('gulp-run');
var gutil = require('gulp-util');


gulp.task('serve:jekyll', function () {
    var shellCommand = "bundle exec jekyll serve";
    return gulp.src('*')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});

gulp.task('default', gulp.parallel('serve:jekyll', 'watch'));
