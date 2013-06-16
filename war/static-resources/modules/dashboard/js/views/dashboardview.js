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
			
			
			var owesToMe = {};
			var iOweToThem = {};
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
							owesToMe[iou.toUserId] = owesToMe[iou.toUserId] || {amount : 0};
							owesToMe[iou.toUserId].amount += iou.amount;
						} else {
							iOweToThem[iou.toUserId] = iOweToThem[iou.toUserId] || {amount : 0};
							iOweToThem[iou.toUserId].amount += iou.amount;
						}
						
					} else if(iou.toUserId===userId){
						if(iou.amount>0){
							owesToMe[iou.fromUserId] = owesToMe[iou.toUserId] || {amount : 0};
							owesToMe[iou.fromUserId].amount += iou.amount;
						} else {
							iOweToThem[iou.fromUserId] = iOweToThem[iou.fromUserId] || {amount : 0};
							iOweToThem[iou.fromUserId].amount += iou.amount;
						}
					}
				}
				
				for ( var memberCount = 0; memberCount < members.length; memberCount++) {
					var member = members[memberCount];
					groupMembersMap[member.userId] = member;
				}
				
				_.extend(allMembers, groupMembersMap);
				
			}
			
			console.log('owesToMe', owesToMe);
			console.log('iOweToThem', iOweToThem);
			console.log('allMembers', allMembers);
			
			
			
			
			function consolidateOwerPayers(owesToMe, iOweToThem){
				for(var index in owesToMe){
					if(iOweToThem[index]){
						var difference = Math.abs(Math.abs(iOweToThem[index].amount) - owesToMe[index].amount);
						if(Math.abs(iOweToThem[index].amount)>Math.abs(owesToMe[index].amount)){
							iOweToThem[index].amount = -difference;
							delete owesToMe[index];
						} else {
							owesToMe[index].amount = difference;
							delete iOweToThem[index];
						}
					}
				}
			}
			
			consolidateOwerPayers(owesToMe, iOweToThem);
			this.$('.js-owers').html('');
			for(owerIndex in owesToMe){
				var ower = owesToMe[owerIndex];
				var memberInfo = allMembers[owerIndex];
				
				this.$('.js-owers').append($('<div>').html(memberInfo.fullName + " : " + ower.amount));
			}
			
			this.$('.js-payers').html('');
			
			
			
			for(payerIndex in iOweToThem){
				var payer = iOweToThem[payerIndex];
				var memberInfo = allMembers[payerIndex];
				
				this.$('.js-payers').append($('<div>').html(memberInfo.fullName + " : " + payer.amount));
			}
			
		},
		reInitialize : function(){
			this.getDashboardData();
		}
	});
	return DashboardView;

});