define(function(require) {

	var Sandbox = require('sandbox');
	var SelectGroup = require('modules/selectgroup/selectgroup');
	var CSS = require('css!./../../css/newexpense.css');
	var JqueryTouch = require('libraries/jquery-mobile/jquery.mobile.touch.min');
	var memberPayTemplate = require('text!./../../templates/member-pay.html');
	var memberExpenseTemplate = require('text!./../../templates/member-expense.html');
	
	
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
			'click .js-lock-button' : 'eventLockExpense'
		},
		start : function(){
			this.objSelectGroup = SelectGroup.getInstance();
			this.objSelectGroup.initialize({el:this.$('.js-select-group'), 'owner':'NEW-EXPENSE'});
		},
		registerSubscribers : function(){
			Sandbox.subscribe('GROUP:SELECTED:NEW-EXPENSE', this.getGroupInfo, this);
			                   
		},
		getGroupInfo : function(groupId){
			var self = this;
			
			Sandbox.doGet({
				url :'_ah/api/groupendpoint/v1/group/' + groupId,
				callback : this.showNewExpenseForm,
				context : this
			});
			
			
			
		},
		showNewExpenseForm : function(response){
			
			console.log('group data', response);
			
		    var self = this;
			this.$('.js-select-group').hide();
			this.$('.js-new-expense-form').show();
			
			function normalize(data){
				for ( var i = 0; i < data.members.length; i++) {
					var d = data.members[i];
					d.fullName = d.fullName || (d.firstName && d.lastName && d.firstName + ' ' + d.lastName) || '';
				}
				return data;
			}
			
			response = normalize(response);
			
			this.createPayersSection(response.members);
			this.createMembersSection(response.members);
			
			this.$('.carousel').each(function(index, el){
				self.setCarousel(self.$(el));
			});
		},
		createPayersSection : function(groupMembers){
			var payersContainer = this.$('.js-payers');
			var payerContentTemplate = Handlebars.compile(memberPayTemplate);
			
			var itemContainer = null;
			for ( var i = 0; i < groupMembers.length; i++) {
				if(i%5==0){
					itemContainer = $('<div class=item>');
					payersContainer.append(itemContainer);
				}
				var groupMember = groupMembers[i];
				
				itemContainer.append(payerContentTemplate(groupMember));
			}
		},
		createMembersSection : function(groupMembers){
			var payersContainer = this.$('.js-included-members');
			var payerContentTemplate = Handlebars.compile(memberExpenseTemplate);
			
			var itemContainer = null;
			for ( var i = 0; i < groupMembers.length; i++) {
				if(i%5==0){
					itemContainer = $('<div class=item>');
					payersContainer.append(itemContainer);
				}
				var groupMember = groupMembers[i];
				
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
			$(element).children().width($(element).width()/parts);
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
			contributionInputs.val((expenseToDivide/contributionInputs.length).toFixed(2));
		},
		adjustExpenses : function(event){
			var contributionInputs = this.$('.js-included-members').find('input.js-contribution-input:not(.locked)').not(event.currentTarget);
			var lockedInputs = this.$('.js-included-members').find('input.js-contribution-input.locked');
			var lockedExpense = 0;
			lockedInputs.each(function(index, el){
				lockedExpense += Math.abs($(el).val());
			});
			var expenseToDivide = this.totalExpense - lockedExpense - $(event.currentTarget).val();
			contributionInputs.val((expenseToDivide/contributionInputs.length).toFixed(2));
		},
		eventLockExpense : function(event){
			this.$(event.currentTarget).parent().
			toggleClass('locked').
			find('input').
			toggleClass('locked');
		}
	});
	
	return NewExpenseView;

});