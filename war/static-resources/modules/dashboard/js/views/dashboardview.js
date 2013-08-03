define(function(require) {
	var Sandbox = require('sandbox');

	var login = require('components/login/login');
	var css = require('css!./../../css/dashboard.css');
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
				loaderContainer : this.$('.js-owers,.js-payers')
			});
		},
		//TODO : Remove old code commented out for calculation of dashboard.
		renderDashboard : function(response){
			var groups = response.items;
			
			if(groups){
				var userId = user.userId;
				console.log('groups', groups);
				
				
				var owesToMe = {};
				var iOweToThem = {};
				var allMembers = {};
				
				
				var oweInformation = {};
				
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
							oweInformation[iou.toUserId] = oweInformation[iou.toUserId] || {amount : 0};
							oweInformation[iou.toUserId].amount -= iou.amount;
							
							
							/*if(iou.amount>0){
								iOweToThem[iou.toUserId] = iOweToThem[iou.toUserId] || {amount : 0};
								iOweToThem[iou.toUserId].amount += iou.amount;
							} else {
								owesToMe[iou.toUserId] = owesToMe[iou.toUserId] || {amount : 0};
								owesToMe[iou.toUserId].amount += iou.amount;
							}*/
							
						} else if(iou.toUserId===userId){
							
							
							oweInformation[iou.fromUserId] = oweInformation[iou.fromUserId] || {amount : 0};
							oweInformation[iou.fromUserId].amount += iou.amount;
							
							/*if(iou.amount>0){
								owesToMe[iou.fromUserId] = owesToMe[iou.toUserId] || {amount : 0};
								owesToMe[iou.fromUserId].amount += iou.amount;
							} else {
								iOweToThem[iou.fromUserId] = iOweToThem[iou.fromUserId] || {amount : 0};
								iOweToThem[iou.fromUserId].amount += iou.amount;
							}*/
						}
					}
					
					for ( var memberCount = 0; memberCount < members.length; memberCount++) {
						var member = members[memberCount];
						groupMembersMap[member.userId] = member;
					}
					
					_.extend(allMembers, groupMembersMap);
					
				}
				
				
				console.log('oweInformation', oweInformation);
				
				/*console.log('owesToMe', owesToMe);
				console.log('iOweToThem', iOweToThem);
				console.log('allMembers', allMembers);*/
				
				
				
				
				/*function consolidateOwerPayers(owesToMe, iOweToThem){
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
				
				consolidateOwerPayers(owesToMe, iOweToThem);*/
				
				function filterZeros(members){
					for(var index in members){
						var member = members[index];
						if(parseInt(member.amount)===0){
							delete members[index];
						}
					}
				}
				
				/*filterZeros(owesToMe);
				filterZeros(iOweToThem);*/
				
				filterZeros(oweInformation);
				
				
				function sort(objectToSort){
					var sortedResult = _.sortBy(objectToSort, function(val, key, object) {
					    // return an number to index it by. then it is sorted from smallest to largest number
					    console.log('val', val, 'key', key, 'object',object);
					    val.key = key;
					    return -(Math.abs(val.amount));
					});
					var result = {};
					for(var index in sortedResult){
						result[sortedResult[index].key] = sortedResult[index];
					}
					return result;
					
				}
				
				
			/*	owesToMe = sort(owesToMe);
				iOweToThem = sort(iOweToThem);*/
				
				
				oweInformation =  sort(oweInformation);
				
				var debt = {};
				var credit = {};
				
				for(var index in oweInformation){
					if(oweInformation[index].amount<0){
						debt[index] = oweInformation[index];
					} else {
						credit[index] = oweInformation[index];
					}
				}
				
				/*this.$('.js-owers').html('');
				for(owerIndex in owesToMe){
					var ower = owesToMe[owerIndex];
					var memberInfo = owesToMe[owerIndex];
					
					this.$('.js-owers').append($('<div>').html(memberInfo.fullName + " : " + parseInt(ower.amount)));
				}
				if(this.$('.js-owers').html()===''){
					this.$('.js-owers').html('Nobody owes you.');
				}*/
				
				/*this.$('.js-payers').html('');
				for(payerIndex in iOweToThem){
					var payer = iOweToThem[payerIndex];
					var memberInfo = allMembers[payerIndex];
					
					this.$('.js-payers').append($('<div>').html(memberInfo.fullName + " : " + parseInt(payer.amount)));
				}
				if(this.$('.js-payers').html()===''){
					this.$('.js-payers').html('Hurray, you owe no one.');
				}*/
				
				
				this.$('.js-owers').html('');
				for(owerIndex in credit){
					var ower = credit[owerIndex];
					var memberInfo = allMembers[owerIndex];
					
					
					var input = $('<input type=button>').val(parseInt(ower.amount));
					this.$('.js-owers').append($('<div>').html(memberInfo.fullName + " : ").append(input));
				}
				
				this.$('.js-payers').html('');
				for(payerIndex in debt){
					var payer = debt[payerIndex];
					var memberInfo = allMembers[payerIndex];
					var input = $('<input type=button>').val(parseInt(payer.amount))
					this.$('.js-payers').append($('<div>').html(memberInfo.fullName).append(input));
				}
			}
			if(this.$('.js-owers').html().trim()===''){
				this.$('.js-owers').html('Nobody owes you.');
			}
			if(this.$('.js-payers').html().trim()===''){
				this.$('.js-payers').html('Hurray, you owe no one.');
			}
			
		},
		reInitialize : function(){
			this.getDashboardData();
		}
	});
	return DashboardView;

});