define(function(require) {
	"use strict";
	
	var FEMFriendCollection = require('./js/collection/femfriendcollection');
	var FEMFriendModel = require('./js/model/femfriendmodel');
	var FEMFriendTemplate = Handlebars.compile(require('text!./templates/femfriendtemplate.html'));
	
	return {
		getInstance : function(){
			return {
				initialize : function(){
					return {
						'friendModel' 		: 	FEMFriendModel,
						'friendCollection'	: 	FEMFriendCollection,
						'friendTemplate'	:	FEMFriendTemplate
					};
				}
			};
		}
	};
	
});