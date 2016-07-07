function myUser() {
	this.name 		= null;
	this.password = null;
	this.email 		= null;
	this.global_permission 	= null;
	this.group_permission 	= null;
}

function myTask() {
	this.id			= null;
	this.name 	= null;
	this.type 	= null;
	this.director		= null;
	this.controller	= null;
	this.executor		= null;
	this.time_add		= null;
	this.time_start	= null;
	this.time_end		= null;
	this.duration		= null;
	this.status			= null;
	this.priority		= null;
	this.dependence	= null;
	this.parentid		= null;
	this.reminder		= null;
	this.scope			= null;
	this.description = null;
}

module.exports = {
	myTask: myTask,
	myUser: myUser
}
