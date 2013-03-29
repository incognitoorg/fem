define(function(require) {
	
	var Facade = require('facade');
	
	//Module path mapper for requiring module dynamically
	var componentPathMapper = {
		'js-create-group'		:		'modules/fem-group-manager/fem-group-manager',
		'js-edit-group'			:		'modules/fem-group-manager/fem-group-manager',
		'js-new-expense'		:		'',
		'js-expense-history'	:		'',
		'js-dashboard'			:		'',
		'js-profile'			:		''
	};
	
	//Hardcoded for avoiding error since these components are not created yet. No logical use of the below code.
	//Used to just further the flow without errors. Can be removed once all the components have been created.
	this.femDashboard={};
	this.femProfile={};
	this.femCreateExpense={};
	this.femEditExpense={};
	
	//Module instance mapper for identifying component
	var componentMapper = {
		'js-create-group'		:	this.femCreateGroup,
		'js-edit-group'			:	this.femEditGroup,
		'js-new-expense'		:	this.femCreateExpense,
		'js-expense-history'	:	this.femEditExpense,
		'js-dashboard'			:	this.femDashboard,
		'js-profile'			:	this.femProfile
	};
	
	return {
		getInstance : function(){
			return {
				initialize : function(){
					this.registerSubscribers();
				},
				registerSubscribers : function(){
					Facade.subscribe('fem-clickedMenu',this.initializeFEMComponent,this);
				},
				initializeFEMComponent : function(publishedData){
					console.log('publishedData',publishedData);
					if(!componentMapper[publishedData.clickedMenu]){
						require([componentPathMapper[publishedData.clickedMenu]],function(FEMComponent){
							componentMapper[publishedData.clickedMenu]=FEMComponent.getInstance();
							componentMapper[publishedData.clickedMenu].initialize({'moduleName':publishedData.clickedMenu,'element':publishedData['element']});
						});
					}else {
						$(publishedData['element']).show();
					}
				}
			};
		}
	};
	
});