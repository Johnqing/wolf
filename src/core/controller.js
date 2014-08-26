/**
 * Controller层
 */
w.Controller = w.inherit({
	initialize: function(options){
		this.handleOption(options);
		this.create();
	},
	handleOption: function(options){
		// 绑定到this
		if(w.isObject(options))
			w.extend(this, options);
	},
	update: function(data){
		this.hide.call(this);

		if(!w.extendMethod(this.onViewUpdate, this, [data]))
			this.render();

		this.show.call(this);
	},
	render: function(){
		// ... 重写
	},
	create: function(){
		var el = w.$id(this.view.view_id);
		if(el && el.length){
			this.reCreate.call(this);
		}

		w.wrap(this._create, 'onViewCreateBefore', 'onViewCreateAfter', this);
	},
	_create: function(){
		this.render();
	},
	reCreate: function(){
		w.wrap(this._reCreate, 'onViewCreateBefore', 'onViewCreateAfter', this);
	},
	_reCreate: function(){
		this.update();
	},
	/**
	 * 隐藏view
	 * @private
	 */
	_hide: function(){
		var el = w.$id(this.view.view_id);
		w.$fn(el, 'hide');
	},
	hide: function(){
		w.wrap(this._hide, 'onViewHideBefore', 'onViewHideAfter', this);
		// 解绑，方式内存泄露
		this.off();
	},
	/**
	 * 解除事件绑定
	 * @private
	 */
	_off: function(){
		var el = w.$id(this.view.view_id);
		w.$fn(el, 'off');
	},
	off: function(){
		w.wrap(this._off, 'onViewOffBefore', 'onViewOffAfter', this);
	},
	/**
	 * 展示dom
	 * @private
	 */
	_show: function(){
		var el = w.$id(this.view.view_id);

		var container = w.$(this.container);
		w.$fn(container, 'html', null, [this.view_content]);

		w.$fn(el, 'show');
	},
	/**
	 * view模板生成，并绑定事件
	 */
	show: function(){
		// 模板生成
		this.view_content = w.$c(this.view.html);
		// 事件绑定
		this.bind();

		w.wrap(this._show, 'onViewShowBefore', 'onViewShowAfter', this);
	},
	/**
	 * 绑定事件
	 */
	bind: function(){
		w.wrap(w.event.on(this.events, this.view_content, this), 'onViewBindBefore', 'onViewBindAfter', this);
	}
});