/**
 * 基础方法
 */
var _wolf = window.wolf;
_wolf = _wolf || {
	version: '@version',
	$: $,
	$fn: function(el, fnName, context, param){
		var fn = el[fnName];
		if(w.isFunction(fn))
			fn.apply(context || el, param);
	},
	$id: function(id){
		return w.$('#'+ id);
	},
	$c: function(html){
		return w.$(html);
	},
	template: template,
	ui: {}
};
window.w = _wolf;

var ArrayProto = Array.prototype,
	ObjProto = Object.prototype,
	FuncProto = Function.prototype;

var push             = ArrayProto.push,
	slice            = ArrayProto.slice,
	concat           = ArrayProto.concat,
	toString         = ObjProto.toString,
	hasOwnProperty   = ObjProto.hasOwnProperty;

var nativeIndexOf      = ArrayProto.indexOf;

/**
 * 类型检查
 * @param type
 * @returns {Function}
 * @private
 */
var _isType = function(type){
	return function(obj){
		return Object.prototype.toString.call(obj).slice(8, -1) === type;
	}
}

w.isFunction = _isType('Function');
w.isObject = _isType('Object');
w.isArray = _isType('Array');
/**
 * 继承
 * @param obj
 * @returns {*}
 */
w.extend = function(obj){
	if (!w.isObject(obj)) return obj;
	var source, prop;
	for (var i = 1, length = arguments.length; i < length; i++) {
		source = arguments[i];
		for (prop in source) {
			if (hasOwnProperty.call(source, prop)) {
				obj[prop] = source[prop];
			}
		}
	}
	return obj;
}

/**
 * 获取唯一id
 * @param prefix
 * @returns {string}
 */
w.uniqueId = function(){
	var idCounter = 0;
	return function(prefix){
		var id = ++idCounter + '';
		return prefix ? prefix + id : id;
	}
}();
/**
 * 检查obj中是否包含target
 * @param obj
 * @param target
 * @returns {boolean}
 */
w.contains = function(obj, target){
	if(obj == null) return false;
	if(nativeIndexOf && obj.indexOf === nativeIndexOf)
		return obj.indexOf(target) != -1;
	return w.each(obj, function(item){
		return item === target;
	})
}
/**
 * 剔除某项
 * @param arr
 * @returns {Array}
 */
w.without = function(arr){
	var args = slice.call(arguments, 1);
	var arr_temp = [];
	arr.forEach(function(item){
		args.forEach(function(item2){
			if(item == item2) return;
			arr_temp.push(item)
		})
	});
	return arr_temp;
}

/**
 * 继承
 * @param fn
 * @param context
 * @param params
 * @returns {*}
 */
w.extendMethod = function(fn, context, params){
	context = context || this;
	if(w.isFunction(fn))
		return w.isArray(params) ? fn.apply(context, params) : fn.call(context, params);
	return false;
}
/**
 *
 * @param func
 * @returns {Function}
 */
w.partial = function(func) {
	var boundArgs = slice.call(arguments, 1);
	return function() {
		var position = 0;
		var args = boundArgs.slice();
		for (var i = 0, length = args.length; i < length; i++) {
			if (args[i] === w) args[i] = arguments[position++];
		}
		while (position < arguments.length) args.push(arguments[position++]);
		return func.apply(this, args);
	};
};
/**
 * 获取context中的 fn
 * @param key
 * @param context
 * @returns {*}
 */
w.getConFn = function(key, context){
	context = context || window;

	if(w.isFunction(key))
		return key;

	if(w.isFunction(context[key]))
		return context[key];

	return function(){};

}
/**
 * fn前后执行的函数
 * @param fn
 * @param bef
 * @param aft
 * @param context
 * @returns {*}
 */
w.wrap = function(fn, bef, aft, context){
	context = context || this;

	var action = w.partial(function(){
		w.getConFn(bef, context).call(context);
		fn.call(context);
		w.getConFn(aft, context).call(context);
	}, fn);

	return action.call(context);
}

// 补丁
if(!ArrayProto.forEach){
	var breaker = {};
	ArrayProto.forEach = function(iterator, context){
		var obj = this;
		for (var i = 0, length = obj.length; i < length; i++) {
			if (iterator.call(context, obj[i], i, obj) === breaker) return;
		}
		return obj;
	}
}


/**
 * 遍历
 * @param obj
 * @param iterator
 * @param context
 * @returns {void|*}
 */
w.each = function(obj, iterator, context){

	if (obj.length === +obj.length) {
		return obj.forEach(iterator, context);
	}

	for(var key in obj){
		var item = obj[key];
		if (iterator.call(context, item, key, obj)) return;
	}

	return obj;
}
/**
 *
 * @param object
 * @param property
 * @returns {*}
 */
w.result = function(object, property) {
	if (object == null) return null;
	var value = object[property];
	return w.isFunction(value) ? value.call(object) : value;
};


if (!FuncProto.bind) {
	FuncProto.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = ArrayProto.slice.call(arguments, 1),
			fToBind = this,
			fNOP = function () {},
			fBound = function () {
				return fToBind.apply(this instanceof fNOP && oThis
					? this
					: oThis || window,
					aArgs.concat(ArrayProto.slice.call(arguments)));
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}