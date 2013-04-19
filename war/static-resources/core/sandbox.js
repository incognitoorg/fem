"use strict";
define(function (require) {

	var mediator = require('mediator'), 
	Mz = require('http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js'),
	EnvVariables = require('envvariables'),
	locallayer = require('locallayer');
	
	
	var isOffline = false;
	
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
		var prefix = EnvVariables.API_URL;
		console.log('url',options.url);
		
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
				  callback.call(context, response);
		  },
		  'error': function(response){
			  if(errorCallback){
				  errorCallback.call(context, response);
			  } else {
				  errorFallback.call(resposne, data);
			  }
			  
		  }
		});
	};
	
	
	
	function errorFallback(){
		console.log('Something bad happened while communicating with back end, you are on your own. Here is what I have for you.', reposne, data);
	}
	
	Sandbox.View = Backbone.View;
	Sandbox.Model = Backbone.Model;
	Sandbox.Collection = Backbone.Collection;
	Sandbox.Router = Backbone.Router;
	Sandbox.History = Backbone.History;
	

	Sandbox.doUpdate= function(data){
		if(Modernizr.localstorage && isOffline){
			locallayer.doUpdate(data);
		} else {
			this.doAjax(data);
		}
	};
	
	Sandbox.doGet = function(data){
	    var callback = data.callback;
		if(Modernizr.localstorage && isOffline){
			locallayer.doGet(data);
		} else {
			var extendedData = _.extend(data, {
				dataType: 'json',
				contentType: 'application/json',
				type : 'GET',
				callback : function(response){
					  var URL = data.url;
					  var endPointURL = URL.substr(URL.indexOf('endpoint'));
					  
					  var splits = endPointURL.split('/');
					  
					  var splits = splits.splice(2);
					  
					  var endPointType = splits[0];
					  
					  var typeOfEndPointObject = (localStorage.getItem(endPointType) && JSON.parse(localStorage.getItem(endPointType))) || {};
					  if(splits[1]){
						  var thisEndPoint = typeOfEndPointObject[splits[1]] = typeOfEndPointObject[splits[1]] || {};
					  }
					  if(splits[2]){
						  var thisEndPointInfo = thisEndPoint[splits[2]] = response;
					  }
					  localStorage.setItem(endPointType, JSON.stringify(typeOfEndPointObject));
					  
					  callback.call(data.context, response);
				}
			});
		
			this.doAjax(extendedData);
		}
	};
	
	Sandbox.doDelete = function(data){
		if(Modernizr.localstorage && isOffline){
			locallayer.doDelete(data);
		} else {
			this.doAjax(data);
		}
	};
	
	Sandbox.doAdd = function(data){
		var callback = data.callback;
		
		
		
		if(Modernizr.localstorage && isOffline){
			var URL = data.url;
			var endPointURL = URL.substr(URL.indexOf('endpoint'));
			
			var splits = endPointURL.split('/');
			
			var splits = splits.splice(2);
			
			var endPointType = splits[0];
			var dataToSend = data.data;
			var userId = dataToSend.ownerId;
			
			var storedAllUserData = JSON.parse(localStorage.getItem('user'));
			
			var storedUserData = storedAllUserData[userId];
			
			storedUserData[endPointType].items.push(dataToSend);
			
			console.log('storedUserData', storedUserData);
			
			localStorage.setItem('user', JSON.stringify(storedAllUserData));
			callback.call(data.context, data.data);
			//locallayer.doAdd(data);
		} else {
			
			var data = _.extend(data, {
					dataType: 'json',
					contentType: 'application/json',
					type : 'POST',
					data : JSON.stringify(data.data),
					callback : function(response){
						  var URL = data.url;
						  var endPointURL = URL.substr(URL.indexOf('endpoint'));
						  
						  var splits = endPointURL.split('/');
						  
						  var splits = splits.splice(2);
						  
						  var endPointType = splits[0];
						  var dataToSend = JSON.parse(data.data);
						  var userId = dataToSend.ownerId;
						  
						  var storedAllUserData = JSON.parse(localStorage.getItem('user'));
						  
						  var storedUserData = storedAllUserData[userId];
						  
						  storedUserData[endPointType].items.push(response);
						  
						  console.log('storedUserData', storedUserData);
						  
						  localStorage.setItem('user', JSON.stringify(storedAllUserData));
						  
						  callback.call(data.context, response);
					}
			});
			
			this.doAjax(data);
		}
	};
	
	Sandbox.doPost = function(data){
		if(Modernizr.localstorage && isOffline){
			locallayer.doPost(data);
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
//I dont like doing this, but this helps
var debugMode = false;