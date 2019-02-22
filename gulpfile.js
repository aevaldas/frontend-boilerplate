// Gulp loader

const {
    src,
    dest,
    task,
    watch,
    series,
    parallel
} = require('gulp');

// --------------------------------------------
// Dependencies
// --------------------------------------------

// CSS / SASS plugins
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let minifycss = require('gulp-clean-css');

// JSS / plugins
let uglify = require('gulp-uglify');

// Utility plugins
let concat = require('gulp-concat');
let del = require('del');
let plumber = require('gulp-plumber');
let sourcemaps = require('gulp-sourcemaps');
let rename = require('gulp-rename');

// Browser plugins
let browserSync = require('browser-sync').create();

// Images plugins
let images = require('gulp-imagemin');


// Project Variables

let styleSrc = 'src/sass/**/*.sass';
let styleDest = 'build/assets/css/';

let vendorSrc = 'src/js/vendors/*.js';
let vendorDest = 'build/assets/js/';

let scriptSrc = 'src/js/*.js';
let scriptDest = 'build/assets/js/';

let htmlDest = 'build/';


// --------------------------------------------
// Stand Alone Tasks
// --------------------------------------------


// Compiles SASS files
function css(done) {
    src(styleSrc)
        .pipe(plumber())
        .pipe(sass({
            style: 'compressed'
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))

        .pipe(dest(styleDest));
    done();
};


// Images
function img(done) {
    src('src/img/*')
        .pipe(images())
        .pipe(dest('build/assets/img'));
    done();
};

// Uglify js files
function js(done) {
    src(scriptSrc)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(dest('build/assets/js'));
    done();
};

//Concat and Compress Vendor .js files
function vendor(done) {
    src(
        [
            vendorSrc
        ])
        .pipe(plumber())
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(dest(scriptDest));
    done();
};


// Watch for changes
function watcher() {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        notify: false
    });

    watch(styleSrc, series(css));
    watch(scriptSrc, series(js));
    watch(vendorSrc, series(vendor));
    watch([
        htmlDest + '*.html',
        styleDest + '*.css',
        scriptDest + '*.js',
        vendorDest + '*.js'
    ]).on('change', browserSync.reload);
};


// use default task to launch Browsersync and watch JS files
let build = parallel(watcher);
task('default', build);
task('img', img);
