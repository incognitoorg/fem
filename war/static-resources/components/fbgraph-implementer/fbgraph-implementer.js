define(function(require) {
	
	return {
		getInstance : function() {
			return {
				initialize : function(options) {
					require(['async!http://connect.facebook.net/en_US/all.js'],function(FB){
						console.log('FB loaded',FB);
						require(['fbgraph-initializer'],function(FBInitializer){
							console.log('FB init called');
						});
					});
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