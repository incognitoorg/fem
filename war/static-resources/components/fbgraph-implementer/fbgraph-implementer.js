define(function(require) {
	
	var fbGraphApi = require('http://connect.facebook.net/en_US/all.js');

	console.log('FB loaded',FB);
	FB.init({
		appId      : '552196874810994', // App ID from the App Dashboard
	    channelUrl : 'http://localhost:8888/', // Channel File for x-domain communication
	    status     : true, // check the login status upon init?
		cookie     : true, // set sessions cookies to allow your server to access the session?
		xfbml      : true  // parse XFBML tags on this page?
	});
	
	return {
		getInstance : function() {
			return {
				initialize : function(options) {
					
				},
				checkAndDoLogin : function(){
					FB.login(function(response) {
						   if (response.authResponse) {
							   	 this.authToken = response.authResponse.accessToken;
							     FB.api('/me', function(response) {
							    	 $('.loginbutton').hide();
							    	 $('.logoutbutton').show();
							    	// $(".js-fem-container").show();
							    	 $('.welcomemessage').html('Welcome, ' + response.name + '.');
							    	 //implementAware(response.name);
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
		}
	};
	
});