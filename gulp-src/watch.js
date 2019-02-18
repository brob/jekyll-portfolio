var project = require('./_project.js');
var gulp    = require('gulp');


/*
  Watch folders for changes
*/
gulp.task("watch", function () {
    gulp.watch([
        'scss/**/*.scss', 
        'scss/*.scss', 
        'styleguide/components/**/*.scss', 
        'styleguide/*.scss'
        ], gulp.parallel('sass'));
});

