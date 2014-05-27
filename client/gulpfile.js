  var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
      sass = require('gulp-sass'),
 minifyCSS = require('gulp-minify-css'),
    prefix = require('gulp-autoprefixer'),
     karma = require('gulp-karma')
    notify = require('gulp-notify'),
   csscomb = require('gulp-csscomb');

/**
 *  Dev task - doesn't minify app files, includes dev libs
 */
gulp.task('default', ['concat-libs-js-dev', 'concat-app-js-dev', 'concat-css'], function () {
    gulp.src(['./js/partials/libs.js', './js/partials/app.js'])
        .pipe(concat('gallery-view.js'))
        .pipe(gulp.dest('./js/'));
});

/**
 *  Production task
 *  Omits dev libs, concats/minifies everything
 */
gulp.task('prod', ['concat-libs-js-prod', 'concat-app-js-prod', 'concat-css-prod'], function () {
    gulp.src(['./js/partials/libs.js', './js/partials/app.js'])
        .pipe(concat('gallery-view.js'))
        .pipe(gulp.dest('./js/'));
});

gulp.task('tests', function (cb) {
    var files = [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'app/*.js',
      'app/**/*.js ',
      'partials/*.html',
      'tests/*.js'
    ];

    return gulp.src(files)
        .pipe(karma({
            configFile: './tests/karma.config.js',
            action: 'run'
        }))
        .on('error', function (error) {
            throw error;
        });

    setTimeout(function () {
        cb(null);
    }, 200);

});

gulp.task('watch', function () {

    var jsWatch = gulp.watch('app/**/*.js', ['default']);
    jsWatch.on('change', function (event) {
        var file = event.path.match(/\w+\.js$/)[0];
        console.log('File ' + file + ' was ' + event.type + ', doing js stuff...');
    });

    var sassWatch = gulp.watch('./scss/**/*.scss', ['concat-css']);
    sassWatch.on('change', function (event) {
        var file = event.path.match(/\w+\.scss$/)[0];
        console.log('File ' + file + ' was ' + event.type + ', compiling sass...');
    });

});

/**
 *  Angular app files
 */
gulp.task('concat-app-js-dev', function (cb) {
    gulp.src(['./app/*.js', './app/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./js/partials/'));
    setTimeout(function () {
        cb(null);
    }, 200);
});
gulp.task('concat-app-js-prod', function (cb) {
    gulp.src(['./app/*.js', './app/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(uglify({mangle:true}))
        .pipe(gulp.dest('./js/partials/'));
    setTimeout(function () {
        cb(null);
    }, 200);
});

/**
 *  Library files
 */
gulp.task('concat-libs-js-dev', function (cb) {
    gulp.src([
            './bower_components/hammerjs/hammer.min.js',
            './bower_components/angular/angular.min.js',
            './bower_components/angular-ui-router/release/angular-ui-router.min.js',
            './bower_components/angular-mocks/angular-mocks.js', './js/partials/scripts.js'
    ]).pipe(concat('libs.js'))
    .pipe(gulp.dest('./js/partials/'));
    setTimeout(function () {
        cb(null);
    }, 200);
});
gulp.task('concat-libs-js-prod', function (cb) {
    gulp.src([
        './bower_components/hammerjs/hammer.min.js',
        './bower_components/angular/angular.min.js',
        './bower_components/angular-ui-router/release/angular-ui-router.min.js',
        './js/partials/scripts.js'
    ]).pipe(concat('libs.js'))
    .pipe(gulp.dest('./js/partials/'));
    setTimeout(function () {
        cb(null);
    }, 200);
});
/**
 *  SCSS files
 */
gulp.task('compile-sass', function (cb) {
    gulp.src(['./scss/common.scss', './scss/partials/*.scss',])
        .pipe(concat('compiled.scss'))
        .pipe(sass({
            onError: function(err) {
                return notify().write(err);
            }
        }))
        .pipe(prefix())
        .pipe(csscomb())
        .pipe(gulp.dest('./css/'));
    setTimeout(function () {
        cb(null);
    }, 200);
});
gulp.task('concat-css', ['compile-sass'], function () {
    gulp.src(['./css/normalize.min.css', './css/compiled.css'])
    .pipe(concat('gallery-view.css'))
    .pipe(gulp.dest('./css/'));
});
gulp.task('concat-css-prod', ['compile-sass'], function () {
    gulp.src(['./css/normalize.min.css', './css/compiled.css'])
    .pipe(concat('gallery-view.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./css/'));
});
