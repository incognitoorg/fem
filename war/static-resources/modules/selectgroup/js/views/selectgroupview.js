define(function(require) {
	var Backbone = require('backbone');
	var Sandbox = require('sandbox');

	var user = require('components/login/login');
	
	var SelectGroupView = Sandbox.View.extend({
		initialize : function(options) {
			this.options = _.extend({
			//defaults here
			}, options);
			this.render();
			this.getGroups();
		},
		template : Handlebars.compile(require('text!./../../templates/selectgrouptemplate.html')),
		render : function(data) {
			//$(this.el).html(this.template(data));
		},
		getGroups : function(){
			var data = {
				url : '_ah/api/userendpoint/v1/user/' + user.getInfo().userId + '/group',
				callback : this.renderGroups,
				context : this,
				dataType: 'json',
			};
			Sandbox.doGet(data);
		},
		renderGroups : function(data){
			console.log(data);
			$(this.el).html(this.template(data));
		},
		reInitialize : function(){
			this.getGroups();
		}
	});

	return SelectGroupView;

});