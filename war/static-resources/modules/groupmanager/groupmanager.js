define(function(require) {
	
	var FEMGroupCollection = require('./js/collection/groupcollection');
	var FEMGroupModel = require('./js/model/groupmodel');

	return {
		getInstance : function(){
			return {
				initialize : function(options){
					this.collection = new FEMGroupCollection();
					if(options.moduleName==='js-create-group'){
						this.createGroup(options);
					}else {
						this.editGroup(options);
					}
				},
				createGroup : function(options){
					console.log('inside createGroup function',options);
					var that=this;
					require(['modules/addgroup/addgroup'],function(FEMAddGroupModule){
						FEMAddGroupModule.getInstance().initialize({'el':options.element,'model':FEMGroupModel,'collection':that.collection});
					});
				},
				editGroup : function(options){
					
				},
				getGroups : function(){
					
				}
			};
		}
	};
	
});