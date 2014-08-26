/**
 * UI dialog
 */

var DialogView = w.inherit(w.View, {
	setTemplate: {
		0: 'template-dialog'
	},
	setStatus: {
		STATUS_INIT: 0
	}
});

var DialogModel = w.inherit(w.Model, {});

var view = new DialogView();
var model = new DialogModel();

var DialogController = w.inherit(w.Controller, {
	_initialize: function(){
		this.view = view;
		this.model = model;

		this.originDate = {
			title: '',
			content: '',
			cancel: '取消',
			sure: '确定'
		}

		this._init();
	},
	initialize: function($super, opts){
		this._initialize();
		$super(opts);
	},
	_init: function(){
		this.model.format(this.originDate);
		this.model.register(this);
		this.view_status = this.view.setStatus.STATUS_INIT;
	},
	render: function(){
		var data = this.model.view_model;
		this.view.render(this.view_status, data);
	},
	set: function(options){
		w.extend(this.model.data_model, options);
		this.model.notifyDataChanged();
	},
	events: {
		'click .cui-btns-cancel': 'cancelAction'
	},
	cancelAction: function(){
		this.onCancelBtnClick();
	}
});

// 实例化
var controller = new DialogController({
	container: '#test',
	onCancelBtnClick: function(){
		alert(123);
	}
});
