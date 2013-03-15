define(function(require){
	var Backbone = require('backbone');
	
	var Foundation = require('css!libraries/foundation/css/foundation');
	var Foundation = require('libraries/foundation/js/foundation/foundation');
	
	var femView = Backbone.View.extend({
		initialize : function(options){
			this.render();
		},
		template : Handlebars.compile(require('text!../../templates/femtemplate.html')),
		render : function(){
			$(this.el).html(this.template())
		}
	});
	return femView;
})
