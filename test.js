var myTask	= require('./api/object').myTask,
		myUser	= require('./api/object').myUser,
		db 			= require('./modules/db'),
		writeIn = require('./api/server');

function print() {
	var task = new myTask(),
			user = new myUser();
	console.log(task);
	console.log(user);
}

//testConnectDb();
//addPermission('admin');
//addPermission('user');
db.addUser(user);
//testConnectDb();
//print();
