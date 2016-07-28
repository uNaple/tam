var path		= require('path'),
		bodyParser 	= require('body-parser'),
		http = require('http'),
		url = require('url');

var handleRoute = require('./handleRoute');


module.exports = function(app, express){

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.raw());


	app.get('/', handleRoute.reqHome);
	app.get('/123', handleRoute.reqTemp1);
	app.get('/getTasks', handleRoute.reqGetTasks);
	app.get('/getExtra', handleRoute.reqGetExtra);
	app.post('/addTask', handleRoute.reqAddTask);
	app.post('/updateTask', handleRoute.reqUpdateTask);
}
