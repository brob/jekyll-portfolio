var project = require('./_project.js');
var gulp    = require('gulp');
var run = require('gulp-run');
var gutil = require('gulp-util');
var cp = require('child_process');

gulp.task('build:jekyll', function (done) {
    return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });
});

gulp.task('lambda:build', function (done) {
    return cp.spawn("npx", ["netlify-lambda", "build", "lambda_build"], { stdio: "inherit" });
});


gulp.task('build', gulp.series(['status:get', 'sass'], 'build:jekyll', 'lambda:build', function(done) {
    done();
}));
