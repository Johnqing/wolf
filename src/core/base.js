/**
 * Created by liuqing on 14-8-22.
 */
var wolf = wolf || {
	version: '@version',
	$: jQuery,
	template: NT
};
var w = wolf;

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

// 补丁
if(!ArrayProto.forEach){
	var breaker = {};
	ArrayProto.forEach = function(iterator, context){
		var obj = this;
		if (obj.length === +obj.length) {
			for (var i = 0, length = obj.length; i < length; i++) {
				if (iterator.call(context, obj[i], i, obj) === breaker) return;
			}
		} else {
			for(var key in obj){
				var item = obj[key];
				if (iterator.call(context, item, key, obj) === breaker) return;
			}
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
	return obj.forEach(iterator, context);
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
	return obj.forEach(function(item){
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


