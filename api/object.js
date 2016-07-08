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

	this.duration = null;
	this.status = null;
	this.priority = null;
	this.reminder = null;
	this.scope = null;
	this.description = null;
}

myTask.prototype.checkType = function() {								//проверка правильности родителя у заданного типа задачи, расширить еще
	var self = this;
	return new Promise(function(resolve, reject){
		if(self.type == '3' && self.parentid == null){			//Если подзадача, то должен быть родитель
			console.log('У подзадачи должен быть родитель. Задача: ' + self.name);
			reject();
		} else {
			resolve();
		}
	}).then(function(){
		console.log('Check type is OK');
		return true;
	}, function(){
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

myTask.prototype.checkUser = function(){								//Если есть постановщик, то он должен быть из списка пользователей, такие же проверки для всех пользователей
	var self = this;
	return new Promise(function(resolve, reject){
		db.getUser(self.director, function(err, result){
			if(err) {
				reject(err);
			} else {
				resolve(result);
			}
		})
	}).then(function(result) {
			console.log('Check user is OK');
			return true;
	}, function(err) {
		console.log('Ошибка при загрузке пользователя ' + err);
	});
}

myTask.prototype.checkThis = function(obj, cb){							//тут собрать вместе все проверки на дату, на родителя, и пускать задачу дальше только если все ок
	// console.log(obj);
	this.init(obj, function(self){
		Promise.all([self.checkParent(), self.checkUser(), self.checkType()]).then(function(resultArray){
			console.log(resultArray);
			for(var i = 0; i < resultArray.length; i++) {
				if(resultArray[i] !== true ){
					var err = 'Check this find error';
					cb(err);
					break;
				} else if(i == (resultArray.length-1)) {
					console.log('Check this is OK');
					cb(null);
				}
			}
		})
	})
}

myTask.prototype.init = function(obj, cb) {
	var task = JSON.parse(obj);
	for(var i in task){
		this[i] = task[i];
	}
	cb(this);
}

module.exports = {
	myTask: myTask,
	myUser: myUser
}
