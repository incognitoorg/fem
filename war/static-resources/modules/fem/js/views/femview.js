define(function(require){
	var Backbone = require('backbone');
	var Foundation = require('css!libraries/foundation/css/foundation');
	//var Foundation = require('libraries/foundation/js/foundation/foundation');
	
	var femView = Backbone.View.extend({
		initialize : function(options){
			this.render();
			
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
			this.$('.left-side-menu').addClass('hide-for-small');
			this.$('.right-panel').removeClass('hide-for-small');
		},
		eventShowMenu : function(){
			this.$('.left-side-menu').removeClass('hide-for-small');
			this.$('.right-panel').addClass('hide-for-small');
		}
	});
	return femView;
})
