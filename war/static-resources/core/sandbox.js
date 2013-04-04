"use strict";
define(['mediator', 'http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js', 'locallayer'], function (mediator, modernizer) {

	
	var isSyncEnabled = false;
	
	var Sandbox = {};
	Sandbox.subscribe = function (channel, /*subscriber,*/ callback, context) {
		return mediator.subscribe(channel, /*subscriber,*/ callback, context || this);
	};

	Sandbox.publish = function (channel) {
		mediator.publish.apply(mediator, arguments);
	};

	Sandbox.registerChildren = function(children, parent){
		mediator.registerChildren.apply(mediator, arguments);
	};
	
	Sandbox.destroy = function(component){
		mediator.destroy.apply(mediator, arguments);
	};
	
	Sandbox.doAjax = function(options){
		var prefix = '';
		//prefix = "https://fem1-vishwanath.appspot.com/";
		//prefix = "http://localhost:8888/";
		
		var url = prefix+options.url;
		var type = options.type;
		var contentType = options.contentType;
		var dataType = options.dataType;
		var callback = options.callback;
		var errorCallback = options.errorCallback;
		var context = options.context;
		var data = options.data;
		
		$.ajax({
		  'url':url,
		  'type': type, 
		  'contentType':contentType,
		  'dataType': dataType,
		  'data' : data,
		  'success': function(response){
			  
			  if(response.data){
				  var data = response.data;
				 if(response.status==="success"){
					 callback.call(context, data);
				 }else if(response.status==="fail"){
					 errorCallback.call(context, data);
				 }else if(response.status==="error"){
					 errorCallback.call(context, response.message);
				 } 
			  }else{
				  callback.call(context, response);
			  }
			  
		  },
		  'error': function(response){
			  errorCallback.call(context, response);
			  
		  }
		});
	};
	
	
	Sandbox.View = Backbone.View;
	Sandbox.Model = Backbone.Model;
	Sandbox.Collection = Backbone.Collection;
	Sandbox.Router = Backbone.Router;
	Sandbox.History = Backbone.History;
	

	Sandbox.doUpdate= function(data){
		if(Modernizr.localstorage && isSyncEnabled){
			loallayer.doUpdate(data);
		} else {
			this.doAjax(data);
		}
	};
	
	Sandbox.doGet = function(data){
		if(Modernizr.localstorage && isSyncEnabled){
			loallayer.doUpdate(data);
		} else {
			this.doAjax(data);
		}
	};
	
	Sandbox.doDelete = function(data){
		if(Modernizr.localstorage && isSyncEnabled){
			loallayer.doDelete(data);
		} else {
			this.doAjax(data);
		}
	};
	
	Sandbox.doAdd = function(data){
		if(Modernizr.localstorage && isSyncEnabled){
			loallayer.doAdd(data);
		} else {
			
			var data = _.extend(data, {
					dataType: 'json',
					contentType: 'application/json',
					type : 'POST'
			});
			
			this.doAjax(data);
		}
	};
	
	Sandbox.doSync = function(){
		
	};
	
	
	return Sandbox;

});