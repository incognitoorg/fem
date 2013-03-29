define(function(require) {
	
	var FEMAddGroupView = require('./js/views/femaddgroupview');
	
	return {
		getInstance : function(){
			return {
				initialize : function(options){
					this.view = new FEMAddGroupView(options);
				}
			};
		}
	};
	
});