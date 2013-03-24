requirejs.config({
	baseUrl : '/static-resources/',
	paths : {
		backbone : 'libraries/backbone/backbone',
		jquery : 'libraries/jquery/jquery',
		underscore : 'libraries/underscore/underscore',
		handlebars : 'libraries/handlebars/handlebarshelpers',
		handlebarshelpers : 'libraries/handlebars/handlebars',
		css : 'libraries/require/css',
		normalize : 'libraries/require/normalize',
		async : 'libraries/require/async',
		fb : 'libraries/require/fb',
		text : 'libraries/require/text',
		facade : 'core/facade',
		mediator : 'core/mediator',
		debugmode : 'libraries/debugmode/debugmode',
		errorlogger : 'libraries/errorlogger/errorlogger',
		persistence : 'libraries/lawnchair/lawnchair',
		fbgraphinitializer : 'components/fbgraph-initializer/fbgraph-initializer'/*
		analytics : [ 'http://lab.verchaska.com/analytics/piwik',
				'libraries/piwik/piwikfallback' ]*/

	},
	shim : {
		'backbone' : {
			deps : [ 'underscore', 'jquery' ],
			exports : 'Backbone'
		},
		'handlebars' : {
			deps : [ 'handlebarshelpers' ]
		},
		'persistence' : {
			exports : 'Lawnchair'
		}
	},
	waitSeconds : 60
});

require(['bootloaders/fembootloader/fembootloader'], function(bootoloader) {
	bootoloader.start(/*{'debugMode':true,'analytics':true,'errorlogger':true}*/);
});