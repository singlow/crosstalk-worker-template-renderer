var fs = require( 'fs' );
require.extensions[".config"] = function (m) {
	 m.exports = JSON.parse(fs.readFileSync(m.filename));
};

var ide = require( 'crosstalk-ide' )();
var path = require( 'path' );
var cxconfig = require( '/home/jacob/.crosstalk.config' );
var templateconfig = require( '../config.json' );
var emailconfig = require( '../../sendgrid-smtp-email/config.json' );

var template = ide.run( path.join( __dirname, '../index.js'), { name : "template", config : templateconfig } );
var email = ide.run( path.join( __dirname, '../../sendgrid-smtp-email/index.js'), { name : "email", config : emailconfig } );
template.proxy = email.proxy = true;

var data = { title: "this is my title", description: "this is my body", link: "http://iakob.com" };

template.send( templateconfig.source, data, null, true);
template.shouldCallCallback(templateconfig.source);

template.send( templateconfig.source, data, null, false );
template.shouldEmit( templateconfig.target );

ide.send( cxconfig.crosstalkToken, templateconfig.target, { to: 'rss@iakob.com', from: 'rss@iakob.com', subject: 'test', html: 'test body' } );
