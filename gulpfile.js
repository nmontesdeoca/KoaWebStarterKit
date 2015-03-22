var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('serve', function () {
    'use strict';

    nodemon({
        script: 'index.js',
        execMap: {
            js: 'node --harmony'
        }
    });
});

gulp.task('default', ['serve']);
