var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    pagespeed = require('psi'),
    reload = browserSync.reload,
    AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ],
    injectAssets = function (folder) {
        'use strict';

        var scripts = gulp.src(['client/' + folder + '/scripts/main.js'], {read: false}),
            styles = gulp.src(['client/' + folder + '/styles/styles.css'], {read: false});

        gulp.src('server/views/layout/foot.ejs')
            .pipe($.inject(scripts, {
                starttag: '<!-- inject:build:js -->',
                endtag: '<!-- end:inject:build:js -->',
                ignorePath: '/client'
            }))
            .pipe(gulp.dest('server/views/layout/'));

        gulp.src('server/views/layout/head.ejs')
            .pipe($.inject(styles, {
                starttag: '<!-- inject:build:css -->',
                endtag: '<!-- end:inject:build:css -->',
                ignorePath: '/client'
            }))
            .pipe(gulp.dest('server/views/layout/'));
    };

gulp.task('jshint', function () {
    'use strict';

    return gulp.src('client/app/scripts/**/*.js')
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize images
gulp.task('images', function () {
    'use strict';

    return gulp.src('client/app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('client/dist/images'))
        .pipe($.size({title: 'images'}));
});

// Copy all files at the root level (app)
gulp.task('copy', function () {
    'use strict';

    return gulp.src([
        'client/app/*'
    ], {
        dot: true
    })
    .pipe(gulp.dest('client/dist'))
    .pipe($.size({title: 'copy'}));
});

// Copy web fonts to dist
gulp.task('fonts', function () {
    'use strict';

    return gulp.src(['client/app/fonts/**'])
        .pipe(gulp.dest('client/dist/fonts'))
        .pipe($.size({title: 'fonts'}));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
    'use strict';

    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src([
        'client/app/styles/*.scss'
    ])
    .pipe($.sass({
        precision: 10,
        onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(gulp.dest('client/app/styles'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('client/dist/styles'))
    .pipe($.size({title: 'styles'}));
});

// Clean output directory
gulp.task('clean', del.bind(null, ['client/dist/*', '!client/dist/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['styles'], function () {
    'use strict';

    $.nodemon({
        script: 'index.js',
        ext: 'js ejs',
        watch: ['server/'],
        execMap: {
            js: 'node --harmony'
        }
    });

    browserSync({
        port: 3001,
        proxy: 'localhost:3000',
        notify: false,
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        // Customize the BrowserSync console logging prefix
        logPrefix: 'KWSK'
    });

    injectAssets('app');

    gulp.watch(['client/app/styles/**/*.{scss,css}'], ['styles', injectAssets.bind(this, 'app'), reload]);
    gulp.watch(['client/app/scripts/**/*.js'], ['jshint', injectAssets.bind(this, 'app')]);
    gulp.watch(['client/app/images/**/*'], [injectAssets.bind(this, 'app'), reload]);
});

// Build the output from the dist build
gulp.task('serve:dist', ['default'], function () {
    'use strict';

    injectAssets('dist');
});

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {
    'use strict';

    runSequence('styles', ['jshint', 'images', 'fonts', 'copy'], cb);
});

// Run PageSpeed Insights
gulp.task('pagespeed', function (cb) {
    'use strict';

    // Update the below URL to the public URL of your site
    pagespeed.output('example.com', {
        strategy: 'mobile',
        // By default we use the PageSpeed Insights free (no API key) tier.
        // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
        // key: 'YOUR_API_KEY'
    }, cb);
});
