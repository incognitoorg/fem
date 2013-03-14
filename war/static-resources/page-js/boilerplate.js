requirejs.config({
	baseUrl : '/public/resources',
	paths : {
		backbone : 'libraries/backbone/backbone',
		jquery : 'libraries/jquery/jquery',
		underscore : 'libraries/underscore/underscore',
		handlebars : 'libraries/handlebars/handlebarshelpers',
		handlebarshelpers : 'libraries/handlebars/handlebars',
		css : 'libraries/require-jquery/css',
		normalize : 'libraries/require-jquery/normalize',
		async : 'libraries/require-jquery/async',
		text : 'libraries/require-jquery/text',
		facade : 'libraries/core/facade',
		mediator : 'libraries/core/mediator',
		debugmode : 'libraries/debugmode/debugmode',
		errorlogger : 'libraries/errorlogger/errorlogger',
		persistence : 'libraries/lawnchair/lawnchair',
		analytics : [ 'http://lab.verchaska.com/analytics/piwik',
				'components/piwik/piwikfallback' ]

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

require(['bootloaders/vebookbootloader/vebookbootloader'], function(bootoloader) {
	bootoloader.start();
});
