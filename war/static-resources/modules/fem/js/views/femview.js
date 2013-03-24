define(function(require){
	var Backbone = require('backbone');
	var Foundation = require('css!libraries/foundation/css/normalize.css');
	var Foundation = require('css!libraries/foundation/css/foundation');
	var CSS = require('css!./../../css/fem.css');
	var AppRouter = require('./../router/femrouter');
	var Facade = require('facade');
	
	var femView = Backbone.View.extend({
		initialize : function(options){
			this.registerSubscribers();
			/*this.render();
			this.menulength = this.$('.js-menu').length;
			this.makeResponsive();
			this.router = new AppRouter({view : this});
			
			Backbone.history.start();

			this.router.navigate('#menu');

			this.eventShowView('js-dashboard');*/
			
			
		},
		registerSubscribers : function(){
			Facade.subscribe('LOGIN:SUCCESS',this.start,this);
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
			//var clickedMenu = $(event.currentTarget).data('menu');
			this.$('.js-view-item').hide();
			this.$('.' + clickedMenu).show();
			this.$('.js-left-side-menu').addClass('hide-for-small').removeClass('hide-for-large');
			this.$('.js-right-panel').removeClass('hide-for-small').addClass('hide-for-large');
			var navLink = clickedMenu.toLowerCase().split('-').join('');
			this.router.navigate("#"+navLink.substring(2,navLink.length));
		},
		eventShowMenu : function(){
			this.$('.js-left-side-menu').removeClass('hide-for-small').addClass('hide-for-large');
			this.$('.js-right-panel').addClass('hide-for-small').removeClass('hide-for-large');
			this.router.navigate("#menu");
		},
		makeResponsive : function(){
			this.$('.js-left-side-menu p').height(parseInt(this.$('.js-left-side-menu').height()/this.menulength)-1);
		},
		start : function(){
			this.render();
			this.menulength = this.$('.js-menu').length;
			this.makeResponsive();
			this.router = new AppRouter({view : this});
			
			Backbone.history.start();

			this.router.navigate('#menu');

			this.eventShowView('js-dashboard');
		}
	});
	return femView;
});
