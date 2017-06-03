/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';

// Include promise polyfill for node 0.10 compatibility
require('es6-promise').polyfill();

// Include Gulp & tools we'll use
var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var merge = require('merge-stream');
var path = require('path');
var fs = require('fs');
var glob = require('glob-all');
var historyApiFallback = require('connect-history-api-fallback');
var packageJson = require('./package.json');
var crypto = require('crypto');
var ensureFiles = require('./tasks/ensure-files.js');
var babel = require('rollup-plugin-babel');

// var ghPages = require('gulp-gh-pages');

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var DIST = 'dist';

var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};

var styleTask = function(stylesPath, srcs) {
  return gulp.src(srcs.map(function(src) {
      return path.join('app', stylesPath, src);
    }))
    .pipe($.changed(stylesPath, {extension: '.css'}))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/' + stylesPath))
    .pipe($.minifyCss())
    .pipe(gulp.dest(dist(stylesPath)))
    .pipe($.size({title: stylesPath}));
};

var imageOptimizeTask = function(src, dest) {
  return gulp.src(src)
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(dest))
    .pipe($.size({title: 'images'}));
};

var optimizeHtmlTask = function(src, dest) {
  var assets = $.useref.assets({
    searchPath: ['.tmp', 'app']
  });

  return gulp.src(src)
    .pipe(assets)
    // Concatenate and minify JavaScript
    .pipe($.if(['!*.min.js','*.js'], $.uglify({
      preserveComments: 'license'
    }).on('error', gutil.log)))
    // Concatenate and minify styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml({
      quotes: true,
      empty: true,
      spare: true
    })))
    // Output files
    .pipe(gulp.dest(dest))
    .pipe($.size({
      title: 'html'
    }));
};

// Compile and automatically prefix stylesheets
gulp.task('styles', function() {
  return styleTask('styles', ['**/*.css']);
});

// Ensure that we are not missing required files for the project
// "dot" files are specifically tricky due to them being hidden on
// some systems.
gulp.task('ensureFiles', function(cb) {
  var requiredFiles = ['.bowerrc'];

  ensureFiles(requiredFiles.map(function(p) {
    return path.join(__dirname, p);
  }), cb);
});

// Optimize images
gulp.task('images', function() {
  return imageOptimizeTask('app/images/**/*', dist('images'));
});

// Copy all files at the root level (app)
gulp.task('copy', function() {
  var app = gulp.src([
    'app/*',
    '!app/test',
    '!app/elements',
    '!app/bower_components',
    '!app/cache-config.json',
    '!**/.DS_Store'
  ], {
    dot: true
  }).pipe(gulp.dest(dist()));

  // Copy over only the bower_components we need
  // These are things which cannot be vulcanized
  var bowerFolders = [
    'webcomponentsjs',
    'platinum-sw',
    'sw-toolbox',
    'promise-polyfill',
    'jQuery',
    'localforage',
    'polymer-localforage'
  ].join(',');
  var bower = gulp.src([
    'app/bower_components/{' + bowerFolders + '}/**/*'
  ]).pipe(gulp.dest(dist('bower_components')));

  // Copy over only the node modules we need
  // These are things which cannot be vulcanized
  var nodeFolders = [
    '@reactivex',
    'nop' // just a filler so that {} works
  ].join(',');
  var node_modules = gulp.src([
    'node_modules/{' + nodeFolders + '}/**/*'
  ]).pipe(gulp.dest(dist('node_modules')));

  return merge(app, bower, node_modules)
    .pipe($.size({
      title: 'copy'
    }));
});

// Copy web fonts to dist
gulp.task('fonts', function() {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest(dist('fonts')))
    .pipe($.size({
      title: 'fonts'
    }));
});

// Scan your HTML for assets & optimize them
gulp.task('html', function() {
  var excludedFolders = [
    'elements',
    'test',
    'bower_components',
    'node_modules'
  ].join(',');
  return optimizeHtmlTask(
    ['dist/**/*.html', '!dist/{' + excludedFolders + '}/**/*.html'],
    dist());
});

// Vulcanize granular configuration
gulp.task('vulcanize', function() {
  return gulp.src('.tmp/elements/elements.html')
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(dist('elements')))
    .pipe($.size({title: 'vulcanize'}));
});

// Generate config data for the <sw-precache-cache> element.
// This include a list of files that should be precached, as well as a (hopefully unique) cache
// id that ensure that multiple PSK projects don't share the same Cache Storage.
// This task does not run by default, but if you are interested in using service worker caching
// in your project, please enable it within the 'default' task.
// See https://github.com/PolymerElements/polymer-starter-kit#enable-service-worker-support
// for more context.
gulp.task('cache-config', function(callback) {
  var dir = dist();
  var config = {
    cacheId: packageJson.name || path.basename(__dirname),
    disabled: false
  };

  glob([
    'index.html',
    './',
    'bower_components/webcomponentsjs/webcomponents-lite.min.js',
    '{elements,scripts,styles}/**/*.*'],
    {cwd: dir}, function(error, files) {
    if (error) {
      callback(error);
    } else {
      config.precache = files;

      var md5 = crypto.createHash('md5');
      md5.update(JSON.stringify(config.precache));
      config.precacheFingerprint = md5.digest('hex');

      var configPath = path.join(dir, 'cache-config.json');
      fs.writeFile(configPath, JSON.stringify(config), callback);
    }
  });
});

