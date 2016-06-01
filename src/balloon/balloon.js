module.exports = ( function() {

  'use strict';

  // ------

  require( './balloon.scss' );

  let balloonContainer = document.createElement( 'div' );
  balloonContainer.id = 'balloonContainer';
  document.body.appendChild( balloonContainer );

  // ------

  let balloon = function( _props ) {
    let props = {
      title: '',
      message: '',
      background: '#3399ff',
      color: '#ffffff',
      timeout: 0,
      target: balloonContainer
    };
    for ( let key in _props ) {
      props[ key ] = _props[ key ];
    }

    let balloon = document.createElement( 'div' );
    balloon.classList.add( 'balloon' );
    props.target.appendChild( balloon );

    balloon.style.background = props.background;
    balloon.style.color = props.color;

    let end = function() {
      if ( balloon ) {
        balloon.classList.add( 'end' );
        balloon.addEventListener( 'animationend', function() {
          if ( balloon ) {
            balloon.remove();
          }
        } );
      }
    };
    balloon.addEventListener( 'click', end );
    if ( 0 < props.timeout ) {
      setTimeout( end, props.timeout * 1000.0 );
    }

    let title = document.createElement( 'div' );
    title.classList.add( 'title' );
    title.innerText = props.title;
    balloon.appendChild( title );

    let message = document.createElement( 'div' );
    message.classList.add( 'message' );
    message.innerText = props.message;
    balloon.appendChild( message );
  };

  return balloon;

} )();
