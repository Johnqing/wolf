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