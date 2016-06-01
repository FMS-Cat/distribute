( function() {

  'use strict';

  let gulp = require( 'gulp' );

  let browserify = require( 'browserify' );
  let watchify = require( 'watchify' );
  let babelify = require( 'babelify' );
  let sassify = require( 'sassify' );
  let rename = require( 'gulp-rename' );
  let source = require( 'vinyl-source-stream' );

  let browserSync = require( 'browser-sync' );

  let server = require( 'gulp-develop-server' );

  // ------

  gulp.task( 'browserify', function() {
    let b = watchify( browserify( {
      'cache': {},
      'packageCache': {},
      'fullPaths': true,
      'entries': [ './src/main.js' ],
      'plugin': [ 'watchify' ],
      'transform': [
        [ babelify, {
          'presets': 'es2015'
        } ],
        [ sassify, {
          'auto-inject': true,
          'base64Encode': false,
          'sourceMap': false
        } ]
      ]
    } ) );

    let bundle = function() {
      console.log( '🔮 Browserify!' );
      b.bundle()
      .on( 'error', function( _error ) {
        console.error( _error );
        this.emit( 'end' );
      } )
      .pipe( source( 'main.js' ) )
      .pipe( gulp.dest( './dist' ) );
    }

    bundle();

    b.on( 'update', function() {
      bundle();
    } );

    b.on( 'log', function( _log ) {
      console.log( '🍕 ' + _log );
    } );
  } );

  // ------

  gulp.task( 'browser-init', function() {
    browserSync.init( {
      proxy: 'localhost:3000'
    } );
  } );

  gulp.task( 'browser-reload', function() {
    browserSync.reload();
  } );

  gulp.task( 'browser-watch', function() {
    gulp.watch( [ './dist/**' ], [ 'browser-reload' ] );
  } );

  // ------

  gulp.task( 'node-start', function() {
    server.listen( { path: './index.js' } );
  } );

  gulp.task( 'node-restart', function() {
    server.restart();
  } );

  gulp.task( 'node-watch', function() {
    gulp.watch( [ './*' ], [ 'node-restart' ] );
  } );

  // ------

  gulp.task( 'watch', [ 'browserify', 'browser-watch', 'node-watch' ] );

  gulp.task( 'dev', [ 'node-start', 'browser-init', 'watch' ] );
  gulp.task( 'default', [ 'dev' ] );

} )();
