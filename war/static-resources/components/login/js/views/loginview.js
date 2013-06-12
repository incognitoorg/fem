define(function(require){
	var Normalize = require('css!libraries/foundation/css/normalize.css');
	
	var Sandbox = require('sandbox');
	
	var FBAPI = require('components/fbapi/fbapi');
	var GoogleAPI = require('components/googleapi/googleapi');
	
	var APIMapper = {
			facebook : FBAPI,
			google : GoogleAPI
	};
	
	var LoginView = Backbone.View.extend({
		initialize : function(options){
			$('#mask').html('Checking if logged in....');
			var userInfo = this.getFromSession();
			if(userInfo && JSON.parse(userInfo)){
				$('#mask').html('Logging in....');
				this.userInfo = JSON.parse(userInfo);
				this.startApp(userInfo);
				this.hide();
				return;
			}
			this.options = _.extend({
				//defaults here
			}, options);
			this.render();
			this.show();
			hideMask();
		},
		render : function(){
			//$(this.el).html(this.template());
		},
		events : {
			'click .facebook' : 'eventDoFacebookLogin',
			'click .google' : 'eventDoGoogleLogin'
			
		},
		eventDoFacebookLogin : function(options){
			var self = this;
			FBAPI.checkAndDoLogin({callback : function(data){
				self.addToUser({facebook:data.data});
				if(options && options.userInfo){
					data.userId = options.userInfo.userId;
				}
				if(options && options.callback){
					options.callback.call(options.context, {loginType : 'facebook', data : data});
				} else {
					this.doActualLogin.call(this, data);
				}
			}, context : this});
		},
		eventDoGoogleLogin : function(options){
		    var self = this;
			GoogleAPI.checkAndDoLogin({callback : function(data){
			    self.addToUser({google:data.data});
				if(options && options.userInfo){
					data.userId = options.userInfo.userId;
				}

				if(options && options.callback){
					options.callback.call(options.context,  {loginType : 'google', data : data});
				} else {
					this.doActualLogin.call(this, data);
				}
			}, context : this});
		},
		doActualLogin : function(data){
			showMask('Logging you in...');
			document.getElementById('logincontainer').setAttribute('style', 'display:none;');

			var ajaxOptions = {
				url : '_ah/api/userendpoint/v1/user/doLogin',
				callback : function(response){
					if(data.callback){
						data.callback.call(this, response);
					} else {
						this.loginSucceded.call(this, response);
					}
				}, 
				errorCallback : this.somethingBadHappend,
				context : this,
				dataType: 'json',
				contentType: 'application/json',
				type : 'POST',
				data : JSON.stringify(data)
				
			};
			Sandbox.doPost(ajaxOptions);
		},
		loginSucceded : function(response){

			console.log('In loginSucceded');
			console.log(response);
			
			
			
			this.userInfo = this.normalizeUserData(response);
			this.userInfo[response.loginType]=this.userInfo[response.loginType] || {}; 
			this.userInfo[response.loginType].authToken = APIMapper[response.loginType].getAuthToken();
			this.hide();
			this.addInSession();
			hideMask();
			this.startApp();
		},
		startApp : function(){
			Sandbox.publish('LOGIN:SUCCESS', {data : this.userInfo});
		},
		somethingBadHappend : function(){
			console.log('Something bad happened, find out who did that and kill them');
		},
		hide : function(){
			$(this.el).hide();
		},
		show : function(){
			$(this.el).show();
		},
		//TODO : Normalize data from different services in one common format
		normalizeUserData : function(data){
			return data;
		},
		addInSession : function(){
			localStorage.setItem('loggedInUser',JSON.stringify( this.userInfo));
		},
		getFromSession : function(){
			return localStorage.getItem('loggedInUser');
		},
		addToUser : function(data){
		    var userInfo = JSON.parse(this.getFromSession());
		    this.userInfo = $.extend(userInfo, data);
		    this.addInSession(userInfo);
		},
		getUserInfo : function(){
			return JSON.parse(this.getFromSession());
		}
	});
	
	return LoginView;
	
});

