define(function(require){
	var Normalize = require('css!libraries/foundation/css/normalize.css');
	var Foundation = require('css!libraries/foundation/css/foundation');
	
	var Sandbox = require('sandbox');
	var CSS = require('css!./../../css/login.css');
	
	var FBAPI = require('components/fbapi/fbapi');
	var GoogleAPI = require('components/googleapi/googleapi');
	
	var LoginView = Backbone.View.extend({
		initialize : function(options){
			this.options = _.extend({
				//defaults here
			}, options);
			this.render();
		},
		template : Handlebars.compile(require('text!../../templates/loginform.html')),
		render : function(){
			$(this.el).html(this.template());
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
			Sandbox.doAjax(ajaxOptions);
		},
		loginSucceded : function(response){
			console.log('In loginSucceded');
			console.log(response);
			this.userInfo = this.normalizeUserData(response);
			this.hide();
			Sandbox.publish('LOGIN:SUCCESS', {data : this.normalizeUserData(response)});
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
		}
	});
	
	return LoginView;
	
});

