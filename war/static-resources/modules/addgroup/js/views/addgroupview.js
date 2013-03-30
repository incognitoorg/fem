define(function(require) {

	require('jquery');
	var Backbone = require('backbone');
	var Sandbox = require('sandbox');
	var FBAPI = require('components/fbapi/fbapi');
	require('http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js');
	require('css!libraries/jquery-ui/css/themes/base/jquery.ui.autocomplete.css');

	var FEMAddGroupView = Sandbox.View.extend({
		initialize : function(options){
			this.FBAuthToken=FBAPI.getAuthToken();
			this.render();
			this.pluginInitializer();
			this.initializeSubComponents();
		},
		template : Handlebars.compile(require('text!./../../templates/addgrouptemplate.html')),
		render : function(){
			$(this.el).html(this.template());
		},
		pluginInitializer : function(){
			var that=this;
			this.$('.js-friend-selector').autocomplete({
				source: function(request, add) {
					$this = $(this);
					// Call out to the Graph API for the friends list
					$.ajax({
						url: 'https://graph.facebook.com/me/friends?method=get&access_token=' + that.FBAuthToken + '&pretty=0&sdk=joey',
						dataType: "jsonp",
						success: function(results){
							// Filter the results and return a label/value object array  
							var formatted = [];
							for(var i = 0; i< results.data.length; i++) {
								if (results.data[i].name.toLowerCase().indexOf($(".js-friend-selector").val().toLowerCase()) >= 0)
								formatted.push({
									label: results.data[i].name,
									value: results.data[i].id
								});
							}
							add(formatted);
						}
					});
				},
				select: function(event, ui) {
					// Fill in the input fields
					that.$('.js-friend-selector').val(ui.item.label);
					// Prevent the value from being inserted in "#name"
					return false;
				},
				minLength:3
			});
			this.$('span.ui-helper-hidden-accessible').hide();
		},
		initializeSubComponents : function(){
			var that=this;
			require(['modules/friendmanager/friendmanager'],function(FEMFriendManager){
				that.friendManager = FEMFriendManager.getInstance().initialize();
				that.friendCollection = new that.friendManager.friendCollection();
			});
		},
		events : {
			'click .js-add-friend'						:	'eventAddFriend',
			'click .js-invite-friend'					:	'eventInviteFriend',
			'click .js-selected-friend-item-remove'		:	'eventRemoveSelectedFriend',
			'click .js-save-group'						:	'eventSaveGroup'
		},
		renderSelectedFriends : function(friendModel){
			this.$('.js-selected-friends-list').append(this.friendManager.friendTemplate(friendModel));
		},
		addFriendToGroup : function(name){
			this.$('.js-selected-friends').show();
			this.friendModel = new this.friendManager.friendModel({'name':name});
			this.friendCollection.add(this.friendModel);
			this.renderSelectedFriends(this.friendModel);
		},
		eventAddFriend : function(event){
			this.addFriendToGroup(this.$('.js-friend-selector').val());
			this.$('.js-friend-selector').val('');
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
			this.collection.add(new this.model({
				'name' 		: 	this.$('.js-group-name').val(),
				'members'	:	this.friendCollection
			}));
			console.log('this.collection',this.collection);
			Sandbox.publish('fem-newGroupCreated',this.collection);
		}
	});
	return FEMAddGroupView;
});