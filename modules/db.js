var fs = require('fs'),
		config = require('../config/config').postgres,
		pg = require('pg');

function connectDB(cb) { 							//коннект к ДБ
	var conString = config;
	var client = new pg.Client(conString);
	client.connect(function(err) {
		if(err) {
			console.error('could not connect to postgres', err);
			// throw new Error('could not connect to postgres');
 		}
		cb(client);
	});
}
//=====Добавление полей
function addPermission(val){
	connectDB(function(client){
		var query = `INSERT INTO global_permissions(sign)
									VALUES ('${val}')`;
		client.query(query, function(err, result) {
			if(err) {
				console.log(err);
			} else {
				console.log(result);
			}
		})
		//client.end();
	})
}

function addScope(val) {
	connectDB(function(client) {
		var query = `INSERT INTO scope(sign)
									VALUES ('${val}');`;
		client.query(query, function (err, result) {
			if(err) {
				console.log(err);
			} else {
				console.log(result);
			}
		})
	})
}

function addStatus(val) {
	connectDB(function(client) {
		var query = `INSERT INTO status(sign)
									VALUES ('${val}');`;
		client.query(query, function (err, result) {
			if(err) {
				console.log(err);
			} else {
				console.log(result);
			}
		})
	})
}

function addTypeAction(val) {
	connectDB(function(client) {
		var query = `INSERT INTO type_action(sign, description)
									VALUES ('${val}', 'action');`;
		client.query(query, function (err, result) {
			if(err) {
				console.log(err);
			} else {
				console.log(result);
			}
		})
	})
}
//=============Основные объекты ====Добавление
function addUser(user) {														//добавить пользователя
connectDB(function(client){
		var query = `INSERT INTO users(name, password, email, global_permission, group_permission)
					 VALUES (decode('${user.name}', 'base64'),
					 				 decode('${user.password}', 'base64'),
					 				 decode('${user.email}', 'base64'),
					 				 '${user.global_permission}',
					 				 '${user.group_permission}' ) RETURNING id`;
		client.query(query, function(err, result) {
	    if (err) {
	    	console.log(err);
	    } else {
	    	var text = 'Пользователь с id: ' + result.rows[0].id + ' добавлен';
	    }
		})
	})
}

function addTask(task, cb) {
	console.log(task);
	connectDB( function (client) {			//подключаемся и создаем запрос
		var queryHead = `INSERT INTO tasks(name, type, director, controller, time_add, status`,
				queryTail = `VALUES(convert_from(decode('${task.name}', 'base64'), 'UTF-8'),
													 	'${task.type}',
														'${task.director}',
														'${task.controller}',
														'${getNowDate()}',
														'${task.status}'`;
		if(task.executor !== null) {
			queryHead += ', executor';
			queryTail += `, '${task.executor}'`;
		}
		if(task.time_start !== null) {
			queryHead += ', time_start';
			queryTail += `, '${task.time_start}'`;
		}
		if(task.description !== null) {
			queryHead += ', description';
			queryTail += `, decode('${task.description}', 'base64')`;
		}
		if(task.parentid !== null) {	//?????
			queryHead += ', parentid';
			queryTail += `, '${task.parentid}'`;
		}
		if(task.dependence !== null) {
			queryHead += ', dependence';
			queryTail += `, '${task.dependence}'`;
		}
		if(task.priority !== null) {
			queryHead += ', priority';
			queryTail += `, '${task.priority}'`;
		}
		if(task.duration !== null) {
			queryHead += ', duration';
			queryTail += `, '${task.duration}'`;
		}
		if(task.scope !== null) {
			queryHead += ', scope';
			queryTail += `, '${task.scope}'`;
		}
		queryHead += ')';
		queryTail += ')';
		var queryFinal = queryHead + queryTail + ' RETURNING id, name;';
		console.log(queryFinal);
		client.query(queryFinal, function(err, result) {						//отправляем запрос
	    if(err) {
	    	cb(err)
	    } else {
	    	cb(null, result.rows);
				var text = 'Задача ' + result.rows[0].name + ' с id: ' + result.rows[0].id + ' добавлена';
	    	console.log(text);
	    }
		});
	});
}

// function addHistory() {
// 	connectDB(function(client) {
// 		var queryHead = `INSERT INTO history(time, type_action, description, userid, taskid)`,
// 				queryFinal = `VALUES`;
// 	})
// }

