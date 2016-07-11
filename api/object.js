var db 			= require('../modules/db'),
		Promise = require('bluebird');


function myUser() {
	this.name 		= null;
	this.password = null;
	this.email 		= null;
	this.global_permission 	= null;
	this.group_permission 	= null;
}

function myTask() {
	this.id = null;
	this.name = null;
	this.type = null;

	this.director = null;
	this.controller = null;
	this.executor = null;

	this.time_add = null;
	this.time_start = null;
	this.time_end = null;

	this.dependence = null;
	this.parentid = null;

	this.status = null;
	this.duration = null;
	this.description = null;
	this.priority = null;
	this.scope = null;

	this.reminder = null;
}

myTask.prototype.checkExecutor = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		console.log(self.executor);
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

//=================================//методы проверки
myTask.prototype.checkType = function() {								//проверка правильности родителя у заданного типа задачи, расширить еще
	var self = this;
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

myTask.prototype.checkThis = function(obj, cb) {							//тут собрать вместе все проверки на дату, на родителя, и пускать задачу дальше только если все ок
	// console.log(obj);
	this.init(obj, function(self) {
		// console.log(self);
		Promise.all([self.checkParent(), self.checkDirector(), self.checkType(), self.checkExecutor()]).then(function(resultArray) {
			console.log(resultArray);
			for(var i = 0; i < resultArray.length; i++) {
				if(resultArray[i] !== true ){
					var err = 'Check this find error';
					cb(err);
					break;
				} else if(i == (resultArray.length-1)) {
					console.log('Check this is OK');
					// console.log('1 ' + self.name);
					self.name = new Buffer(self.name).toString('base64');
					// console.log(self.name);
					cb(null, self);
				}
			}
		})
	})
}

//либо инициализирует this собой, либо создается новый экземпляр, тогда вопрос нахуя мы вообще расширяем класс, если создаем в его методе его новый экземпляр
myTask.prototype.init = function(obj, cb) {
	var tmp = JSON.parse(obj),
			task = new myTask();
	for(var i in tmp) {
		task[i] = tmp[i];
	}
	console.log(task);
	cb(task); 	//если что заменить тут task на this
}

module.exports = {
	myTask: myTask,
	myUser: myUser
}
