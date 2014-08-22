var arr = [];
var slice = arr.slice;

w.inherit = function(){
	// 参数只支持 1-2位
	if(arguments.length === 0 || arguments.length > 2)
		throw new Error('参数错误！');

	// 参数数组化
	var properties = slice.call(arguments);

	var parentClass = null;
	// 第一个参数 如果是类，取出
	if(typeof properties[0] === 'function'){
		parentClass = properties.shift();
	}

	properties = properties[0];

	// new class
	function _class(){
		if(w.isFunction(this.initialize))
			this.initialize.apply(this, arguments);

	}
	// 赋值父类
	_class.$super = parentClass;

	// 防止构造函数执行
	if(parentClass){
		var subclass = function(){};
		subclass.prototype = parentClass.prototype;
		_class.prototype = new subclass();
	}


	for(var key in properties){
		var value = properties[key];

		//此处对对象进行扩展，当前原型链已经存在该对象，便进行扩展
		if (w.isObject(_class.prototype[key]) && w.isObject(value) && (typeof _class.prototype[key] != 'function' && typeof value != 'fuction')) {
			//原型链是共享的，这里不好办
			var temp = {};
			w.extend(temp, _class.prototype[key]);
			w.extend(temp, value);
			_class.prototype[key] = temp;
		} else {
			_class.prototype[key] = value;
		}
	}


	if(!_class.prototype.initialize){
		_class.prototype.initialize = function () { };
	}

	_class.prototype.constructor = _class;

	return _class;

}



