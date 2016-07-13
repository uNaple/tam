var myTask	= require('./api/object').myTask,
		myUser	= require('./api/object').myUser,
		db 			= require('./modules/db');


//=================================================Удаление задачи
// function print(id) {
// 	db.deleteTask(id, function(err, result) {
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			console.log(result);
// 		}
// 	})
// }
// print(3);

// =========================================Обновление задачи
// function print() {
// 	var task =  new myTask();
// 	task.id = '2';
// 	task.name = 'TestTask2';
// 	task.type = '2';
// 	task.director = '679';
// 	task.controller = '677';
// 	task.status = '1';
// 	// var newTask = new myTask();
// 	db.updateTask(task, function(){
// 		console.log('im inside');
// 	})
// }
// print();

//=========================================Добавление и проверка задачи
// var tmp0 = new Buffer('TestTask1').toString('base64');
// console.log(tmp0);
// var tmp1 = new Buffer('','base64').toString('ascii');
// console.log(tmp1);
//=======================Хттп реквест
// var xhr = new XMLHttpRequest();
// var id = 2;
// var params = 'id='+id;
// xhr.open('GET', '/test?'+params, true);

// xhr.send();

// xhr.onreadystatechange = function() {
//   if (xhr.readyState != 4) return;
//   if (xhr.status != 200) {
//     alert(xhr.status + ': ' + xhr.statusText);
//   } else {
//     document.writeln('<p>'+xhr.responseText+'</p>');
//   }
// }

function add(task) {
	try {
		var tmp = new myTask(task);
		tmp.add();
	} catch(err) {
		console.log(err);
	}
}

function update(task) {
	try {
		console.log(task);
		var tmp = new myTask(task);
		// tmp.update();
		tmp.delete();
	} catch(err) {
		console.log(err);
	}
}

// function delete() {
// 	try {
// 		console.log('1');
// 	} catch(err) {
// 		console.log(err);
// 	}
// }

function testAdd(val) {
	var task = new Object();
	task.name = 'TestTask';
	task.type = '2';
	task.director = '679';
	task.controller = '677';
	task.status = '1';
	task.parentid = '1';
	var newTask = JSON.stringify(task);
	for(var i = 0; i < val; i++) {
		task.name = 'TestTask_' + i;
		add(task);
	}
}

function testUpdate(id) {
	var task = new Object();
	task.name = 'TestTask';
	task.type = '1';
	task.director = '679';
	task.controller = '677';
	// task.executor = '1677';
	task.status = '1';
	//Для редактирования
	task.id = id;
	//Для назначения родителя
	task.parentid = '4';
	//Для принятия задачи юзером
	task.executor = '49';
	//Приостановить выполнение
	// task.status = '3';
	//Отменить выполнение
	// task.status = '6';
	var newTask = JSON.stringify(task);
	update(newTask);

}


function print() {
// var director = '3';
	// db.getUsers('*', function(err, result) {
	// 	if(err) {
	// 		console.log(err);
	// 	} else {
	// 		var res = result.hasOwnProperty(director);
	// 		console.log(res);
	// 		// for(var key in result) {
	// 		// 	result[key].hasOwnProperty(director);
	// 		// 	// console.log(result[key]);
	// 		// }
	// 	}
	// })
	// testAdd(10);
	testUpdate(1);
	// var str = 'hyi';
	// var int = 1+3;
	// var task1 = new Object();

	// add(int);
	// add(str);
	// add(task1);
	// add(newTask);
	// add(task);
}

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
