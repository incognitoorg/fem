define(function(require) {
	var Sandbox = require('sandbox');

	var login = require('components/login/login');
	var user = login.getInfo();
	
	var DashboardView = Sandbox.View.extend({
		initialize : function(options) {
			this.options = _.extend({
			//defaults here
			}, options);
			this.render();
			this.getDashboardData();
		},
		template : Handlebars
				.compile(require('text!./../../templates/dashboardtemplate.html')),
		render : function(data) {
			$(this.el).html(this.template(data));
		},
		getDashboardData : function(){
			Sandbox.doGet({
				url : '_ah/api/userendpoint/v1/user/' + user.userId +'/group',
				callback : this.renderDashboard,
			});
		},
		renderDashboard : function(response){
			var groups = response.items;
			var userId = user.userId;
			console.log('groups', groups);
			
			
			var payers = {};
			var owers = {};
			var allMembers = {};
			for ( var i = 0; i < groups.length; i++) {
				var group = groups[i];
				var members = group.members;
				var iouList = group.iouList;
				
				var groupMembersMap = {};
				
				if(!iouList){
					continue;
				}
				
				for ( var j = 0; j < iouList.length; j++) {
					var iou = iouList[j];
					if(iou.fromUserId===userId){
						if(iou.amount>0){
							payers[iou.toUserId] = payers[iou.toUserId] || {amount : 0};
							payers[iou.toUserId].amount += iou.amount;
						} else {
							owers[iou.toUserId] = owers[iou.toUserId] || {amount : 0};
							owers[iou.toUserId].amount += iou.amount;
						}
						
					} else if(iou.toUserId===userId){
						if(iou.amount>0){
							payers[iou.fromUserId] = payers[iou.toUserId] || {amount : 0};
							payers[iou.fromUserId].amount += iou.amount;
						} else {
							owers[iou.fromUserId] = owers[iou.fromUserId] || {amount : 0};
							owers[iou.fromUserId].amount += iou.amount;
						}
					}
				}
				
				for ( var memberCount = 0; memberCount < members.length; memberCount++) {
					var member = members[memberCount];
					groupMembersMap[member.userId] = member;
				}
				
				_.extend(allMembers, groupMembersMap);
				
			}
			
			console.log('payers', payers);
			console.log('owers', owers);
			console.log('allMembers', allMembers);
			
			for(payerIndex in payers){
				var payer = payers[payerIndex];
				var memberInfo = allMembers[payerIndex];
				
				this.$('.js-payers').append($('<div>').html(memberInfo.fullName + " : " + payer.amount));
			}
			
			for(owerIndex in owers){
				var ower = owers[owerIndex];
				var memberInfo = allMembers[owerIndex];
				
				this.$('.js-owers').append($('<div>').html(memberInfo.fullName + " : " + ower.amount));
			}
			
		}
	});
	return DashboardView;

});