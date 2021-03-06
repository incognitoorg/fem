module.exports = function(grunt) {

	var requirejsconfig = grunt.file.readJSON('./r-js-optimizer/tools/build.js');

	// Project configuration.
	grunt.initConfig({
		/*pkg: grunt.file.readJSON('package.json'),*/
		appengine: {
			options: {
				/*sdk:'C:/Users/VAronde/Downloads/sdk/gae-sdk/appengine-java-sdk-1.8.6/bin',*/
				sdk: process.env.GAE_SDK + '/bin',
				manageScript : 'appcfg.sh',
				runFlags: {
					port: 8080
				},
				manageFlags: {
					oauth2 : true,
					oauth2_refresh_token : '1/8LlEZ-6T_Et_QBwn56UT3eHnZu4Wa3i5pNt3uFr1yYA'
				}
			},

			frontend: {
				root: 'war/'
			}/*,
			backend: {
				root: 'backend/',
				backend: true,
				backendName: 'crawler'
			}*/
		},
		requirejs : {
			compile : {
				options : requirejsconfig 
			} 
		},
		'string-replace': {
			toDeploy: {
				files: {
					/*'path/to/directory/': 'path/to/source/*', // includes files in dir
				      'path/to/directory/': 'path/to/source/**', // includes files in dir and subdirs
				      'path/to/project-<%= pkg.version %>/': 'path/to/source/**', // variables in destination
				      'path/to/directory/': ['path/to/sources/*.js', 'path/to/more/*.js'], // include JS files in two diff dirs
					 */			      
					'war/static-resources/core/envvariables.js': 'war/static-resources/core/envvariables.js',
					'war/boilerplate.js': 'war/boilerplate.js',
					'war/index.html': 'war/index.html',
					'war/fem.appcache': 'war/builtfem.appcache'
				},
				options: {
					replacements: [{
						pattern: "/static-resources/",
						replacement: "/built-static-resources/"
					}, {
						pattern: "mode='local'",
						replacement: "mode='dev'"
					},
					 {
						pattern: "'fem.appcache'",
						replacement: "'builtfem.appcache'"
					},
					 {
						pattern: "require.js",
						replacement: "require.min.js"
					},
					{
						pattern: "version 1.0",
						replacement: "version 1.0.1"
					}]
				}
			},
			toLocal: {
				files: {
					'war/static-resources/core/envvariables.js': 'war/static-resources/core/envvariables.js',
					'war/boilerplate.js': 'war/boilerplate.js',
					'war/index.html': 'war/index.html',
					'war/builtfem.appcache': 'war/fem.appcache'
				},
				options: {
					replacements: [{
						pattern: "/built-static-resources/",
						replacement: "/static-resources/"
					}, {
						pattern: "mode='dev'",
						replacement: "mode='local'"
					},
					 {
						pattern: "'builtfem.appcache'",
						replacement: "'fem.appcache'"
					},
					 {
						pattern: "require.min.js",
						replacement: "require.js"
					},
					{
						pattern: "version 1.0.1.1.1.1.1.1.1",
						replacement: "version 1.0"
					}
					]
				}
			}
		},
		
		version: {
			options: {
				// Task-specific options go here.
			},
			// Target-specific file lists and/or options go here.
			appcache : {
				/*options : {
					prefix: '#version\\s*'
				},*/
				src : ['war/builtfem.appcache']
			},
		},
		watch:{
			options: {
				livereload: true
			},
			files:['**/*.js','**/*.html', '**/*.css']/*,
			tasks:['min']*/
		}/*,
		connect: {
			options: {
				port: 8889,//I dont know why I need this port
				// Change this to '*' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					middleware: function( connect ) {
						return [
						        lrSnippet,
						        mountFolder(connect, './')
						        ];
					}
				}
			}
		}*/
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-appengine');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-git');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	// Default task(s).
	grunt.registerTask('default',function(){
		grunt.task.run(['all']);
	});
	
	grunt.registerTask('all', ['string-replace:toDeploy', 'requirejs', 'appengineUpdateWrapper', 'string-replace:toLocal'])
	grunt.registerTask('onlyupload', ['string-replace:toDeploy', /*'requirejs',*/ 'appengineUpdateWrapper', 'string-replace:toLocal'])
	
	grunt.registerTask('appengineUpdateWrapper', function(){
		var gaeSDK = process.env.GAE_SDK;
		if(!gaeSDK){
			console.error('\nGAE SDK not configured. Please set env variables GAE_SDK to gae sdk path. \n\nFor more info about env variable visit http://en.wikipedia.org/wiki/Environment_variable ')
			return false;
		}
		grunt.task.run(['appengine:update:frontend']);
	});
	
	grunt.registerTask('tag', function(){
		var date = new Date();
		grunt.task.run(['gittag']);
	})
	
	grunt.registerTask('version', [])
	grunt.registerTask('server', [ /*'connect',*/ 'watch']);
	
};
