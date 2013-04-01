define(function(require) {

	var LoginView = require('./js/views/loginview');


	return {
		initialize : function(options) {
			this.view = new LoginView(options);
		},
		getInfo : function(){
			return this.view.userInfo;
		}
	};

});

