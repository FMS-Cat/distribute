( function() {

  'use strict';

  let express = require( 'express' );
  let app = express();
  let http = require( 'http' );
  let server = http.createServer( app );

  // ------

  let port = process.env.PORT || 3000;
  server.listen( port, function() {
  } );
  console.log( 'port: ' + port );

  // ------

  app.use( '/', express.static( __dirname + '/dist' ) );
  
} )();
