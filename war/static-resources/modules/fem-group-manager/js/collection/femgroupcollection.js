define(function(require) {
	
	var Backbone=require('backbone');
	var FEMGroupModel = require('./../model/femgroupmodel');
	
	var FEMGroupCollection = Backbone.Collection.extend({
		
		model : FEMGroupModel
		
	});
	return FEMGroupCollection;
});