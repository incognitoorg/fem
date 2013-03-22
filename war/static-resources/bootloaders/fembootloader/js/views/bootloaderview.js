define(function(require) {
	"use strict";
	var Backbone = require('backbone');
	var Handlebars = require('handlebars');
	var fbgraphImplementer = require('components/fbgraph-implementer/fbgraph-implementer');
	var FEM = require('modules/fem/fem');
	
	var facebookAPIInstance;
	var BootloaderView = Backbone.View.extend({
		initialize : function(options){
			facebookAPIInstance=fbgraphImplementer.getInstance();
			facebookAPIInstance.initialize();
			this.render(options);
			FEM.getInstance().initialize({el:this.$('.js-fem-container')});	
		},
		template : Handlebars.compile(require('text!./../../templates/bootloadertemplate.html')),
		render : function(data){
			$(this.el).html(this.template(data));
		},
		events : {
			'click .loginbutton' : 'doLogin',
			'click .logoutbutton' : 'doLogout'
		},
		doLogin : function(){
			facebookAPIInstance.checkAndDoLogin();
			//FEM.getInstance().initialize({el:this.$('.js-fem-container')});	
		},
		doLogout : function(){
			facebookAPIInstance.checkAndDoLogout();
		}
	});
	
	return BootloaderView;
});