// var $ = require('jquery-3.0.0');
var xhr = new XMLHttpRequest();

$(document).ready(function() {

	var allTasks 		= new Array(),//здесь хранятся задачи, потом редиска будет
			myTasks 		= new Array(),
			listStatus	= new Array(),
			listTypes 	= new Array(),
			listUsers 	= new Array();
	getExtra();
	// getTasks();

	$('#buttonAddTask1').on('click', function(event) {
		var task = {name: 'New Task1', director: '451', type: 1, status: 5};
		var elem = $('<li class="flexrow" style="" ><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >' + task.name + '</span></li>');
		$(elem).data('name', task.name)
					 .data('director', task.director)
					 .data('type', task.type)
					 .data('status', task.status);
		$('#listTasks').prepend(elem);
		elem.click(onTaskClick);
	});

	$('#buttonAddTask2').on('click', function(event) {
		var task = {name: 'New Task1', director: '451', type: 1, status: 5};
		var elem = $('<li class="flexrow" style="" ><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >' + task.name + '</span></li>');
		$(elem).data('name', task.name)
					 .data('director', task.director)
					 .data('type', task.type)
					 .data('status', task.status);
		$('#listTasks').append(elem);
		elem.click(onTaskClick);
	});

	$('#buttonTaskAccept').click(function(event) {
		console.debug('task add click');
		var data = $('#panelTaskEdit [name]');
		var task = new Object();
		console.debug(data);
		for(var i = 0; i < data.length; i++) {
			if(data[i].name !== null) {
				console.debug(data[i].name, $.trim($(data[i]).val()));
				if($.trim($(data[i]).val()) === '') {
					task[data[i].name] = null;
				} else {
					task[data[i].name] = $.trim($(data[i]).val());
				}
			}
		}
		console.debug(task);
		// console.debug($('#buttonTaskAccept').data('new'));
		if($('#buttonTaskAccept').data('id') !== 'false') {
			console.debug('need update');
			task.id = $('#buttonTaskAccept').data('id');
			updateTask(task);
		} else {
			console.debug('need add')
			sendTask(task);
		}
	});

	function sendTask(task) {
		$.ajax({
			url: 'addTask',
			method: 'POST',
			data: task,
			success: function(result) {
					result = JSON.parse(result);
					alert(result);//тут проверять что пришло и добавлять или не добавлять возвращать задачу добавленную и обновлять
					// console.debug(result);
					// console.debug(task);
					// console.debug(allTasks);
					// showAll(allTasks);
				}
		});
	}

	function updateTask(task) {
		$.ajax({
			url: 'updateTask',
			method: 'POST',
			data: task,
			success: function(result) {
					result = JSON.parse(result);
					alert(result);
					console.debug(result);
					console.debug(task);
					console.debug(allTasks);
					allTasks[task.id] = (task);
					showAll(allTasks);
					// showAll(allTasks);
				}
		});
	}


	function getExtra() {
		console.log('getExtra func');
		if(checkExist(listUsers)) { //тут еще проверки на полноту типов и статусов, вообще статусы и типа и прочую статику надо вшить, либо один раз грузить, но отдельно от динамической инфы
			return true;
		} else {
			$.get('getExtra', function (result) {
				var arr = JSON.parse(result);
				for(var i in arr) {
					if(arr[i].hasOwnProperty('Users')) {
						listUsers = arr[i].Users;
					}
					if(arr[i].hasOwnProperty('Types')) {
						listTypes = arr[i].Types;
					}
					if(arr[i].hasOwnProperty('Status')) {
						listStatus = arr[i].Status;
					}
				}
			})
		}
	};

	function getTasks(cb) {
		var params = 'status != 7';
		if(!checkExist(allTasks)) {
			console.debug('checkExist is empty');
			xhr.open('GET', '/getTasks?' + params, true);
			xhr.send();
			xhr.onreadystatechange = function() {
				if(xhr.readyState != 4)	return;
				if(xhr.status != 200) {
					alert(xhr.status + ': ' + xhr.statusText);
				} else {
					allTasks = JSON.parse(xhr.responseText);
					console.debug(allTasks);
					cb(allTasks);
				}
			}
		} else {
			console.debug('checkExist is not empty');
			cb(allTasks);
		}
	};

	$('#buttonMyTasks').click(function() {
			// var params = 'director=' + encodeURIComponent(679); //тут id из сессии
		console.debug('myTasks func');
		var id = 679;
		getTasks(function(arr) {
			if(checkExist(myTasks)) {
				console.debug('checkExist is not empty');
				showAll(myTasks);
			} else {
				console.debug('checkExist is empty');
				for(var key in arr) {
					if(arr[key].director === id) {
						myTasks.push(allTasks[key]);
					}
				}
				showAll(myTasks);
			}
		})
	});

	$('#buttonAllTasks').click(function() {
		console.debug('allTasks func');
		getTasks(function(arr) {
			showAll(arr);
		});
	});

	function fillListUsers(director) {
		$('#taskDirector').select2();
		$('#taskDirector').empty();
		for(var key in listUsers) {
			if(key === director.toString()) {
				$('#taskDirector').append('<option value="'+key+'" selected = "selected">'+ listUsers[key]+'</option>');
				continue;
			}
			$('#taskDirector').append('<option value="'+key+'">'+ listUsers[key]+'</option>');
		}
	};

	function fillStaticLists(task) {
		$('#taskType').select2();
		$('#taskStatus').select2();
		$('#taskType').empty();
		$('#taskStatus').empty();
		for(var key in listTypes) {
			if(key === task.type.toString()) {
				$('#taskType').append('<option value="'+key+'" selected = "selected">'+ listTypes[key]+'</option>');
				continue;
			}
			$('#taskType').append('<option value="'+ key +'">'+listTypes[key]+'</option>');
		}
		for(var key in listStatus) {
			if(key === task.status.toString()) {
				$('#taskStatus').append('<option value="'+key+'" selected = "selected">'+ listStatus[key]+'</option>');
				continue;
			}
			$('#taskStatus').append('<option value="'+ key+'">'+listStatus[key]+'</option>');
		}
	};

	function showInfo(task) {
		console.debug('show info func');
		// console.debug(task);
		for(var key in task) {
			if(key !== 'null') {
				if(key === 'name') {
					// console.debug(task.name);
					$('#panelTaskEdit #taskName').val(task.name);
				}
				if(key === 'description') {
					$('#panelTaskEdit #taskDescription').val(task.description);
				}
			}
		}
		$('#panelTaskEdit').show();
	};

	function onTaskClick() {
		console.log('on task click', this);
		var task = new Object();
		if($(this).data('id')) {
			task = allTasks[$(this).data('id')];
			$('#buttonTaskAccept').data('id', $(this).data('id'));
		} else {
			task = $(this).data();
			$('#buttonTaskAccept').data('id', 'false');
		}
		// console.debug(task);
		fillListUsers(task.director);
		fillStaticLists(task);
		showInfo(task);
	}

	function showAll(arr) {
		console.debug(arr);
		console.debug('show all func');
		$('#listTasks').empty();
		for(var key in arr) {
			var elem = $('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >' + arr[key].name + '</span></li>');
			$(elem).data('id', arr[key].id);
			$('#listTasks').append(elem);
			elem.click(onTaskClick);
		}
	};

	function checkExist(obj) {//тут проверять вероятно будем из редиски
		for(var key in obj) {
			return true;
		}
		return false;
	};

})
