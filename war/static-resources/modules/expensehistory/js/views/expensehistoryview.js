define(function(require) {
	var Sandbox = require('sandbox');
	var user = require('components/login/login');
	var expenseTemplate = Handlebars.compile(require('text!./../../templates/expense.html'));
	var expenseDeatailTemplate = Handlebars.compile(require('text!./../../templates/detailexpenseview.html'));
	
//	var strolljs = require('plugins/jquery/stroll/js/stroll.min');
//	var strollcss = require('css!plugins/jquery/stroll/css/stroll-stripped.css');

	var css = require('css!./../../css/expensehistory.css');
	
	
	
	//TODO : Following function is common with add expense view. Can be merged into separate utilities.
	//Only difference is swapping of gainer and loser array.
	function updatedIOUForDelete(expenseModel, group){
		
		var calculatedIOU = {};
		
		var listPayersInfo = expenseModel.listPayersInfo;
		var listIncludeMemberInfo = expenseModel.listIncludeMemberInfo;
		
		
		var gainerLosers = {};
		var payersInfoObject = {};
		var includedMembersInfoObject = {};
		
		for ( var i = 0; i < listPayersInfo.length; i++) {
			gainerLosers[listPayersInfo[i].userId] = {};
			payersInfoObject[listPayersInfo[i].userId] = listPayersInfo[i];
		}
		
		for ( var i = 0; i < listIncludeMemberInfo.length; i++) {
			gainerLosers[listIncludeMemberInfo[i].userId] = {};
			includedMembersInfoObject[listIncludeMemberInfo[i].userId] = listIncludeMemberInfo[i];
		}
		
		
		var gainers = {};
		var losers = {};
		var gainerArray = [];
		var loserArray = [];
		var gainerCount = 0;
		var loserCount = 0;
		
		for(var index in gainerLosers){
			var credit = payersInfoObject[index] && payersInfoObject[index].amount || 0;
			var debit = includedMembersInfoObject[index] && includedMembersInfoObject[index].amount || 0;
			var diff = credit - debit;
			
			gainerLosers[index] = {amount : diff};

			diff>0?gainers[index]={amount : diff} : losers[index]={amount : diff} ;
			diff>0?gainerArray[gainerCount++]={amount : diff, userId : index} : loserArray[loserCount++]={amount : Math.abs(diff), userId : index} ;
			
		}
		
		//Swapping for delete
		var tempArray = gainerArray ;
		gainerArray = loserArray;
		loserArray = tempArray;
		
		for ( var i = 0,j=0; i < gainerArray.length; i++) {
			var payer = gainerArray[i];
			
			var amountToDistribute = payer.amount;
			while(amountToDistribute>0){
				var member = loserArray[j++];
				//TODO : This is put when amount to distribute is not summing up with member amounts
				//Need to put better approach here
				if(!member){
				    break;
				}
				var amountToDeduct = member.amount;
				
				if(amountToDistribute<amountToDeduct){
					amountToDeduct = amountToDistribute;
					//TODO : To check on the round approach for more correctness
					member.amount -= Math.round(amountToDistribute);
					amountToDistribute = 0;
					j--;
				} else {
					amountToDistribute -= amountToDeduct;
				}
				calculatedIOU[member.userId +"-"+ payer.userId]={amount:amountToDeduct};
			}
		}
		
		var iouList = group.iouList;
		for ( var i = 0; i < iouList.length; i++) {
			var iou = iouList[i];
			
			var forwardKey = iou.fromUserId + "-" +iou.toUserId;
			var forwardObj = calculatedIOU[forwardKey];
			
			if(forwardObj){
				iou.amount +=forwardObj.amount;
			} else {
				var backwardKey = iou.toUserId + "-" +iou.fromUserId;
				var backwardObj = calculatedIOU[backwardKey];
				if(backwardObj){
					iou.amount -=backwardObj.amount;
				}
				
			}
			
		}
		
		return group;
	};
	
	
	
	
	
	
	var ExpenseHistoryView = Sandbox.View.extend({
		initialize : function(options) {
			this.options = _.extend({
			//defaults here
			}, options);
			this.expenses=[];
			this.expenseHitoryMap = {};
			this.render();
			this.getExpenses();
		},
		reInitialize : function(){
			this.getExpenses();
		},
		template : Handlebars
				.compile(require('text!./../../templates/expensehistory.html')),
		render : function(data) {
			$(this.el).html(this.template(data));
		},
		events : {
			'click .js-expense' : 'showExpenseDetail',
			'click .delete-expense' : 'deleteExpense'
		},
		getExpenses : function(){
			var data = {
				url : '_ah/api/userendpoint/v1/user/' + user.getInfo().userId + '/expenses',
				callback : this.showExpenseHistory,
				context : this,
				cached : true,
				loaderContainer : this.$('.js-expenses-container')
			};
			Sandbox.doGet(data);
		},
		showExpenseHistory : function(response){

			this.$('.js-detail-expnese-container').hide();
			this.$('.js-expenses-container').show();

			var expenses = response.items;
			this.expenses = expenses;
			var userInfo = user.getInfo();
			var groups = userInfo.group.items;
			var allMembers = {};
			var groupMap = {};
			for(var groupIndex in groups){
				var groupInfo = groups[groupIndex];
				for(var memberIndex in groupInfo.members ){
					allMembers[groupInfo.members[memberIndex].userId] = groupInfo.members[memberIndex];
				}
				groupMap[groupInfo.groupId] = groupInfo;
				
			}
			this.groupMap = groupMap;

			
			function normalizeExpense(expense){
				//var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				for ( var i = 0; i < expense.listIncludeMemberInfo.length; i++) {
					var memberInfo = expense.listIncludeMemberInfo[i];
					memberInfo.userInfo = allMembers[memberInfo.userId];
					if(memberInfo.userId== user.getInfo().userId){
						expense.userExpenseAmount=parseInt(memberInfo.amount);
					}
				}
				expense.userExpenseAmount = expense.userExpenseAmount || 0;
				
				if(!expense.userExpenseAmount){
					expense.type = 'payeronly';
				}
				
				for ( var i = 0; i < expense.listPayersInfo.length; i++) {
					var memberInfo = expense.listPayersInfo[i];
					memberInfo.userInfo = allMembers[memberInfo.userId];
				}
				expense.day = new Date(expense.date).toDateString();
				//expense.date = new Date(expense.date);
				expense.group = expense.groupId && groupMap[expense.groupId];
				return expense;
			}
			
			
			
			expenses = expenses.sort(function(a,b){
				 return a.date<b.date?1:a.date>b.date?-1:0;
			});
			
			var expensesContainer = this.$('.js-expenses-container').html('');
			
			for ( var i = 0; i < expenses.length; i++) {
				var expense = expenses[i];
				this.expenseHitoryMap[expense.expenseEntityId] = expense;
				
				//TODO : Convert this into view
				var html = expenseTemplate(normalizeExpense(expense));
				expensesContainer.append(html);
				
			}
			
			this.$('.js-expenses-container').height($(window).height()-$('.js-show-hide-section').height());
			//stroll.bind( this.$( '.js-expenses-container'));
			
			
		},
		showExpenseDetail : function(event){
			this.$('.js-expenses-container').hide();
			this.$('.js-detail-expnese-container').show();
			
			var expense = this.expenseHitoryMap[$(event.currentTarget).data('expense-id')];
			
			var detailHTML = expenseDeatailTemplate(expense);
			
			this.$('.js-detail-expnese-container').html(detailHTML);
			Sandbox.publish('FEM:NAVIGATE', '#expensedetail');
		},
		deleteExpense : function(event){
			var expense = this.expenseHitoryMap[$(event.currentTarget).data('expense-id')];
			var confirmation = confirm('Are you sure you want to delete this expense, ' + expense.name + ' ?');
			
			if(!confirmation){
				return;
			}
			
			
			var updatedGroup = updatedIOUForDelete(expense, this.groupMap[expense.groupId]);
			
			console.log(JSON.stringify(updatedGroup));
			
			/*Sandbox.publish('FEM:NAVIGATE', '#expensedetail');*/
		}
	});

	return ExpenseHistoryView;

});