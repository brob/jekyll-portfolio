var project = require('./_project.js');
var gulp    = require('gulp');
var sass    = require("gulp-sass");
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');




gulp.task('sass', function () {
    return gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ grid: false }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./styleguide/public/css/'))
        .pipe(gulp.dest('./'))
});
