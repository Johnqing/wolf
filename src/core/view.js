/**
 * View层封装
 */
w.View = w.inherit({
	/**
	 * 构造函数入口
	 * @param options
	 */
	initialize: function(options){
		this._initialize();
		this.handleOption(options);
	},
	/**
	 * view类的默认设置
	 * @private
	 */
	_initialize: function(){
		// 包裹
		this.default_container_template = '<div class="wolf-view" id="<%= view_id %>"><%= html %></div>';
		// 设置view的唯一id
		this.view_id = w.uniqueId('wolf-view-');
	},
	/**
	 * 参数传入
	 * @param options
	 */
	handleOption: function(options){
		if(w.isObject(options))
			w.extend(this, options);
	},
	/**
	 * 通过 data 和 status来渲染页面
	 * @param status
	 * @param data
	 * @param callback
	 * @returns {boolean}
	 */
	render: function(status, data, callback){
		var tmp = this.setTmp[status];

		if(tmp){

			var template = this.template.tpl(tmp, data);

			// 容器包裹
			this.html = this.template.tpl(this.default_container_template, {
				view_id: this.view_id,
				html: template
			});

			this.currentStatus = status;

			callback && callback.call(this);

			return true;
		}
	},
	/**
	 * 数据和状态发生变化时，重新渲染模板
	 * @param status
	 * @param data
	 * @returns {boolean}
	 */
	update: function(status, data){
		if(!this.currentStatus || this.currentStatus !== status)
			return this.render(status, data);

		this.onUpdate && _this.onUpdate.call(this);
	}
});