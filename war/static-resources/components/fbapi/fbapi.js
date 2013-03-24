define(function(require) {
	
	//var FB = require('components/fbapi/fbapi');
	
	var FBAPI = require('http://connect.facebook.net/en_US/all/debug.js');
	
	 // init the Facebook JS SDK
    FB.init( {
    	appId: '503776339657462', // http://localhost:8888
        //appId: '505558516167469', // http://fem1-vishwanath.appspot.com
        //channelUrl: 'http://localhost:8888/channel.html', // Channel File for x-domain communication
        status: true, // check the login status upon init?
        cookie: true, // set sessions cookies to allow your server to access the session?
        xfbml: true // parse XFBML tags on this page?
    } );
	/*return {
		getInstance : function() {*/
			return {
				initialize : function(options) {
					
				},
				checkAndDoLogin : function(options){
					FB.login(function(response) {
						
						if (response.authResponse) {
							   	 this.authToken = response.authResponse.accessToken;
							     FB.api('/me', function(response) {
							    	 
							    	 if(options.callback){
							    		 options.callback.call(options.context || this, response);
							    	 }
							     });
						   } else {
						     console.log('User cancelled login or did not fully authorize.');
						   }
					});
				},
				checkAndDoLogout : function(){
					FB.logout(function(response) {
						location.reload();
						  // user is now logged out
						});
				},
				getAuthToken : function(){
					return this.authToken;
				}
			};
	/*	}
	};*/
	
});