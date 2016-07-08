var myTask	= require('./api/object').myTask,
		myUser	= require('./api/object').myUser,
		db 			= require('./modules/db');

function print() {
	var task =  new myTask();
	task.name = 'TestTask';
	task.type = '2';
	task.director = '679';
	task.controller = '677';
	task.status = '1';
	var newTask = new myTask();

	newTask.checkThis(JSON.stringify(task), function(err){
		if(err) {
			console.log(err)
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

// for(var i = 0; i < 20; i++) {
// 	print(i);
// }
print();

// =======================================Передача и возвращение JSON
// function test() {
// 	var tmpTask = new myTask();
// 	tmpTask.name = 'Test task';
// 	tmpTask.type = 'Проект';
// 	// console.log(JSON.stringify(tmpTask));
// 	return JSON.stringify(tmpTask);
// }

// function test1() {
// 	var task = new myTask();
// 	task.init(test(), function(self) {
// 		console.log(self);
// 	});
// }

// test1();

// ==========================Перетянул у Сани БД к себе
// var arr = new Array();

// function get(arr){
// 	connectDB1(function(client){
// 		var query = `SELECT * FROM users;`;
// 		client.query(query, function(err, result){
// 			if(err) {
// 				console.log(err)
// 			} else {
// 				for(var i = 0; i < result.rows.length; i++) {
// 					arr.push(result.rows[i]);
// 				}
// 			}
// 			writeIn(arr);
// 			client.end();
// 		})
// 	})
// }

// function writeIn(arr){
// 	connectDB(function(client){
// 		for(var i = 0; i < arr.length; i++) {
// 			var query = `INSERT INTO users(name, password, email, global_permission, group_permission) VALUES ('${arr[i].first_name}', '${arr[i].last_name}', '${arr[i].key}', '1', '2') RETURNING id; \n`;
// 			fs.appendFile('txt.txt', query);
// 			console.log(query);
// 			// client.query(query, function(err, result) {
// 			// 	if(err) {
// 			// 		console.log(err);
// 			// 	} else {
// 			// 		console.log(result.rows[0]);
// 			// 	}
// 		}
// 	})
// }

// function connectDB1(cb) { 							//коннект к ДБ
// 	var pg = require('pg');
// 	var conString = "postgres://chat:rXjRHIpp6XrXWcDtWN3KZbBnyppVcu@78.140.171.239:5432/chat";
// 	var client = new pg.Client(conString);
// 	client.connect(function(err) {
// 		if(err) {
// 			console.error('could not connect to postgres', err);
// 			// throw new Error('could not connect to postgres');
//  		}
// 		cb(client);
// 	});
// }

// get(arr);
