define(function(require){
	var Backbone = require('backbone');
	var Foundation = require('css!libraries/foundation/css/normalize.css');
	var Foundation = require('css!libraries/foundation/css/foundation');
	var CSS = require('css!./../../css/fem.css');
	
	var femView = Backbone.View.extend({
		initialize : function(options){
			console.log
			this.render();
			this.makeResponsive();
			this.eventShowView('js-dashboard');
		},
		template : Handlebars.compile(require('text!../../templates/femtemplate.html')),
		render : function(){
			$(this.el).html(this.template())
		},
		events : {
			'click .js-menu' : 'eventShowView',
			'click .js-back-to-menu' : 'eventShowMenu'
		},
		eventShowView : function(event){
			var clickedMenu = (event.currentTarget && $(event.currentTarget).data('menu')) ||event
			//var clickedMenu = $(event.currentTarget).data('menu');
			this.$('.js-view-item').hide();
			this.$('.' + clickedMenu).show();
			this.$('.js-left-side-menu').addClass('hide-for-small').removeClass('hide-for-large');
			this.$('.js-right-panel').removeClass('hide-for-small').addClass('hide-for-large');
		},
		eventShowMenu : function(){
			this.$('.js-left-side-menu').removeClass('hide-for-small').addClass('hide-for-large');
			this.$('.js-right-panel').addClass('hide-for-small').removeClass('hide-for-large');
		},
		makeResponsive : function(){
			this.$('.js-left-side-menu p').height(parseInt(this.$('.js-left-side-menu').height()/6)-1);
		}
	});
	return femView;
})
