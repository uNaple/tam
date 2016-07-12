var db 			= require('../modules/db'),
		Promise = require('bluebird');


function myUser() {
	this.name 		= null;
	this.password = null;
	this.email 		= null;
	this.global_permission 	= null;
	this.group_permission 	= null;
}

function myTask(task) {
	// this.id = null;
	// this.name = null;
	// this.type = null;

	// this.director = null;
	// this.controller = null;
	// this.executor = null;

	// this.time_add = null;
	// this.time_start = null;
	// this.time_end = null;

	// this.dependence = null;
	// this.parentid = null;

	// this.status = null;
	// this.duration = null;
	// this.description = null;
	// this.priority = null;
	// this.scope = null;

	// this.reminder = null;
	// console.log('before', this);
	this.init(task);
	// console.log('after', this);
	// this.add();
}

myTask.prototype.init = function(task) {
	if(typeof(task) == 'string') {
		try {
			task = JSON.parse(task);
		} catch(e) {
			console.debug(e.message, e.code);
		}
	}
	if(typeof(task) !== 'object') {
		throw new Error('Неверный тип входных данных');
	}
	var keys = new Array('id', 'name', 'type',
		'director', 'controller', 'executor',
		'time_add', 'time_start', 'time_end',
		'dependence', 'parentid', 'status',
		'duration', 'description', 'priority',
		'scope', 'reminder');
	for ( var i = 0; i < keys.length; i++) {
		if (task.hasOwnProperty(keys[i])) {
			this[keys[i]] = task[keys[i]];
		} else {
			this[keys[i]] = null;
		}
	}
	return true;
}

//=================================//методы проверки
myTask.prototype.checkExecutor = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		// console.log(self);
		if(self.executor !== null) {
			db.getUser(self.executor, function(err, result) {
				if(err) {
					reject(err);
				} else {
					resolve();
				}
			})
		} else {
			resolve();
		}
	}).then(function() {
			console.log('Check executor is OK');
			return true;
	}, function(err) {
		console.log('Ошибка при загрузке пользователя ' + err);
	});
}

myTask.prototype.checkType = function() {								//проверка правильности родителя у заданного типа задачи, расширить еще
	var self = this;
	// console.log(self)
	return new Promise(function(resolve, reject) {
		if(self.type == '3' && self.parentid == null) {			//Если подзадача, то должен быть родитель
			console.log('У подзадачи должен быть родитель. Задача: ' + self.name);
			reject();
		} else {
			resolve();
		}
	}).then(function() {
		console.log('Check type is OK');
		return true;
	}, function() {
		console.log('Check type is BAD');
		return false;
	});
}

myTask.prototype.checkParent = function() {								//Если есть родитель, то он должен быть из списка задач
	var self = this;
	// console.log(self)
	return new Promise(function(resolve, reject) {
		if(self.parentid !== null) {
			db.getTask(self.parentid, function(err, result) {
				if(err) {
					reject(err);
				} else {_
					resolve();
				}
			})
		} else {
			resolve();
		}
	}).then(function() {
			console.log('Check parent is OK');
			return true;
		}, function(err) {
		console.log('Check parent is BAD ' + err);
	});
}

myTask.prototype.checkDirector = function() {								//Если есть постановщик, то он должен быть из списка пользователей, такие же проверки для всех пользователей
	var self = this;
	// console.log(self);
	return new Promise(function(resolve, reject) {
		db.getUser(self.director, function(err, result) {
			if(err) {
				reject(err);
			} else {
				resolve(result);
			}
		})
	}).then(function(result) {
			console.log('Check director is OK');
			return true;
	}, function(err) {
		console.log('Ошибка при загрузке пользователя ' + err);
	});
}

myTask.prototype.checkThis = function(cb) {							//тут собрать вместе все проверки на дату, на родителя, и пускать задачу дальше только если все ок
	var self = this;
	Promise.all([self.checkParent(), self.checkDirector(), self.checkType(), self.checkExecutor()]).then(function(resultArray) {
		console.log(resultArray);
		for(var i = 0; i < resultArray.length; i++) {
			if(resultArray[i] !== true ) {
				var err = 'Check this find error';
				cb(err);
				break;
			} else if(i == (resultArray.length-1)) {
				console.log('Check this is OK');
				self.name = new Buffer(self.name).toString('base64');
				console.log(self);
				cb(null, self);
			}
		}
	})
}

myTask.prototype.add = function() {
	this.checkThis(function(err, task) {
		if(err) {
			console.log(err);
		} else {
			db.addTask(task, function(err, result) {
				if(err) {
					console.log(err);
				} else {
					console.log(result);
				}
			})
		}
	})
}

//либо инициализирует this собой, либо создается новый экземпляр, тогда вопрос нахуя мы вообще расширяем класс, если создаем в его методе его новый экземпляр
// myTask.prototype.init = function(obj, cb) {
// 	// var tmp = JSON.parse(obj),
// 	// 		task = new myTask();
// 	for(var i in tmp) {
// 		this[i] = tmp[i];
// 	}
// 	// console.log(task);
// 	cb(task); 	//если что заменить тут task на this
// }

module.exports = {
	myTask: myTask,
	myUser: myUser
}
