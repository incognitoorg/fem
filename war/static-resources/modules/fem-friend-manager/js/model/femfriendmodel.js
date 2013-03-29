define(function(require) {
	"use strict";
	
	var Backbone = require('backbone');
	
	var FEMFreindModel = Backbone.Model.extend({
		
		defaults :{
			'name' 		: 		'',
			'email' 	: 		'',
			'income'	:		'',
			'expenses'	:		'',
			'owes'		:		[{'name':'','amount':''},{'name':'','amount':''}],
			'owed'		:		[{'name':'','amount':''},{'name':'','amount':''}]
			
		}
	});
	return FEMFreindModel;
});