/*
 * index.js: Simple Crosstalk templating worker
 *
 * (C) 2012 Jacob Williams.
 */
"use strict";

var config = require( 'config' );
var _ = require( 'underscore' );

var buildTemplate = function buildTemplate(str) {
	var func = "with(obj){return ('" +
			str
				.replace(/\n/g, "\\n")
				.replace(/\r/g, "\\r")
				.replace(/[']/g, "\\'")
				.split("{{").join("\'+")
				.split("}}").join("+\'")
		  + "').replace(/\\n/g, \"\\n\") ;}";
  return new Function("obj", func);
};

var buildTemplateRecursive = function buildTemplateRecursive(tpl) {
	if (typeof tpl === 'string') {
		return buildTemplate(tpl);
  }
	if (typeof tpl === 'object') {
		var obj = {};
		for (var prop in tpl) {
			obj[prop] = buildTemplateRecursive(tpl[prop]);
		}
		return obj;
	}
	return tpl;
};

var renderRecursive = function renderRecursive(tpl, data) {
	if (typeof tpl === 'function') {
		return tpl(data);
	}
	if (typeof tpl === 'object') {
		var obj = {};
		for (var prop in tpl) {
			obj[prop] = renderRecursive(tpl[prop], data);
		}
		return obj;
	}
  return tpl;
};

var template = buildTemplateRecursive( config.template );

var respond = function respond( data, callback ) {
	callback = callback || false;
	if ( !callback ) {
	  crosstalk.emit( config.target, renderRecursive( template, data ) );
	} else {
		callback( null, renderRecursive( template, data ) );
	}
}

crosstalk.on( config.source, respond );
