var fs = require('fs');
var path = require('path');

var origin = './src'
var coreArr = [
	{
		path: 'core/base.js',
		deps: '$, NT.tpl'
	},
	'core/class.js',
	'core/event.js',
	'core/view.js',
	'core/model.js',
	'core/controller.js'
];


var uiArr = [
	'/ui/dialog.js'
];

create(origin, coreArr, 'core');
create(origin, uiArr, 'ui');

function create(originPath, arr, name){
	var contArr = [];

	arr.forEach(function(item){

		var filePath = path.join(originPath, typeof item == 'object' ? item.path : item);
		var content = fs.readFileSync(filePath);

		if(typeof item == 'object'){
			contArr.push('(function(window, $, template){\n' +
				content
				+'\n})(this, '+
				item.deps
				+');\n');
			return;
		}

		contArr.push('(function(window){\n' +
			content
			+'\n})(this);\n');
	});
	var packageJson = fs.readFileSync(path.join(__dirname, 'package.json'));

	var content = contArr.join('').replace('@version', JSON.parse(packageJson).version);

	var filePath = path.join(__dirname, 'dest', name + '.js');
	// 复制目录
	exists(filePath, content, writeFile);
}

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
function writeFile(dst, content){
	fs.writeFileSync(dst, content);
};

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
function exists(dst, content, callback ){
	fs.exists(dst, function(exists){
		// 已存在
		if(exists){
			callback(dst, content);
		}
		// 不存在
		else{
			mkdirSync(path.dirname(dst));
			callback(dst, content);
		}
	});
};

function mkdirSync(p) {
	p = path.normalize(p);
	var array = p.split(path.sep); //创建目录,没有则补上
	for (var i = 0, cur; i < array.length; i++) {
		if (i === 0) {
			cur = array[i];
		} else {
			cur += (path.sep + array[i]);
		}
		try {
			fs.mkdirSync(cur, "0755");
		} catch(err) {
			console.log(err);
		}
	}
}