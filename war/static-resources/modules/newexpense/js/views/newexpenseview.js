define(function(require) {
	var Backbone = require('backbone');

	var NewExpenseView = Backbone.View.extend({
		initialize : function(options) {
			this.options = _.extend({
			//defaults here
			}, options);
			this.render();
		},
		tempalate : Handlebars.compile(require('text!./../../templates/newexpense.html')),
		render : function(data) {
			$(this.el).html(this.template(data));
		}
	});
	
	return NewExpenseView;

});