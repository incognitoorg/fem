define(function(require) {
	var Sandbox = require('sandbox');
	var userInfo = require('components/login/login').getInfo();
	var expenseTemplate = Handlebars.compile(require('text!./../../templates/expense.html'));

	var css = require('css!./../../css/expensehistory.css');
	
	var ExpenseHistoryView = Sandbox.View.extend({
		initialize : function(options) {
			this.options = _.extend({
			//defaults here
			}, options);
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
		getExpenses : function(){
			var data = {
				url : '_ah/api/userendpoint/v1/user/' + userInfo.userId + '/expenses',
				callback : this.showExpenseHistory,
				context : this,
			};
			Sandbox.doGet(data);
		},
		showExpenseHistory : function(response){
			
			
			function normalizeExpense(expense){
				//var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				for ( var i = 0; i < expense.listIncludeMemberInfo.length; i++) {
					var memberInfo = expense.listIncludeMemberInfo[i];
					if(memberInfo.userId==userInfo.userId){
						expense.userExpenseAmount=memberInfo.amount;
						break;
					}
				}
				expense.day = new Date(expense.date).toDateString();
				//expense.date = new Date(expense.date);
				return expense;
			}
			
			var expenses = response.items;
			var expensesContainer = this.$('.js-expenses-container').html('');
			for ( var i = 0; i < expenses.length; i++) {
				var expense = expenses[i];
				//TODO : To convert this into a view
				var html = expenseTemplate(normalizeExpense(expense));
				expensesContainer.append(html);
				
			}
		}
	});

	return ExpenseHistoryView;

});