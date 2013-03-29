define(function(require) {
	
	var Backbone=require('backbone');
	var FEMFriendModel = require('./../model/femfriendmodel');
	
	var FEMFriendCollection = Backbone.Collection.extend({
		
		model : FEMFriendModel
		
	});
	return FEMFriendCollection;
});