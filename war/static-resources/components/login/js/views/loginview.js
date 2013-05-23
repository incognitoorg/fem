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
			var userInfo = this.getFromSession();
			if(userInfo && JSON.parse(userInfo)){
				this.userInfo = JSON.parse(userInfo);
				this.startApp(userInfo);
				document.getElementById('js-loader').setAttribute('style', 'display:none');
				this.hide();
				return;
			}
			this.options = _.extend({
				//defaults here
			}, options);
			this.render();
		},
		render : function(){
			//$(this.el).html(this.template());
		},
		events : {
			'click .facebook' : 'eventDoFacebookLogin',
			'click .google' : 'eventDoGoogleLogin'
			
		},
		eventDoFacebookLogin : function(options){
			FBAPI.checkAndDoLogin({callback : function(data){
				if(options && options.userInfo){
					data.userId = options.userInfo.userId;
				}
				this.doActualLogin.call(this, data);
			}, context : this});
		},
		eventDoGoogleLogin : function(options){
			GoogleAPI.checkAndDoLogin({callback : function(data){
				if(options && options.userInfo){
					data.userId = options.userInfo.userId;
				}
				this.doActualLogin.call(this, data);
			}, context : this});
		},
		doActualLogin : function(data){
			var heightForLoader = document.getElementById('login').offsetHeight;
			document.getElementById('logincontainer').setAttribute('style', 'display:none;');
			document.getElementById('js-loader').setAttribute('style', 'height:'+ heightForLoader +'px');

			var ajaxOptions = {
				url : '_ah/api/userendpoint/v1/user/doLogin',
				callback : this.loginSucceded, 
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
			document.getElementById('js-loader').setAttribute('style', 'display:none');

			console.log('In loginSucceded');
			console.log(response);
			
			
			
			this.userInfo = this.normalizeUserData(response);
			this.userInfo[response.loginType]=this.userInfo[response.loginType] || {}; 
			this.userInfo[response.loginType].authToken = APIMapper[response.loginType].getAuthToken();
			this.hide();
			this.addInSession();
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
		//TODO : Normalize data from different services in one common format
		normalizeUserData : function(data){
			return data;
		},
		addInSession : function(){
			localStorage.setItem('loggedInUser',JSON.stringify( this.userInfo));
		},
		getFromSession : function(){
			return localStorage.getItem('loggedInUser');
		}
	});
	
	return LoginView;
	
});

