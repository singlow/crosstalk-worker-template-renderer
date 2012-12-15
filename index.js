/*
 * index.js: Simple Crosstalk templating worker
 *
 * (C) 2012 Jacob Williams.
 */
"use strict";

var config = require( 'config' );
var _ = require( 'underscore' );

var buildTemplate = function buildTemplate(str) {
  return new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +
			"with(obj){p.push('" +
			str
				.replace(/[']/g, "\\'")
				.split("{{").join("\'+")
				.split("}}").join("+\'")
		+ "');}return p.join('');");
};

var buildTemplateRecursive = function buildTemplateRecursive(tpl) {
	if (typeof tpl === 'string') {
		return buildTemplate(tpl);
  }
	if (typeof template === 'object') {
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
	if ( config.target ) {
	  crosstalk.emit( config.target, renderRecursive( data ) );
	} else {
		callback( null, renderRecursive( data ) );
	}
}

crosstalk.on( config.source, respond );