// Clean output directory
gulp.task('clean', function() {
  return del(['.tmp', dist()]);
});

// Watch files for changes & reload
gulp.task('serve', ['styles', 'js'], function() {
  browserSync({
    port: 5000,
    notify: false,
    logPrefix: 'PSK',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function(snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: ['.tmp', 'app', 'node_modules'],
      routes: {
        '/node_modules': 'node_modules'
      },
      middleware: [historyApiFallback()]
    }
  });

  gulp.watch(['app/**/*.html', '!app/bower_components/**/*.html'], ['js', reload]);
  gulp.watch(['app/styles/**/*.css'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['js', reload]);
  gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function() {
  browserSync({
    port: 5001,
    notify: false,
    logPrefix: 'PSK',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function(snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: dist(),
    middleware: [historyApiFallback()]
  });
});

// Build production files, the default task
gulp.task('default', ['clean'], function(cb) {
  // Uncomment 'cache-config' if you are going to use service workers.
  runSequence(
    'bowertotmp',
    ['ensureFiles', 'copy', 'styles'],
    'js',
    ['images', 'fonts', 'html'],
    'vulcanize', 'cache-config',
    cb);
});

// Build then deploy to GitHub pages gh-pages branch
gulp.task('build-deploy-gh-pages', function(cb) {
  runSequence(
    'default',
    'deploy-gh-pages',
    cb);
});

// Deploy to GitHub pages gh-pages branch
gulp.task('deploy-gh-pages', function() {
  return gulp.src(dist('**/*'))
    // Check if running task from Travis CI, if so run using GH_TOKEN
    // otherwise run using ghPages defaults.
    .pipe($.if(process.env.TRAVIS === 'true', $.ghPages({
      remoteUrl: 'https://$GH_TOKEN@github.com/thgreasi/github-analytics.git',
      silent: true,
      branch: 'gh-pages'
    }), $.ghPages()));
});

// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
require('web-component-tester').gulp.init(gulp);

// Load custom tasks from the `tasks` directory
try {
  require('require-dir')('tasks');
} catch (err) {
  // Do nothing
}

gulp.task('js', ['js-rollup', 'js-babel']);

// Rollup all app scripts
gulp.task('js-rollup', function() {
  return gulp.src(['app/scripts/app.js'])
   .pipe($.sourcemaps.init())
   .pipe($.rollup({
      entry: 'app/scripts/app.js',
      // sourceMap: true,
      plugins: [babel({
        presets: ['es2015-rollup'],
      })],
      format: 'umd',
      moduleName: 'app'
   }))
   .pipe($.sourcemaps.write('.'))
   .pipe(gulp.dest('.tmp/scripts'))
   .pipe(gulp.dest(dist()));
});

// Transpile all JS to ES5.
gulp.task('js-babel', function() {
  return gulp.src([
      'app/**/*.{js,html}',
      '!app/scripts/**/*.js',
      '!app/bower_components/**/*'
    ])
   .pipe($.sourcemaps.init())
   .pipe($.if('*.html', $.crisper({scriptInHead: false}))) // Extract JS from .html files
   .pipe($.if('*.js', $.babel({
      presets: ['es2015']
    })))
   .pipe($.sourcemaps.write('.'))
   .pipe(gulp.dest('.tmp/'))
   .pipe(gulp.dest(dist()));
});

// Copy all bower_components over to help js task and vulcanize work together
gulp.task('bowertotmp', function() {
  return gulp.src(['app/bower_components/**/*'])
    .pipe(gulp.dest('.tmp/bower_components/'));
});




var realFavicon = require ('gulp-real-favicon');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
  realFavicon.generateFavicon({
    masterPicture: 'app/images/app-logo-source.png',
    dest: 'app/images/touch',
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#ffffff',
        margin: '0%',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        },
        appName: 'Github Analytics'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#2b5797',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        },
        appName: 'Github Analytics'
      },
      androidChrome: {
        pictureAspect: 'shadow',
        themeColor: '#2e3aa1',
        manifest: {
          name: 'Github Analytics',
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      }/*,
      safariPinnedTab: {
        pictureAspect: 'blackAndWhite',
        threshold: 93.125,
        themeColor: '#5bbad5'
      }*/
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  });
});

// // Inject the favicon markups in your HTML pages. You should run
// // this task whenever you modify a page. You can keep this task
// // as is or refactor your existing HTML pipeline.
// gulp.task('inject-favicon-markups', function() {
//   return gulp.src([ 'TODO: List of the HTML files where to inject favicon markups' ])
//     .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
//     .pipe(gulp.dest('TODO: Path to the directory where to store the HTML files'));
// });

// // Check for updates on RealFaviconGenerator (think: Apple has just
// // released a new Touch icon along with the latest version of iOS).
// // Run this task from time to time. Ideally, make it part of your
// // continuous integration system.
// gulp.task('check-for-favicon-update', function(done) {
//   var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
//   realFavicon.checkForUpdates(currentVersion, function(err) {
//     if (err) {
//       throw err;
//     }
//   });
// });
