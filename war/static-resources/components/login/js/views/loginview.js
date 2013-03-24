define(function(require){
	var Backbone = require('backbone');
	var Normalize = require('css!libraries/foundation/css/normalize.css');
	var Foundation = require('css!libraries/foundation/css/foundation');
	
	var Facade = require('facade');
	var CSS = require('css!./../../css/login.css');
	
	var FBGraph = require('components/fbgraph-implementer/fbgraph-implementer');
	
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
			'click .facebook' : 'eventDoFacebookLogin'
		},
		eventDoFacebookLogin : function(){
			FBGraph.checkAndDoLogin({callback : this.loginSucceded, context : this});
		},
		loginSucceded : function(response){
			console.log('In loginSucceded');
			console.log(response);
			this.hide();
			Facade.publish('LOGIN:SUCCESS', {type : 'facebook', data : response});
		},
		hide : function(){
			$(this.el).hide();
		}
	});
	
	return LoginView;
	
});

