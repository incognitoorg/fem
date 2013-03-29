define(function(require) {
	"use strict";
	require('jquery');
	var Backbone = require('backbone');
	var Handlebars = require('handlebars');
	var Login = require('components/login/login');
	var FEM = require('modules/fem/fem');
	
	var BootloaderView = Backbone.View.extend({
		initialize : function(options){
			this.render(options);
			Login.getInstance().initialize({el:this.$('.js-login-container')});
			FEM.getInstance().initialize({el:this.$('.js-fem-container')});
		},
		template : Handlebars.compile(require('text!./../../templates/bootloadertemplate.html')),
		render : function(data){
			$(this.el).html(this.template(data));
		}
	});
	
	return BootloaderView;
});


