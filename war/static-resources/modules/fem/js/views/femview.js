define(function(require){
	
	require('css!libraries/foundation/css/normalize.css');
	require('css!libraries/foundation/css/foundation');
	require('css!./../../css/fem.css');
	var Backbone = require('backbone');
	var AppRouter = require('./../router/femrouter');
	var FEMComponentManager = require('modules/femcomponentmanager/femcomponentmanager');
	var Sandbox = require('sandbox');
	
	
	var FEMView = Sandbox.View.extend({
		initialize : function(options){
			this.registerSubscribers();
			FEMComponentManager.getInstance().initialize();
		},
		registerSubscribers : function(){
			Sandbox.subscribe('LOGIN:SUCCESS',this.start,this);
			Sandbox.subscribe('fem-newGroupCreated',this.redirectView,this);
		},
		template : Handlebars.compile(require('text!../../templates/femtemplate.html')),
		render : function(){
			$(this.el).html(this.template());
		},
		events : {
			'click .js-menu' : 'eventShowView',
			'click .js-back-to-menu' : 'eventShowMenu'
		},
		eventShowView : function(event){
			var clickedMenu = (event.currentTarget && $(event.currentTarget).data('menu')) ||event;
			this.$('.js-view-item').hide();
			this.$('.' + clickedMenu).show();
			this.$('.js-left-side-menu').addClass('hide-for-small');
			this.$('.js-right-panel').removeClass('hide-for-small');
			var navLink = clickedMenu.toLowerCase().split('-').join('');
			this.router.navigate("#"+navLink.substring(2,navLink.length));

			var componentElement = this.$('.'+clickedMenu);
			var dataToPublish = {
					'clickedMenu' : clickedMenu,
					'element' : componentElement
			};
			
			Sandbox.publish('fem-clickedMenu',dataToPublish);
		},
		eventShowMenu : function(){
			this.$('.js-left-side-menu').removeClass('hide-for-small');
			this.$('.js-right-panel').addClass('hide-for-small');
			this.router.navigate("#menu");
		},
		makeResponsive : function(){
			this.$('.js-left-side-menu p').height(parseInt(this.$('.js-left-side-menu').height()/this.menulength)-1);
		},
		start : function(userdata){
			this.render();
			this.menulength = this.$('.js-menu').length;
			//Trying to make height responsive. Experimental. May need to throw this away.
			this.makeResponsive();
			
			this.router = new AppRouter({view : this});
			Backbone.history.start();
			this.router.navigate('#menu');

			this.eventShowView('js-dashboard');
		},
		redirectView : function(data){
			console.log('data',data);
			this.eventShowView('js-dashboard');
		}
	});
	return FEMView;
});
