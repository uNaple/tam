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
	console.info('myTask func ');
	this.init(task);
}

myTask.prototype.init = function(task) {
	console.info('myTask.init\n', task);
	if(typeof(task) == 'string') {
		try {
			task = JSON.parse(task);
		} catch(e) {
			console.error('myTask.init ', e.message);
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
			if(task[keys[i]] !== '') {
				this[keys[i]] = task[keys[i]];
			} else {
				this[keys[i]] = null;
			}
		} else {
			this[keys[i]] = null;
		}
	}
	return true;
}

//=================================//методы проверки
myTask.prototype.checkParent = function() {								//Если есть родитель, то он должен быть из списка задач,не быть самим собой, зависимость и родитель не могуь быть одним и тем же
	var self = this;
	console.info('myTask.checkParent func');
	return new Promise(function(resolve, reject) {
		if(self.parentid !== null) {
			db.getTask(self.parentid, function(err, result) {
				if(err) {
					reject(err);
				} else if(self.id == result[0].id) {
					reject(new Error('Задача не может быть родителем самому себе'));
				} else if(self.parentid === self.dependence) {
					reject(new Error('Задача не может зависеть от родительской задачи'));
				}	else {
					resolve();
				}
			})
		} else {
			resolve();
		}
	}).then(function() {
			console.info('checkParent is OK');
			return true;
		}, function(err) {
			console.error('checkParent error: ', err.message);
			return false;
	});
}

myTask.prototype.checkType = function() {								//проверка правильности родителя у заданного типа задачи, расширить еще
	var self = this;
	console.info('myTask.checkType func')
	// console.log(self)
	return new Promise(function(resolve, reject) {
		if(self.type === '3' && self.parentid === null) {			//Если подзадача, то должен быть родитель
			reject(new Error('У подзадачи должен быть родитель. Задача: ' + self.name));
		} else if(self.type === '2' && self.parent !== null) {
			reject(new Error('У проекта не может быть родителя'));
		}	else {
			resolve();
		}
	}).then(function() {
		console.info('checkType is OK');
		return true;
	}, function(err) {
		console.error('checkType error: ', err.message);
		return false;
	});
}

myTask.prototype.checkUsers = function() {
	var self = this;
	console.info('myTask.checkUser func');
	return new Promise(function(resolve, reject) {
		db.getUsers('id', function(err, result) {
			if(err) {
				reject(err);
			} else {
				console.log(self);
				if(self.director !== null ) {
					if(!result.hasOwnProperty(self.director)) {
						reject(new Error('Постановщик должен быть из списка контактов'));
					}
				}
				//&& self.controller.length !== '0' && self.controller !== ''
				if(self.controller !== null) {
					if(!result.hasOwnProperty(self.controller)) {
						reject(new Error('Контроллер должен быть из списка контактов'));
					}
				}
				if(self.executor !== null) {
					if(!result.hasOwnProperty(self.executor)) {
						reject(new Error('Исполнитель должен быть из списка контактов'));
					}
				}
				resolve();
			}
		})
	}).then(function() {
			console.info('checkUsers is OK');
			return true;
	}, function(err) {
		console.error('checkUsers error: ' + err.message);
		return false;
	});
}

myTask.prototype.checkPermissions = function() {
	console.info('Тут проверяются разрешения на удаление');
	return true;
}

myTask.prototype.checkThis = function(cb) {							//тут собрать вместе все проверки на дату, на родителя, и пускать задачу дальше только если все ок
	var self = this;																			//можно передавать массив в качестве аргумента, чтоб можно было проверять каждый раз свои данные
	console.info('myTask.checkThis func');
	Promise.all([self.checkParent(), self.checkType(), self.checkUsers()]).then(function(resultArray) {
		console.log(resultArray);
		for(var i = 0; i < resultArray.length; i++) {
			if(resultArray[i] !== true ) {

				cb(new Error('checkThis find error'));
				break;
			} else if(i == (resultArray.length-1)) {
				console.info('checkThis is OK');
				self.name = new Buffer(self.name).toString('base64');
				cb(null, self);
			}
		}
	})
}

myTask.prototype.add = function(cb) {
	console.info('myTask.add func');
	this.checkThis(function(err, task) {
		if(err) {
			console.error('myTask.add: ', err);
			cb(err);
		} else {
			db.addTask(task, function(err, result) {
				if(err) {
					console.error('myTask.add addTask ', err);
					cb(err);
				} else {
					cb(null, result);
				}
			})
		}
	})
}

myTask.prototype.update = function() {
	this.checkThis(function(err, task) {
		if(err) {
			console.info(err.message);
		} else {
			db.updateTask(task, function(err, result) {
				if(err) {
					console.log(err.message);
				} else {
					console.log('up-to-date');
				}
			})
		}
	})
}

myTask.prototype.delete = function() {
	var self = this;
	if(this.checkPermissions()) {
		db.getChildren(self.id, function(err, result) {
			if(err) {
				console.log(err);
			} else if(result.rows.length !== 0) {
				console.log(`у задачи есть подзадачи (${result.row.length}), и они погибнут при удалении родителя`);
				// for()//тут происходит массовое гонение подзадач, у которых текущая родитель
				// console.log(result);
			} else {
				db.deleteTask(self.id, function(err, result) {
					if(err){
						console.log(err);
					} else {
						console.log(result);
					}
				})
			}
		})
	} else {
		console.log('Нет прав для удаления');
	}
}

module.exports = {
	myTask: myTask,
	myUser: myUser
}


// myTask.prototype.checkDirector = function() {								//Если есть постановщик, то он должен быть из списка пользователей, такие же проверки для всех пользователей
// 	var self = this;
// 	// console.log(self);
// 	return new Promise(function(resolve, reject) {
// 		db.getUser(self.director, function(err, result) {
// 			if(err) {
// 				reject(err);
// 			} else {
// 				resolve(result);
// 			}
// 		})
// 	}).then(function(result) {
// 			console.log('Check director is OK');
// 			return true;
// 	}, function(err) {
// 		console.log('Ошибка при загрузке пользователя ' + err);
// 	});
// }

// myTask.prototype.checkController = function() {
// 	var self = this;
// 	// console.log(self);
// 	return new Promise(function(resolve, reject) {
// 		if(self.controller !== null) {
// 			db.getUser(self.controller, function(err, result) {
// 				if(err) {
// 					reject(err);
// 				} else {
// 					resolve();
// 				}
// 			})
// 		} else {
// 			resolve();
// 		}
// 	}).then(function() {
// 			console.log('Check controller is OK');
// 			return true;
// 	}, function(err) {
// 		console.log('Ошибка при загрузке пользователя ' + err);
// 	});
// }

// myTask.prototype.checkExecutor = function() {
// 	var self = this;
// 	// console.log(self);
// 	return new Promise(function(resolve, reject) {
// 		if(self.executor !== null) {
// 			db.getUser(self.executor, function(err, result) {
// 				if(err) {
// 					reject(err);
// 				} else {
// 					resolve();
// 				}
// 			})
// 		} else {
// 			resolve();
// 		}
// 	}).then(function() {
// 			console.log('Check executor is OK');
// 			return true;
// 	}, function(err) {
// 		console.log('Ошибка при загрузке пользователя ' + err);
// 	});
// }
