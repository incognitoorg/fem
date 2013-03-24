define(function(require) {

	var LoginView = require('./js/views/loginview');
	
	return {
		getInstance : function() {
			return {
				initialize : function(options) {
					this.view = new LoginView(options);
				}
			};
		}
	};
	
});

