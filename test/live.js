var ide = require( 'crosstalk-ide' )();

var fs = require( 'fs' );
require.extensions[".config"] = function (m) {
	 m.exports = JSON.parse(fs.readFileSync(m.filename));
};

config = require('/home/jacob/.crosstalk.config');

var callback = function (error, response) {
  console.log(error, response);
	if (!error) {
		ide.send(config.crosstalkToken, "sendgrid.smtp.send", response);
	}
}

var data = { 
  to: "gospelbass@gmail.com",
  from: "jwilliams@fahrenheitmarketing.com",
  subject: "test message",
  text: "this is a test message"
}

// ide.send(config.crosstalkToken, "sendgrid.smtp.send", {}, null, callback);

// ide.send(config.crosstalkToken, "sendgrid.smtp.send", data, null, callback);

ide.send(config.crosstalkToken, "rss.new", { title: "post title", link: "http://iakob.com", description: "post content" }, null, callback );
