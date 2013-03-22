define(function(require){
	var Backbone = require('backbone');
	var Normalize = require('css!libraries/foundation/css/normalize.css');
	var Foundation = require('css!libraries/foundation/css/foundation');
	var CSS = require('css!./../../css/loginform.css');
	
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
		}
	});
	
	return LoginView;
	
});

