/**
 * Model层
 */
w.Model = w.inherit({
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
		// 观察者
		this.observers = [];
		// 原始数据模型
		this.data_model = {};
		// view需要的数据
		this.view_model = {};
	},
	/**
	 * 参数设置
	 * @param options
	 */
	handleOption: function(options){
		// 从形参中获取key和value绑定在this上
		if(w.isObject(options))
			w.extend(this, options);
	},
	/**
	 * 配置数据
	 * @param origin
	 * @returns {{}|*}
	 */
	format: function(origin){
		this.data_model = origin;
		this.view_model = this.parse(origin);
		return this.view_model;
	},
	/**
	 * 用来将origin转为view_model，该方法需要被重写
	 * @param origin
	 * @returns {*}
	 */
	parse: function(origin){
		return origin;
	},
	/**
	 * controller注册
	 * @param controller
	 */
	register: function(controller){
		// 如果队列中没有，插入到队列
		if(!w.contains(this.observers, controller))
			this.observers.push(controller);
	},
	unregister: function(controller){
		this.observers = w.without(this.observers, controller);
	},
	/**
	 * 数据变化更新
	 */
	notifyDataChanged: function(){
		var data = this.format(this.data_model);

		w.each(this.observers, function(controller){
			if(w.isObject(controller))
				controller.update && controller.update.apply(controller, [data]);
		})

	}
})