var ide = require( 'crosstalk-ide' )();
var path = require( 'path' );
var templateconfig = require( '../config.json' );
var emailconfig = require( '../../sendgrid-smtp-email/config.json' );

var template = ide.run( path.join( __dirname, '../index.js'), { name : "template", config : templateconfig } );
var email = ide.run( path.join( __dirname, '../../sendgrid-smtp-email/index.js'), { name : "email", config : emailconfig } );
email.dontMockHttps = true;

var data = { title: "this is my title", description: "this is my body", link: "http://iakob.com" };

template.send( templateconfig.source, data, null, function(error, data) {
	email.send( templateconfig.target, data );	
	// console.log(data);
});

// template.shouldEmit( templateconfig.target );
