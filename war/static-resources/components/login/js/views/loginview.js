define(function(require){
	var Normalize = require('css!libraries/foundation/css/normalize.css');
	
	var Sandbox = require('sandbox');
	var CSS = require('css!./../../css/login.css');
	
	var FBAPI = require('components/fbapi/fbapi');
	var GoogleAPI = require('components/googleapi/googleapi');
	
	var LoginView = Backbone.View.extend({
		initialize : function(options){
			var userInfo = this.getFromSession();
			if(userInfo && JSON.parse(userInfo)){
				this.userInfo = JSON.parse(userInfo);
				this.startApp(userInfo);
				$(this.el).hide();
				return;
			}
			this.options = _.extend({
				//defaults here
			}, options);
			this.render();
		},
		render : function(){
			//$(this.el).html(this.template());
		},
		events : {
			'click .facebook' : 'eventDoFacebookLogin',
			'click .google' : 'eventDoGoogleLogin'
			
		},
		eventDoFacebookLogin : function(){
			FBAPI.checkAndDoLogin({callback : this.doActualLogin, context : this});
		},
		eventDoGoogleLogin : function(){
			GoogleAPI.checkAndDoLogin({callback : this.doActualLogin, context : this});
		},
		doActualLogin : function(data){
			var ajaxOptions = {
				url : '_ah/api/userendpoint/v1/user/doLogin',
				callback : this.loginSucceded, 
				errorCallback : this.somethingBadHappend,
				context : this,
				dataType: 'json',
				contentType: 'application/json',
				type : 'POST',
				data : JSON.stringify(data)
				
			};
			Sandbox.doPost(ajaxOptions);
		},
		loginSucceded : function(response){
			console.log('In loginSucceded');
			console.log(response);
			this.userInfo = this.normalizeUserData(response);
			this.hide();
			this.addInSession();
			this.startApp();
		},
		startApp : function(){
			Sandbox.publish('LOGIN:SUCCESS', {data : this.userInfo});
		},
		somethingBadHappend : function(){
			console.log('Something bad happened, find out who did that and kill them');
		},
		hide : function(){
			$(this.el).hide();
		},
		//TODO : Normalize data from different services in one common format
		normalizeUserData : function(data){
			return data;
		},
		addInSession : function(){
			localStorage.setItem('loggedInUser',JSON.stringify( this.userInfo));
		},
		getFromSession : function(){
			return localStorage.getItem('loggedInUser');
		}
	});
	
	return LoginView;
	
});

