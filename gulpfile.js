'use strict';

const gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemap = require('gulp-sourcemaps');
var sass = require('gulp-sass')(require('sass'));
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var csso = require('gulp-csso');
var posthtml = require('gulp-posthtml');
var rename = require('gulp-rename');
var del = require('del');
var concat = require('gulp-concat');
var posthtmlInclude = require('posthtml-include');
// var imagemin = require('gulp-imagemin');

var imagemin;
var stripCssComments;

// async function loadModules() {
//   imagemin = (await requireModule('gulp-imagemin')).default;
// }

async function loadModules() {
    const imageminModule = await import('gulp-imagemin');
    const stripCssCommentsModule = await import('gulp-strip-css-comments');

    imagemin = imageminModule.default;
    stripCssComments = stripCssCommentsModule.default;
}

gulp.task('cssmin', function () {
  return gulp.src('source/sass/main.scss')
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([
        autoprefixer()
      ]))
      .pipe(csso())
      .pipe(rename('main.min.css'))
      .pipe(sourcemap.write('.'))
      .pipe(stripCssComments())
    //   .pipe(gulp.dest('source/css'))
      .pipe(gulp.dest('build/css'))
      .pipe(server.stream());
});

gulp.task('css', function () {
  return gulp.src('source/sass/main.scss')
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([
        autoprefixer()
      ]))
      .pipe(rename('main.css'))
      .pipe(sourcemap.write('.'))
      .pipe(stripCssComments())
    //   .pipe(gulp.dest('source/css'))
      .pipe(gulp.dest('build/css'))
      .pipe(server.stream());
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.scss', gulp.series('cssmin', 'refresh'));
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
//   gulp.watch('source/js/main/*.js', gulp.series('jsMain', 'refresh'));
    gulp.watch('source/assets/**/*.{png,jpg,svg}', gulp.series('images'));

});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});

// gulp.task('images', function () {
//     return gulp.src('source/assets/**/*.{png,jpg,svg}')
//         .pipe(imagemin([
//           imagemin.optipng({optimizationLevel: 3}),
//           imagemin.jpegtran({progressive: true}),
//           imagemin.svgo()
//         ]))
  
//         .pipe(gulp.dest('source/assets'));
//   });


  gulp.task('images', function () {
    return gulp.src('source/assets/*.{png,jpg,svg}', { encoding: false })
        .pipe(plumber())
      .pipe(imagemin())
      .pipe(gulp.dest('build/assets'));
    });

gulp.task('html', function () {
  return gulp.src('source/*.html')
      .pipe(posthtml([
        posthtmlInclude()
      ]))
      .pipe(gulp.dest('build'));
});

gulp.task('copy', function () {
  return gulp.src([
    // 'source/fonts/**/*.{woff,woff2}',
    'source/assets/**',
    'source//*.ico'
  ], {
    base: 'source'
  })
      .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', gulp.series(loadModules, 'clean', 'copy', 'images', 'css', 'cssmin', 'html'));
gulp.task('start', gulp.series('build', 'server'));

// Version 2

// const gulp = require('gulp');
// const concat = require('gulp-concat');
// const csso = require('gulp-csso');
// const plumber = require('gulp-plumber');
// const postcss = require('gulp-postcss');
// const posthtml = require('gulp-posthtml');
// const rename = require('gulp-rename');
// const dartSass = require('sass');
// const gulpSass = require('gulp-sass')(dartSass);
// const sourcemaps = require('gulp-sourcemaps');
// const svgstore = require('gulp-svgstore');
// const browserSync = require('browser-sync').create();
// const autoprefixer = require('autoprefixer');
// const del = require('del');
// const posthtmlInclude = require('posthtml-include');
// const { createRequire } = require('module');

// // const requireModule = createRequire(import.meta.url);
// let imagemin;
// // let webp;

// async function loadModules() {
//   const imageminModule = await import('gulp-imagemin');
// //   const webpModule = await import('gulp-webp');
//   imagemin = imageminModule.default;
// //   webp = webpModule.default;
// }

// const paths = {
//   styles: {
//     src: 'source/sass/**/*.{sass,scss}',
//     dest: 'build/css'
//   },
//   images: {
//     src: 'source/assets/**/*.{png,jpg,svg}',
//     dest: 'build/assets'
//   },
//   html: {
//     src: 'source/*.html',
//     dest: 'build'
//   }
// };

// // Clean the build directory
// function clean() {
//   return del(['build']);
// }

// // Compile and minify Sass
// function styles() {
//   return gulp.src(paths.styles.src)
//     .pipe(plumber())
//     .pipe(sourcemaps.init())
//     .pipe(gulpSass({
//       includePaths: ['node_modules']
//     }).on('error', gulpSass.logError))
//     .pipe(postcss([autoprefixer()]))
//     .pipe(csso())
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest(paths.styles.dest))
//     .pipe(browserSync.stream());
// }

// // // Minify and concatenate JavaScript
// // function scripts() {
// //   return gulp.src(paths.scripts.src)
// //     .pipe(plumber())
// //     .pipe(sourcemaps.init())
// //     .pipe(concat('main.js'))
// //     .pipe(rename({ suffix: '.min' }))
// //     .pipe(sourcemaps.write('.'))
// //     .pipe(gulp.dest(paths.scripts.dest))
// //     .pipe(browserSync.stream());
// // }

// // Optimize images
// function images() {
//   return gulp.src(paths.images.src)
//     .pipe(plumber())
//     .pipe(imagemin())
//     .pipe(gulp.dest(paths.images.dest));
// }

// // // Convert images to WebP
// // function webpTask() {
// //   return gulp.src(paths.images.src)
// //     .pipe(plumber())
// //     .pipe(webp())
// //     .pipe(gulp.dest(paths.images.dest));
// // }

// // // Create SVG sprite
// // function sprite() {
// //   return gulp.src(paths.sprite.src)
// //     .pipe(plumber())
// //     .pipe(svgstore())
// //     .pipe(rename('sprite.svg'))
// //     .pipe(gulp.dest(paths.sprite.dest));
// // }

// // Process HTML
// function html() {
//   return gulp.src(paths.html.src)
//     .pipe(plumber())
//     .pipe(posthtml([posthtmlInclude()]))
//     .pipe(gulp.dest(paths.html.dest));
// }

// // Watch files for changes
// function watchFiles() {
//   gulp.watch(paths.styles.src, styles);
// //   gulp.watch(paths.scripts.src, scripts);
//   gulp.watch(paths.images.src, gulp.series(images));
//   gulp.watch(paths.html.src, gulp.series(html)).on('change', browserSync.reload);
// }

// // Serve the project
// function serve() {
//   browserSync.init({
//     server: {
//       baseDir: 'build'
//     }
//   });

//   gulp.watch(paths.styles.src, styles);
// //   gulp.watch(paths.scripts.src, scripts);
//   gulp.watch(paths.images.src, gulp.series(images));
//   gulp.watch(paths.html.src, gulp.series(html)).on('change', browserSync.reload);
// }

// const build = gulp.series(clean, loadModules, gulp.parallel(styles, images, html));

// // Load ES Modules and export tasks
// exports.build = gulp.series(build);
// exports.start = gulp.series(build, serve);
