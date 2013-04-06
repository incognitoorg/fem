{
	baseUrl: "./../../war/static-resources",
	include: '../page-js/fem.js',
	optimize: "uglify",
	uglify: {
        toplevel: true,
        ascii_only: true,
        beautify: true,
        max_line_length: 1000,

        //How to pass uglifyjs defined symbols for AST symbol replacement,
        //see "defines" options for ast_mangle in the uglifys docs.
        defines: {
            DEBUG: ['name', 'false']
        },

        //Custom value supported by r.js but done differently
        //in uglifyjs directly:
        //Skip the processor.ast_mangle() part of the uglify call (r.js 2.0.5+)
        no_mangle: true
    },

    //If using UglifyJS for script optimization, these config options can be
    //used to pass configuration values to UglifyJS.
    //For possible values see:
    //http://lisperator.net/uglifyjs/codegen
    //http://lisperator.net/uglifyjs/compress
    uglify2: {
        //Example of a specialized config. If you are fine
        //with the default options, no need to specify
        //any of these properties.
        output: {
            beautify: true
        },
        compress: {
            sequences: false
        },
        warnings: true,
        mangle: false
    },

    //If using Closure Compiler for script optimization, these config options
    //can be used to configure Closure Compiler. See the documentation for
    //Closure compiler for more information.
    closure: {
        CompilerOptions: {},
        CompilationLevel: 'SIMPLE_OPTIMIZATIONS',
        loggingLevel: 'WARNING'
    },
    skipModuleInsertion: false,
    paths : {
		backbone : 'libraries/backbone/backbone',
		jquery : 'libraries/jquery/jquery',
		underscore : 'libraries/underscore/underscore',
		handlebars : 'libraries/handlebars/handlebarshelpers',
		handlebarshelpers : 'libraries/handlebars/handlebars',
		css : 'libraries/require/css',
		normalize : 'libraries/require/normalize',
		async : 'libraries/require/async',
		/*fb : 'libraries/require/fb',*/
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
	 //Inlines the text for any text! dependencies, to avoid the separate
    //async XMLHttpRequest calls to load those dependencies.
    inlineText: true,
    /*fileExclusionRegExp: /\.css/,*/
	/*include: '../page-js/home.js',*/
    //appDir: '../www',
    /*mainConfigFile: '../www/js/common.js',*/
    /*dir: '../www-built',*/
    
    /*skipCSS : true,*/
    
    dir : './../../war/built-static-resources',
    modules: [
        //First set up the common build layer.
       /* {
        	//module names are relative to baseUrl
        	name: 'libraries/jquery/jquery',
        	//List common dependencies here. Only need to list
        	//top level dependencies, "include" will find
        	//nested dependencies.
        	include : [ 'libraries/backbone/backbone', 
        	            'libraries/jquery/jquery', 
        	            'libraries/underscore/underscore',
        	            'libraries/handlebars/handlebarshelpers',
        	            'libraries/handlebars/handlebars',
        	            'libraries/require-jquery/css',
        	            'libraries/require-jquery/normalize',
        	            'libraries/require-jquery/async',
        	            'libraries/require-jquery/text',
        	            'libraries/core/facade',
        	            'libraries/core/mediator',
        	            'libraries/debugmode/debugmode',
        	            'libraries/errorlogger/errorlogger'
        	            ]

        },*/

        //Now set up a build layer for each main layer, but exclude
        //the common one. "exclude" will exclude nested
        //the nested, built dependencies from "common". Any
        //"exclude" that includes built modules should be
        //listed before the build layer that wants to exclude it.
        //The "page1" and "page2" modules are **not** the targets of
        //the optimization, because shim config is in play, and
        //shimmed dependencies need to maintain their load order.
        //In this example, common.js will hold jquery, so backbone
        //needs to be delayed from loading until common.js finishes.
        //That loading sequence is controlled in page1.js.
        
       /* {
        	//module names are relative to baseUrl/paths config
            name: 'app/main1',
            exclude: ['../common']
        	name :'bootloaders/bootloader/bootloader',
            include: ['bootloaders/bootloader/bootloader'],
            exclude: ['backbone','handlebars','modules/common/ibepagecontroller/ibepagecontroller']
        },
        {
        	name :'components/decidepagehandler/decidepagehandler',
            include: ['components/decidepagehandler/decidepagehandler'],
            exclude: ['backbone','handlebars','modules/common/ibepagecontroller/ibepagecontroller']
        },
        {
        	name :'modules/common/ibehomepage/ibehomepage',
            include: ['modules/common/ibehomepage/ibehomepage'],
            exclude: ['backbone']
        },
        {
		    name :'modules/air/airdecidepagehandler/airdecidepagehandler',
		    include : ['modules/air/airdecidepagehandler/airdecidepagehandler'],
		    exclude :['backbone','handlebars','underscore','jquery', 'modules/common/ibehomepage/ibehomepage','components/decidepagehandler/decidepagehandler'] 
        },
        {
        	name :'modules/common/ibepagecontroller/ibepagecontroller',
            include: ['modules/common/ibepagecontroller/ibepagecontroller'],
            exclude: ['backbone','handlebars','underscore','jquery', 'modules/common/ibehomepage/ibehomepage']
        },
        {
        	name :'modules/air/bookingreview/bookingreview',
            include: ['modules/air/bookingreview/bookingreview'],
        	exclude: ['backbone','handlebars','underscore','jquery','libraries/jquery-ui/jquery-ui']
        },
        {
        	name :'modules/air/aircart/airCart',
            include: ['modules/air/aircart/airCart'],
        	exclude: ['backbone','handlebars','underscore','jquery']
        },
        {
        	name :'modules/common/shippinginfo/shippinginfo',
            include: ['modules/common/shippinginfo/shippinginfo'],
        	exclude: ['backbone','handlebars','underscore','jquery']
        },
        {
        	name :'modules/air/bookingsummary/bookingsummary',
            include: ['modules/air/bookingsummary/bookingsummary'],
        	exclude: ['backbone','handlebars','underscore','jquery']
        }*/
        {
        	name :'bootloaders/fembootloader/fembootloader',
            include: ['bootloaders/fembootloader/fembootloader'],
        	exclude: ['backbone','handlebars','underscore','jquery']
        }
        

    ]
}
