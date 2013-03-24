define(function(require) {
	
	var FB = require('components/fbapi/fbapi');
	
	/*return {
		getInstance : function() {*/
			return {
				initialize : function(options) {
					
				},
				checkAndDoLogin : function(options){
					FB.login(function(response) {
						if(options.callback){
							options.callback.call(options.context || this, response);
						}
						
						/*if (response.authResponse) {
							   	 this.authToken = response.authResponse.accessToken;
							     FB.api('/me', function(response) {
							    	 console.log(response);
							    	 $('.loginbutton').hide();
							    	 $('.logoutbutton').show();
							    	// $(".js-fem-container").show();
							    	 $('.welcomemessage').html('Welcome, ' + response.name + '.');
							    	 //implementAware(response.name);
							     });
						   } else {
						     console.log('User cancelled login or did not fully authorize.');
						   }*/
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