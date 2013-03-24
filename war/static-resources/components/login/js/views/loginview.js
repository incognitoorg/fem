define(function(require){
	var Backbone = require('backbone');
	var Normalize = require('css!libraries/foundation/css/normalize.css');
	var Foundation = require('css!libraries/foundation/css/foundation');
	
	var Facade = require('facade');
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
			FBAPI.checkAndDoLogin({callback : this.loginSucceded, context : this});
		},
		eventDoGoogleLogin : function(){
			GoogleAPI.checkAndDoLogin({callback : this.loginSucceded, context : this});
		},
		loginSucceded : function(response){
			console.log('In loginSucceded');
			console.log(response);
			this.hide();
			Facade.publish('LOGIN:SUCCESS', {data : this.normalizeUserData(response)});
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

