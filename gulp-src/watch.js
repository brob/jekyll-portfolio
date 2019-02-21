var project = require('./_project.js');
var gulp    = require('gulp');



gulp.task('watch:styles', function(done) {
    gulp.watch([
    'scss/**/*.scss', 
    'scss/*.scss', 
    'styleguide/components/**/*.scss', 
    'styleguide/*.scss'
    ], gulp.parallel('sass'));
    done();
});

gulp.task('watch:site', function(done) {
  gulp.watch('site-src', gulp.series('build:jekyll'));
  done();
});

/*
  Watch folders for changes
*/
gulp.task("watch", gulp.parallel('watch:styles', 'watch:site'));

