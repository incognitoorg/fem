define(function(require) {

	var Sandbox = require('sandbox');
	var SelectGroup = require('modules/selectgroup/selectgroup');
	var CSS = require('css!./../../css/newexpense.css');
	var JqueryTouch = require('libraries/jquery-mobile/jquery.mobile.touch.min');
	var memberPayTemplate = require('text!./../../templates/member-pay.html');
	var memberExpenseTemplate = require('text!./../../templates/member-expense.html');
	var ExpenseModel = require('./../models/expensemodel');
	var FormValidator = require("./../validator/newexpensevalidator");

	var expenseInputCounter = 0;
	
	function updatedIOU(expenseModel, group){
		
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
	};
	
	var NewExpenseView = Sandbox.View.extend({
		initialize : function(options) {
			this.options = _.extend({
			//defaults here
			}, options);
			this.render();
			this.registerSubscribers();
			this.start();
			
		},
		totalExpense : 0,
		template : Handlebars.compile(require('text!./../../templates/newexpense.html')),
		render : function(data) {
			$(this.el).html(this.template(data));
		},
		events : {
			'blur input.js-pay-input' : 'divideExpense',
			'blur input.js-contribution-input' : 'adjustExpenses',
			'click .js-lock-button' : 'eventLockExpense',
			'click .js-select-expense' : 'toggleExpense',
			'click .js-save-expense' : 'eventSaveExpense',
			'click .js-allmembers' : 'toggleAllMembers'
		},
		registerValidator : function(){
			FormValidator.initialize({'element':this.$(".js-add-expense-form"),'errorWidth':'86%'});
		},
		reInitialize : function(){
			this.$('.js-select-group').show();
			this.$('.js-new-expense-form').hide();
			this.$('.js-success-message').hide();
			this.objSelectGroup.reInitialize();
			
		},
		start : function(){
			if(this.objSelectGroup){
				Sandbox.destroy(this.objSelectGroup);
			} else {
				this.objSelectGroup = SelectGroup.getInstance();
			}
			
			this.$('.js-select-group').show();
			this.$('.js-new-expense-form').hide();
			this.$('.js-success-message').hide();
			this.objSelectGroup.initialize({el:this.$('.js-select-group'), 'owner':'NEW-EXPENSE'});
		},
		registerSubscribers : function(){
			Sandbox.subscribe('GROUP:SELECTED:NEW-EXPENSE', this.showNewExpenseForm, this);
			                   
		},
		showNewExpenseForm : function(group){
			this.group = group;
			
		    var self = this;
			this.$('.js-select-group').hide();
			this.$('.js-new-expense-form').show();
			
			var today = new Date();
			var dateStr = 1900+today.getYear() + '-' + ((today.getMonth()+1)>=10?today.getMonth()+1 : '0' +(today.getMonth()+1)) +'-' + (today.getDate()>=10?today.getDate() : '0' +today.getDate());
			this.$('.js-expense-date').attr('max', dateStr).val(dateStr);
			
			
			
			function normalize(data){
				for ( var i = 0; i < data.members.length; i++) {
					var d = data.members[i];
					d.fullName = d.fullName || (d.firstName && d.lastName && d.firstName + ' ' + d.lastName) || '';
				}
				return data;
			}
			
			group = normalize(group);
			
			this.createPayersSection(group.members);
			this.createMembersSection(group.members);
			
			
			this.$('.carousel').each(function(index, el){
				self.setCarousel(self.$(el));
			});
			
			this.registerValidator();
		},
		createPayersSection : function(groupMembers){
			var payersContainer = this.$('.js-payers').html('');
			var payerContentTemplate = Handlebars.compile(memberPayTemplate);
			
			var itemContainer = null;
			for ( var i = 0; i < groupMembers.length; i++) {
				if(i%5==0){
					itemContainer = $('<div class=item>');
					payersContainer.append(itemContainer);
				}
				var groupMember = groupMembers[i];
				groupMember.inputNumber = expenseInputCounter++;
				
				itemContainer.append(payerContentTemplate(groupMember));
			}
		},
		createMembersSection : function(groupMembers){
			var payersContainer = this.$('.js-included-members').html('');
			var payerContentTemplate = Handlebars.compile(memberExpenseTemplate);
			
			var itemContainer = null;
			for ( var i = 0; i < groupMembers.length; i++) {
				if(i%5==0){
					itemContainer = $('<div class=item>');
					payersContainer.append(itemContainer);
				}
				var groupMember = groupMembers[i];
				groupMember.inputNumber = expenseInputCounter++;
				
				itemContainer.append(payerContentTemplate(groupMember));
			}
		},
		//TODO : To put this in jquery plugin or component
		setCarousel : function(element){
			var isMobile = false;
			//TODO : Put this in some common place
			if( $('.is-mobile').css('display') == 'none' ) {
		        isMobile = true;      
		    }
			
			var parts = !isMobile?3:1;
			$(element).children().width(($(element).width()/parts)-20);
			$(element).children().each(function(index, el){
			     $(el).css({'margin-left':$(el).width()*index});
			});
			
			var showNextPage = function(){
				var pageIndex = $.makeArray($(element).children()).indexOf($(this).parents('.item')[0]);
				pageIndex +=1;
				$(element).children().each(function(index, el){
				     $(el).animate({'margin-left':$(el).width()*index - pageIndex*$(el).width()});
				});
			};
			$(element).find('.next').click(showNextPage);
			
			var showPreviousPage = function(){
				var pageIndex = $.makeArray($(element).children()).indexOf($(this).parents('.item')[0]);
				pageIndex -=1;
				$(element).children().each(function(index, el){
				     $(el).animate({'margin-left':$(el).width()*index - pageIndex*$(el).width()});
				});
			};
			$(element).find('.previous').click(showPreviousPage);
			
			$(element).height(function(){
				var totalHeight = 0;
				$($(element).find('.item')[0]).children().each(function(index, el){
					totalHeight += $(el).height();
				});
				return totalHeight;
			}());
			
			
			$(element).find('.item')
			.swipeleft(function(){
				var pageIndex = $.makeArray($(element).children()).indexOf(this);
				pageIndex=pageIndex+1!=$(element).children().size()?pageIndex+1:pageIndex;
				$(element).children().each(function(index, el){
				     $(el).animate({'margin-left':$(el).width()*index - pageIndex*$(el).width()});
				});
			})
			.swiperight(function(){
				var pageIndex = $.makeArray($(element).children()).indexOf(this);
				pageIndex =pageIndex!=0?pageIndex-1:pageIndex;
				$(element).children().each(function(index, el){
				     $(el).animate({'margin-left':$(el).width()*index - pageIndex*$(el).width()});
				});
			});
			
		},
		divideExpense : function(){
			
			
			
			var payInputs =  this.$('.js-payers').find('input.js-pay-input');
			var totalPayment = 0;
			
			payInputs.each(function(index, el){
				totalPayment += Math.abs($(el).val());
			});
			this.totalExpense = totalPayment;
			
			
			var lockedInputs = this.$('.js-included-members').find('input.js-contribution-input.locked');
			var lockedExpense = 0;
			
			lockedInputs.each(function(index, el){
				lockedExpense += Math.abs($(el).val());
			});
			
			var expenseToDivide = totalPayment - lockedExpense;
			var contributionInputs = this.$('.js-included-members').find('input.js-contribution-input:not(.locked)');
			var dividedShare = (expenseToDivide/contributionInputs.length).toFixed(2);
			contributionInputs.val(dividedShare!=="NaN"?dividedShare : '');
			
			var self = this;
			
			if(!self.$('.js-add-expense-form').valid()){
				//TODO : Setting height dynamically, Put this in common function 
				self.$('.carousel').each(function(index, carouselEl){
					var totalHeight = 0;
					$(carouselEl).height(function(){
						$($(carouselEl).find('.item')[0]).children().each(function(index, el){
							totalHeight += $(el).height();
						});
						return totalHeight;
					});
				});
				return;
			}
		},
		adjustExpenses : function(event){
			
			var self = this;
			
			var contributionInputs = this.$('.js-included-members').find('input.js-contribution-input:not(.locked)').not(event.currentTarget);
			var lockedInputs = this.$('.js-included-members').find('input.js-contribution-input.locked').not(event.currentTarget);
			var lockedExpense = 0;
			lockedInputs.each(function(index, el){
				lockedExpense += Math.abs($(el).val());
			});
			var expenseToDivide = this.totalExpense - lockedExpense - $(event.currentTarget).val();
			
			var dividedShare = (expenseToDivide/contributionInputs.length).toFixed(2);
			contributionInputs.val(dividedShare!=="NaN"?dividedShare : '');
			
			if(!self.$('.js-add-expense-form').valid()){
				//TODO : Setting height dynamically, Put this in common function 
				self.$('.carousel').each(function(index, carouselEl){
					var totalHeight = 0;
					$(carouselEl).height(function(){
						$($(carouselEl).find('.item')[0]).children().each(function(index, el){
							totalHeight += $(el).height();
						});
						return totalHeight;
					});
				});
				
				return;
			}
		},
		eventLockExpense : function(event){
			this.$(event.currentTarget).parent().
			toggleClass('locked').
			find('input').
			toggleClass('locked');
		},
		toggleExpense : function(event){
			if(!$(event.currentTarget).is(':checked')){
				this.$(event.currentTarget).parents('.js-expense-div')
				.addClass('locked').addClass('selected')
				.find('input.js-contribution-input')
				.addClass('locked')
				.attr('disabled', true)
				.val(0);
			} else {
				this.$(event.currentTarget).parents('.js-expense-div')
				.removeClass('locked').removeClass('selected')
				.find('input.js-contribution-input')
				.removeClass('locked')
				.attr('disabled', false);
			}
			this.divideExpense();
		},
		eventSaveExpense : function(){
			
			
			if(!this.$('.js-add-expense-form').valid()){
				return;
			}
			
			var self = this;
			var payersInfo = [];
			var includeMemberInfo = [];
			
			var payersInputs = this.$('.js-pay-input');
			
			payersInputs.each(function(index, el){
				if(parseFloat($(el).val())>0){
					payersInfo.push({userId : $(el).data('userd'), amount:parseFloat($(el).val())});
				}
			});
			
			var includedMembersInputs = this.$('.js-contribution-input[disabled!="disabled"]');
			includedMembersInputs.each(function(index, el){
				if(parseFloat($(el).val())>0){
					includeMemberInfo.push({userId : $(el).data('userd'), amount:parseFloat($(el).val())});
				}
			});
			
			var objExpenseModel = new ExpenseModel({
				name : this.$('.js-expense-name').val()!=""?this.$('.js-expense-name').val() : "Untitled",
				date : this.$('.js-expense-date').val(),
				listPayersInfo : payersInfo,
				listIncludeMemberInfo : includeMemberInfo,
				groupId : this.group.groupId,
				group : this.group,
				type : this.$('.js-expense-type').val()
			});
			
			updatedIOU(objExpenseModel.attributes, objExpenseModel.attributes.group);
			showMask('Adding expense...');
			Sandbox.doPost({
				url :'_ah/api/expenseentityendpoint/v1/expenseentity',
				callback : function(response){
					self.expenseSaved(objExpenseModel);
				},
				data : JSON.stringify(objExpenseModel.attributes),
				contex : self
			});
			
			
			
		},
		//TODO : Following todo is done, need to remove this old method keep for sake of returning back if something bad happens 13-08-2013. If too many days passed. Just remove this method.
		expenseSavedOld : function(response, objExpenseModel){
			var self = this;
			//TODO : Use one request to keep integrity of the data
			updatedIOU(objExpenseModel.attributes, this.group);
			Sandbox.doUpdate({
				url :'_ah/api/groupendpoint/v1/group/',
				callback : function(response){
					self.groupSaved(objExpenseModel);
				},
				context : self,
				data : JSON.stringify(this.group)
			});
			self.groupSaved(objExpenseModel);
		},
		expenseSaved : function(objExpenseModel){
			this.groupSaved(objExpenseModel);
		}, 
		groupSaved : function(objExpenseModel){
			this.$('.js-new-expense-form').hide();
			this.$('.js-success-message').show();
			hideMask();
		},
		toggleAllMembers : function(event){
			var selectAll = $(event.currentTarget).is(':checked');
			this.$('.js-select-expense').prop('checked', !selectAll).click();
			this.divideExpense();
		}
	});
	
	return NewExpenseView;

});