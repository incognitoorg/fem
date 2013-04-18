var require = {
		baseUrl : '/static-resources/',
		paths : {
			backbone : ['http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min', 'libraries/backbone/backbone'],
			jquery : ['http://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min', 'libraries/jquery/jquery'],
			underscore : ['http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min','libraries/underscore/underscore'],
			handlebars : 'libraries/handlebars/handlebarshelpers',
			handlebarshelpers : ['http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0-rc.3/handlebars.min','libraries/handlebars/handlebars'],
			css : 'libraries/require/css',
			normalize : 'libraries/require/normalize',
			async : 'libraries/require/async',
			text : 'libraries/require/text',
			facade : 'core/facade',
			envvariables : 'core/envvariables',
			sandbox : 'core/sandbox',
			locallayer : 'core/locallayer',
			mediator : 'core/mediator',
			debugmode : 'libraries/debugmode/debugmode',
			errorlogger : 'libraries/errorlogger/errorlogger',
			persistence : 'libraries/lawnchair/lawnchair',
			fbgraphinitializer : 'components/fbgraph-initializer/fbgraph-initializer'
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
		waitSeconds : 60,
		/* urlArgs: "v=0.25",  */
		deps : ['page-js/fem']
};
//TODO : Move this to better place
window.applicationCache.addEventListener('updateready', function(e) {
	if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
		// Browser downloaded a new app cache.
		// Swap it in and reload the page to get the new hotness.
		window.applicationCache.swapCache();
		//TODO : To add beutiful confirm dialogue here
		if (confirm('A new version of this site is available. Load it?')) {
			window.location.reload();
		}
	} else {
		// Manifest didn't changed. Nothing new to server.
	}
}, false);