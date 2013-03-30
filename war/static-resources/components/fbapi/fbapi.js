define(function(require) {
	
	var FBAPI = require('http://connect.facebook.net/en_US/all/debug.js');
	
	 // init the Facebook JS SDK
    FB.init( {
    	appId: '476625022390528', // http://localhost:8888		//srikanth's local appId
        //appId: '505558516167469', // http://fem1-vishwanath.appspot.com
        //channelUrl: 'http://localhost:8888/channel.html', // Channel File for x-domain communication
        status: true, // check the login status upon init?
        cookie: true, // set sessions cookies to allow your server to access the session?
        xfbml: true // parse XFBML tags on this page?
    } );
	
    var FBAuthToken;
    
    return {
		initialize : function(options) {
			
		},
		checkAndDoLogin : function(options){
			FB.login(function(response) {
				
				if (response.authResponse) {
						 FBAuthToken = response.authResponse.accessToken;
					     FB.api('/me', function(response) {
					    	 
					    	 if(options.callback){
					    		 options.callback.call(options.context || this, {
					    		     loginType:'facebook', 
					    		     facebookId:response.id,
					    		     firstName : response.first_name,
					    		     lastName : response.last_name,
					    		     data : response
					    		 });
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
			return FBAuthToken;
		}
	};
	
});