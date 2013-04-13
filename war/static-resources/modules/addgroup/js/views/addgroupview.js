define(function(require) {

	require('jquery');
	var Sandbox = require('sandbox');
	var FBAPI = require('components/fbapi/fbapi');
	var GoogleAPi = require('components/googleapi/googleapi');
	var userInfo = require('components/login/login').getInfo();
	var FormValidator = require("./../validator/addgroupvalidator");
	require('http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js');
	require('css!libraries/jquery-ui/css/themes/base/jquery.ui.autocomplete.css');
	require('css!../../css/addgroup.css');

	var FEMAddGroupView = Sandbox.View.extend({
		initialize : function(options){
			this.FBAuthToken=FBAPI.getAuthToken();
			this.render();
			this.pluginInitializer();
			this.registerValidator();
			this.initializeSubComponents();
		},
		template : Handlebars.compile(require('text!./../../templates/addgrouptemplate.html')),
		render : function(){
			console.log('userInfo',userInfo);
			
			$(this.el).html(this.template());
			
			var loginType = userInfo.loginType;
			
			
			this.$('.js-fb-autocomplete').css('display', loginType==='facebook'?'':'none');
			this.$('.js-fb-login').css('display', loginType!='facebook'?'':'none');
			this.$('.js-google-autocomplete').css('display', loginType==='google'?'':'none' );
			this.$('.js-google-login').css('display',  loginType!=='google'?'':'none');
			
		},
		pluginInitializer : function(){
			var self=this;
			this.$('.js-fb-friend-selector').autocomplete({
				source: (function(){
					var isDataObtained = false;
					var dataObtained = [];
					return function(request, add) {
						$this = $(this);
						var element = this.element;
						
						function filterData(data, query){
							var formatted = [];
							for(var i = 0; i< data.length; i++) {
								console.log(data[i]);
								console.log(data[i].name);
								if (data[i].name.toLowerCase().indexOf($(element).val().toLowerCase()) >= 0)
									formatted.push({
										label: data[i].name,
										value: data[i]
									});
							}
							return formatted;
						}
					
						if(!isDataObtained){
							// Call out to the Graph API for the friends list
							$.ajax({
								url: 'https://graph.facebook.com/me/friends?method=get&access_token=' + self.FBAuthToken + '&pretty=0&sdk=joey',
								dataType: "jsonp",
								success: function(results){
									isDataObtained = true;
									dataObtained = results.data;
									// Filter the results and return a label/value object array  
									var formatted = filterData(results.data);
									add(formatted);
								}
							});
						} else {
							var formatted = filterData(dataObtained);
							add(formatted);
						}
					};
				}()),
				select: function(event, ui) {
					// Fill in the input fields
					//self.$('.js-friend-selector').val(ui.item.label);
					self.$('.js-fb-friend-selector').val('').focus();
					var friendInfo = ui.item.value;
					var normalizedFriendInfo = {
						'fullName' : friendInfo.name,
						'name' : friendInfo.name,
						facebookId : friendInfo.id,
						loginType : 'facebook'
					};
					self.addFriendToGroup(normalizedFriendInfo);
					return false;
				},
				minLength:3
			});
			
			
			var googleAccessToken = GoogleAPi.getAuthToken();
			this.$('.js-google-friend-selector').autocomplete({
				source: (function(){
					var isDataObtained = false;
					var dataObtained = [];
					return function(request, add) {
						$this = $(this);
						var element = this.element;
						
						function filterData(data, query){
							var formatted = [];
							for(var i = 0; i< data.length; i++) {
								console.log(data[i]);
								console.log(data[i].name);
								if (data[i].title.$t.toLowerCase().indexOf($(element).val().toLowerCase()) >= 0)
									formatted.push({
										label: data[i].title.$t,
										value: data[i]
									});
							}
							return formatted;
						}
					
						
						if(!isDataObtained){
							// Call out to the Graph API for the friends list
							$.ajax({
								url: "https://www.google.com/m8/feeds/contacts/default/full?alt=json&max-results=9999",
				                dataType: "jsonp",
				                headers: "GData-Version: 3.0",
				                data:{access_token: googleAccessToken},
								success: function(results){
									isDataObtained = true;
									dataObtained = results.feed.entry;
									// Filter the results and return a label/value object array  
									var formatted = filterData(dataObtained);
									add(formatted);
								}
							});
						} else {
							var formatted = filterData(dataObtained);
							add(formatted);
						}
					};
				}()),
				select: function(event, ui) {
					// Fill in the input fields
					//self.$('.js-friend-selector').val(ui.item.label);
					self.$('.js-google-friend-selector').val('').focus();
					
					var friendInfo = ui.item.value;
					var normalizedFriendInfo = {
						fullName : friendInfo.title.$t,
						name : friendInfo.title.$t,
						googleId : '',
						loginType : 'google'
					};
					
					self.addFriendToGroup(normalizedFriendInfo);
					return false;
				},
				minLength:3
			});
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			this.$('span.ui-helper-hidden-accessible').hide();
		},
		initializeSubComponents : function(){
			var self=this;
			require(['modules/friendmanager/friendmanager'],function(FEMFriendManager){
				self.friendManager = FEMFriendManager.getInstance().initialize();
				self.friendCollection = new self.friendManager.friendCollection();
			});
		},
		events : {
			'click .js-add-friend'						:	'eventAddFriend',
			'click .js-invite-friend'					:	'eventInviteFriend',
			'click .js-selected-friend-item-remove'		:	'eventRemoveSelectedFriend',
			'click .js-save-group'						:	'eventSaveGroup'
		},
		registerValidator : function(){
			FormValidator.initialize({'element':this.$(".js-add-group-form"),'errorWidth':'86%'});
		},
		renderSelectedFriends : function(friendModel){
			this.$('.js-selected-friends-list').append(this.friendManager.friendTemplate(friendModel));
		},
		addFriendToGroup : function(friendInfo){
			
			
			console.log('friendInfo',friendInfo);
			
			var info = {'fullName':friendInfo.fullName, 'name' :friendInfo.name,  facebookId : friendInfo.facebookId, loginType : friendInfo.loginType};
			
			this.$('.js-selected-friends').show();
			this.friendModel = new this.friendManager.friendModel(info);
			this.friendCollection.add(this.friendModel);
			this.renderSelectedFriends(this.friendModel);
		},
		eventInviteFriend : function(event){
			this.addFriendToGroup(this.$('.js-invite-friend-mail').val());
			this.$('.js-invite-friend-mail').val('');
		},
		eventRemoveSelectedFriend : function(event){
			var removeFriend=$(event.currentTarget).parent('.js-selected-friend-remove-container').find('.js-selected-friend-remove-name').html();
			$(event.currentTarget).parents('.js-selected-friend-item').remove();
			this.friendCollection.remove(this.friendCollection.where({name : removeFriend}));
		},
		eventSaveGroup : function(){
			
			if(!$('.js-add-group-form').valid()){
				return;
			}
			
		    var self = this;
			var groupModel = new this.model({
				'groupName' 		: 	this.$('.js-group-name').val(),
				'members'	:	(function(){
				    var membersArray = [];
				    _.each(self.friendCollection.models, function(el){
				    	membersArray.push(el.attributes); 
				    });
				    membersArray.push(userInfo);
				    return membersArray;
				})(),
				'groupOwnerId' : userInfo.userId
			});
			console.log('this.collection',this.collection);
			var addAjaxOptions = {
					url : '_ah/api/groupendpoint/v1/group',
					callback : this.groupAddedSuccessFully, 
					errorCallback : this.somethingBadHappend,
					context : this,
					data : JSON.stringify(groupModel.attributes)
				};
			Sandbox.doAdd(addAjaxOptions);
			Sandbox.publish('fem-newGroupCreated',this.model.attributes);
		},
		groupAddedSuccessFully : function(){
			console.log('Yeyy, Group added successfully. Now go add some expenses.');
		}
	});
	return FEMAddGroupView;
});