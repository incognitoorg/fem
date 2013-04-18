define(function(require){
	
	require('css!libraries/foundation/css/normalize.css');
	require('css!libraries/foundation/css/foundation');
	require('css!./../../css/fem.css');
	require('css!./../../css/fonts/fonts.css');
	var Backbone = require('backbone');
	var AppRouter = require('./../router/femrouter');
	var Sandbox = require('sandbox');
	
	
	
	
	//Module path mapper for requiring module dynamically
	var componentPathMapper = {
		'js-create-group'		:		'modules/addgroup/addgroup',
		//'js-edit-group'			:		'modules/groupmanager/groupmanager',
		'js-edit-group'			:		'modules/selectgroup/selectgroup',
		'js-new-expense'		:		'',
		'js-expense-history'	:		'',
		'js-dashboard'			:		'',
		'js-profile'			:		''
	};
	
	//Hardcoded for avoiding error since these components are not created yet. No logical use of the below code.
	//Used to just further the flow without errors. Can be removed once all the components have been created.
	this.femDashboard={};
	this.femProfile={};
	this.femCreateExpense={};
	this.femEditExpense={};
	
	//Module instance mapper for identifying component
	var componentMapper = {
		'js-create-group'		:	this.femCreateGroup,
		'js-edit-group'			:	this.femEditGroup,
		'js-new-expense'		:	this.femCreateExpense,
		'js-expense-history'	:	this.femEditExpense,
		'js-dashboard'			:	this.femDashboard,
		'js-profile'			:	this.femProfile
	};
	
	
	
	
	
	var FEMView = Sandbox.View.extend({
		initialize : function(options){
			this.registerSubscribers();
		},
		registerSubscribers : function(){
			Sandbox.subscribe('LOGIN:SUCCESS',this.start,this);
			Sandbox.subscribe('fem-newGroupCreated',this.redirectView,this);
			Sandbox.subscribe('FEM:MENU:CLICK',this.showFEMComponent,this);
			Sandbox.subscribe('FEM:DESTROY:COMPONENT',this.destroyFEMComponent,this);
		},
		template : Handlebars.compile(require('text!../../templates/femtemplate.html')),
		render : function(){
			$(this.el).html(this.template());
		},
		events : {
			'click .js-menu' : 'eventShowView',
			'click .js-back-to-menu' : 'eventShowMenu'
		},
		eventShowView : function(event){
			var clickedMenu = (event.currentTarget && $(event.currentTarget).data('menu')) ||event;
			this.$('.js-view-item').hide();
			this.$('.' + clickedMenu).show();
			this.$('.js-left-side-menu').addClass('hide-for-small');
			this.$('.js-right-panel').removeClass('hide-for-small');
			var navLink = clickedMenu.toLowerCase().split('-').join('');
			this.router.navigate("#"+navLink.substring(2,navLink.length));

			var componentElement = this.$('.'+clickedMenu);
			var dataToPublish = {
					'clickedMenu' : clickedMenu,
					'element' : componentElement
			};
			
			Sandbox.publish('FEM:MENU:CLICK',dataToPublish);
		},
		eventShowMenu : function(){
			this.$('.js-left-side-menu').removeClass('hide-for-small');
			this.$('.js-right-panel').addClass('hide-for-small');
			this.router.navigate("#menu");
		},
		makeResponsive : function(){
			this.$('.js-left-side-menu p').height(parseInt(this.$('.js-left-side-menu').height()/this.menulength)-1);
		},
		start : function(userdata){
			var redirectURL = location.href.substr(location.href.indexOf('#'));
			this.render();
			this.menulength = this.$('.js-menu').length;
			//Trying to make height responsive. Experimental. May need to throw this away.
			this.makeResponsive();
			
			this.router = new AppRouter({view : this});
			Backbone.history.start();
			this.router.navigate('#menu');

			if(redirectURL.length>1){
				this.router.navigate(redirectURL);
			} else {
				this.eventShowView('js-dashboard');
			}
		},
		redirectView : function(data){
			this.eventShowView('js-dashboard');
		},
		showFEMComponent : function(publishedData){
			console.log('publishedData',publishedData);
			if(!componentMapper[publishedData.clickedMenu]){
				require([componentPathMapper[publishedData.clickedMenu]],function(FEMComponent){
					componentMapper[publishedData.clickedMenu]=FEMComponent.getInstance();
					componentMapper[publishedData.clickedMenu].initialize({'moduleName':publishedData.clickedMenu,'el':publishedData['element']});
				});
			}else {
				$(publishedData['element']).show();
				if(componentMapper[publishedData.clickedMenu].reInitialize){
					componentMapper[publishedData.clickedMenu].reInitialize();
				}
			}
		},
		destroyFEMComponent : function(data){
			Sandbox.destroy(componentMapper[data.name]);
			componentMapper[data.name]=null;
		}
	});
	return FEMView;
});