//=============Обновления
function updateTask (task, cb){                      							//обновить задание
	connectDB(function(client) {																		//как обновлять, хранить ли обновленные поля, чтоб не апдейтить все?
		var query = `UPDATE tasks	SET `;
		if(task.name !== null) {
			query += `name = convert_from(decode('${task.name}', 'base64'), 'UTF-8')`;
		}
		// for(var i in task) {
		// 	if(typeof(task[i]) == 'string') {
		// 		query += ` ${i} = '${task[i]}'`;
		// 		console.log(i + ': ' + task[i]);
		// 		console.log(typeof(task[i]));
		// 	}
		// }
		if(task.type !== null) {
			query += `, type = '${task.type}'`;
		}
		if(task.director !== null) {
			query += `, director = '${task.director}'`;
		}
		if(task.controller !== null) {
			query += `, controller = '${task.controller}'`;
		}
		if(task.executor !== null) {
			query += `, executor = '${task.executor}'`;
		}
		if(task.duration !== null) {
			query += `, duration = '${task.duration}'`;
		}
		if(task.status !== null) {
			query += `, status = '${task.status}'`;
		}
		if(task.priority !== null) {
			query += `, priority = '${task.priority}'`;
		}
		if(task.dependence !== null) {
			query += `, dependence = '${task.dependence}'`;
		}
		if(task.parentid !== null) {
			query += `, parentid = '${task.parentid}'`;
		}
		if(task.description !== null) {
			query += `, description = '${task.description}'`;
		}
		if(task.scope !== null) {
			query += `, scope = '${task.scope}'`;
		}
		query += ` WHERE id = ${task.id};`;
		console.log(query);
		client.query(query, function(err, result) {
			    if (err) {
			    	cb(err);
			    } else {
			    	cb(null)
			    }
			});
		// var text = 'Задача с id: ' + `${obj.id}` + ' изменена';
		// addHistory(client, text, typeOfAction[3]); 	//добавляем в историю
		//client.end();
	})
}

// function reassignTask(recieve, give) {														//Переназначить задание
// 	//кто получает от кого получает
// 	//меняем status на ожидание, в истории отмечаем что переназначили
// 	connectDB(function(client){
// 		client.query (`UPDATE tasks.tasks
// 			SET executor = '${recieve}', status = '5'
// 			WHERE executor = '${give}'`,
// 		function(err, result){
// 			if(err) {
// 				console.log('Ошибка при переназначении ', err);
// 			} else {
// 				console.log('Переназначили успешно!');
// 				// addHistory(client, 'reassignTask', typeOfAction[1]);
// 			}
// 		});
// 	})
// }

//============Получение
function getUser(id, cb) {
	connectDB(function(client) {
		var query = `SELECT * FROM users WHERE id = ${id}`;
		client.query(query, function(err, result) {
			if(err) {
				console.log(err);
				cb(err);
			} else if (result.rows.length == 0) {
				cb(new Error('Нет такого пользователя'));
			} else {
				cb(null, result.rows);
			}
		})
	})
}

// function getChildren() {
// 	connectDB(function(client) {
// 		var query = `SELECT * FROM tasks WHERE parentid = ${id}`;
// 		client.query(query, function(err, result) {
// 			if(err) {
// 				console.log(err);
// 			} else {
// 				console.log(result);
// 			}
// 		})
// 	})
// }

function getTask(id, cb) {
	connectDB(function(client) {
		var query = `SELECT * FROM tasks WHERE id = ${id}`;
		client.query(query, function(err, result) {
			if (err) {
				console.log(err);
				cb(err);
			} else if (result.rows.length == 0) {
				cb(new Error('Нет задачи с таким id'));
			} else {
				cb(null, result.rows);
			}
		})
	})
}

function getUsers(str, cb) {			//str строка для выборки, указываем то что надо выбрать
	connectDB(function(client) {
		var query = `SELECT ${str} FROM users;`;
		client.query(query, function(err, result) {
			if(err) {
				// console.log(err);
				cb(err);
			} else {
				cb(null, result.rows);
			}
		})
	})
}

function getNowDate(){
	var objToday = new Date(),
       	curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
       	curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
       	curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds();
	var today = objToday.getFullYear() + '-' + (objToday.getMonth()+1) + '-' +  objToday.getDate() + ' ' +  curHour + ":" + curMinute + ":" + curSeconds;
	return today;                       //текущая дата в формате timestamp without time zone
}

//=================Удаление
function deleteTask(id, cb) {
	connectDB(function(client) {
		var query = `DELETE FROM tasks WHERE id = ${id}`;
		client.query(query, function(err, result) {
			if(err) {
				console.log(err);
				cb(err);
			} else {
				cb(null, result);
			}
		})
	})
}

module.exports = {
	connectDB: 			connectDB,
	addPermission: 	addPermission,
	addScope: 			addScope,
	addStatus: 			addStatus,
	addTypeAction: 	addTypeAction,
	addUser: 				addUser,
	addTask: 				addTask,
	updateTask: 		updateTask,
	getTask: 				getTask,
	getUser: 				getUser,
	getUsers: 			getUsers,
	getNowDate: 		getNowDate,
	deleteTask: 		deleteTask
}
