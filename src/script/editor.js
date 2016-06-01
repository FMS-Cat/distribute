let balloon = require( './balloon' );
let P5 = require( './lib/p5' );

// ------

require( './lib/ace/ace' );
require( './lib/ace/mode-processing' );
require( './lib/ace/theme-monokai' );

let editor = ace.edit( editorDiv );
editor.setTheme( 'ace/theme/monokai' );
editor.getSession().setMode( 'ace/mode/processing' );
editor.getSession().setTabSize( 2 );
editor.getSession().setUseSoftTabs( true );

let defaultSource = 'p5.setup = function() {\n  p5.createCanvas( 256, 256 );\n}\n\np5.draw = function() {\n  \n}'
editor.setValue( defaultSource );

balloon( {
  title: 'test',
  message: 'works!',
  timeout: 3
} );

// ------

let p5s = [];

let compile = function( _source, _target ) {
  try {
    let source = _source;
    let distributeStr = 'var distribute = function( _i ) { return _i; };\n';

    let str = '( function( p5 ) { ' + distributeStr + _source + ' } )';
    let p5 = new P5( eval( str ), _target );
    return p5;
  } catch ( _e ) {
    balloon( {
      title: 'Compile Failed',
      message: _e,
      background: '#f81'
    } );
    return false;
  }
};

let editorCompile = function() {
  p5s.map( function( _p5, _index ) {
    _p5.remove();
    p5s[ _index ] = null;
  } );
  p5s = [];

  let str = editor.getValue();
  let arr = str.split( 'distribute()' );
  let error = false;

  for ( let i = 0; i < 8; i ++ ) {
    let source = arr.reduce( function( str, _value, _index ) {
      if ( _index !== 0 ) {
        str += Math.random().toFixed( 6 );
      }
      return str + _value;
    }, '' );
    let p5 = compile( source, canvasContainer );
    if ( !p5 ) {
      error = true;
      break;
    }
    p5.canvas.classList.add( 'canvas' );
    p5.source = source;
    p5.canvas.addEventListener( 'click', function() {
      editor.setValue( p5.source );
    } );
    p5s.push( p5 );
  }

  if ( !error ) {
    balloon( {
      title: 'Compile OK',
      background: '#8c1',
      timeout: 1
    } );
  }

};

// ------

editor.commands.addCommand( {
  name: 'interpret',
  bindKey: {
    win: 'Ctrl-R',
    mac: 'Command-R'
  },
  exec: function( _editor ) {
    editorCompile();
  }
} );

window.onbeforeunload = function( _e ) {
  _e.preventDefault();
  if ( editor.getValue() !== defaultSource ) {
    return 'ページを更新するとソースコードの変更は失われます。';
  } else {
    return undefined;
  }
};
