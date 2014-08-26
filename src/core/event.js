/**
 * Event模块
 */
var eventRegx = /^(\S+)\s*(.*)$/;
w.event = {
	parse: function(evts, context){
		var evtArr = [];

		w.each(evts, function(method, key){
			if(!method) return;

			if(!w.isFunction(method))
				method = context[method];

			var match = key.match(eventRegx);
			var eventName = match[1];
			var selector = match[2];

			method = method.bind(context);

			eventName += '.delegateEvents'+ context.view.view_id;

			evtArr.push({
				target: selector,
				event: eventName,
				callback: method
			})

		});

		return evtArr;
	},
	on: function(evts, el, context){
		return function(){
			var eventsList = w.event.parse(evts, context);
			eventsList.forEach(function(item){
				w.event.core(el, 'on', item.event, item.callback, context, item.target == '' ? undefined : item.target);
			});
		}
	},
	/**
	 *  事件绑定
	 * @param obj           绑定元素
	 * @param methodName    方法名
	 * @param eventName     事件名
	 * @param callback      回调
	 * @param context       上下文
	 * @param subObj        子级
	 */
	core: function(obj, methodName, eventName, callback, context, subObj){
		/**
		 * 事件代理|事件消除 如果有父元素就代理到父元素
		 * @returns {*}
		 */
		var onOrOff = function(name){
			return function(){
				if(subObj)
					return obj[name](eventName, subObj, callback);
				obj[name](eventName, callback);
			}
		}
		/**
		 * 事件触发
		 * @returns {*}
		 */
		var trigger = function(){
			if(subObj)
				return obj.find(subObj).trigger(eventName);
			obj.trigger(eventName);
		}

		/**
		 * 支持的事件列表
		 * @type {{on: delegate, delegate: delegate, off: *, undelegate: *}}
		 */
		var maps = {
			on: onOrOff('on'),
			bind: onOrOff('on'),
			off: onOrOff('off'),
			unbind: onOrOff('off'),
			trigger: trigger,
			fire: trigger
		};

		// 不支持的事件，抛弃
		if(w.isFunction(maps[methodName])){
			maps[methodName]();
		}
	}
}