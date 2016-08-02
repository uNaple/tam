// var $ = require('jquery-3.0.0');
var xhr = new XMLHttpRequest();

$(document).ready(function() {

	// var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	// target = document.querySelector('#listTasks');
	// var observer = new MutationObserver(function(mutations) {
	// 		// console.log(mutations);
	//     mutations.forEach(function(mutation) {
	//         console.log('Mutation:', mutation);
	//     });
	// });
	// var config = {childList: true, attributes: true, characterData: true};
	// observer.observe(target, config);

	var allTasks 		= new Array(),//здесь хранятся задачи, потом редиска будет
			mySort	= new Array(),
			// deletedTasksQt	= 0,
			// myTasksQt	= 0,
			deletedTasks = new Object(),
			availableTasks = new Object(),
			myTasks 		= new Object(),
			listStatus	= new Array(),
			listTypes 	= new Array(),
			listUsers 	= new Array();
	getExtra();
	var myId = 679; //из сессии
	// getTasks();

//====

	function sortTasks() {
		console.info('sortTasks func.');
		var data = $('#listTasks li.flexrow');
		arr = [];
		console.debug('data:', data);
		for(var key = 0; key < data.length; key++) {
			if($(data[key]).data("id") !== undefined) {
				arr.push($(data[key]).data("id"));
			}
		}
		console.debug(arr);
		return arr;
	}

	function changeSort() {
		// console.debug(event);
		console.info('changeSort func.');
		if($('#titlePage').text() == 'Мои задачи') {
			mySort = sortTasks();
		}
		// if($('#titlePage').text() == 'Все задачи') {
		// 	fillAvailableTasks(showAll);
		// }
		// if($('#titlePage').text() == 'Удаленные задачи') {
		// 	fillDeletedTasks(showAll);
		// }
	};

	function changeName() {
		console.debug('changeName func.');
		console.debug($(elem).find('.text.taskedit').text());
	}

	$('#buttonAddTask1').on('click', function(event) {
		getTasks(function(cb) {
			var task = {name: 'New Task1', director: myId, type: 1, status: 5, parentid: null};
			var elem = $('<li class="flexrow" style="" ><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >' + task.name + '</span></li>');
			$(elem).data('name', task.name)
						 .data('director', task.director)
						 .data('type', task.type)
						 .data('status', task.status);
			$('#listTasks').prepend(elem);
			elem.click(onTaskClick);
			showParent(null);
		});
	});

	$('#buttonAddTask2').on('click', function(event) {
		getTasks(function(cb) {
			var task = {name: 'New Task1', director: myId, type: 1, status: 5};
			var elem = $('<li class="flexrow" style="" ><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >' + task.name + '</span></li>');
			$(elem).data('name', task.name)
						 .data('director', task.director)
						 .data('type', task.type)
						 .data('status', task.status);
			$('#listTasks').append(elem);
			elem.click(onTaskClick);
			showParent(null);
		});
	});

	$('#buttonTaskAccept').click(function(event) {
		console.info('task accept click');
		var data = $('#panelTaskEdit [name]');
		var task = new Object();
		// console.debug(data);
		for(var i = 0; i < data.length; i++) {
			if(data[i].name !== null) {
				console.debug(data[i].name, $.trim($(data[i]).val()));
				if($.trim($(data[i]).val()) === '' || $.trim($(data[i]).val()) === 'null') {
					task[data[i].name] =  null;
				} else {
					task[data[i].name] = $.trim($(data[i]).val());
				}
			}
		}
		console.debug(task);
		if($('#buttonTaskAccept').data('id') !== 'false') {
			console.info('need update');
			task.id = $('#buttonTaskAccept').data('id');
			updateTask(task);
		} else {
			console.info('need add')
			addTask(task);
		}
		changeSort();
	});

// || $('#taskParent').val() !== 'null'
// $('#taskType').val() !== '2' ||

	function showParent(parentid) {
		// if(parentid !== null && parentid !== 'null') {
				$('#taskParent').select2();
				$('#taskParent').empty();
				fillAvailableTasks(function(arr) {
					// $('#formTaskParent').show();
					$('#taskParent').append('<option value=null > </option>');
					for(var key in arr) {
						if(arr[key].name !== $('#taskName').val()) {
							$('#taskParent').append('<option value="'+availableTasks[key].id+'" >'+ availableTasks[key].name +'</option>');
						}
					}
					if(parentid !== 'null') {
						$('#taskParent [value = "'+ parentid +'" ]').attr('selected', "selected");
					} else {
						$('#taskParent [value = null]').attr('selected', "selected");
					}
				})
		// } else {
		// 	$('#taskParent').empty();
		// 	$('#formTaskParent').hide();
		// }
	};

	// var params = 'director=' + encodeURIComponent(679); //тут id из сессии
	$('#buttonMyTasks').click(function() {
		changeSort();
		console.info('myTasks butt.');
		$('#titlePage').text('Мои задачи');
		$('#buttonAddTask1').show();
		$('#buttonAddTask2').show();
		getTasks(fillMyTasks);
	});

	$('#buttonAllTasks').click(function() {
		changeSort();
		console.info('allTasks butt.');
		$('#titlePage').text('Все задачи');
		$('#buttonAddTask1').show();
		$('#buttonAddTask2').show();
		getTasks(fillAvailableTasks);
	});

	$('#buttonDeletedTasks').click(function() {
		changeSort();
		console.info('deletedTasks butt.');
		$('#titlePage').text('Удаленные задачи');
		$('#buttonAddTask1').hide();
		$('#buttonAddTask2').hide();
		getTasks(fillDeletedTasks);
	});

	function fillMyTasks(cb) {
		for(var key in allTasks) {
			if(allTasks[key].director === myId && allTasks[key].status !== 7 && allTasks[key].status !== '7'  ) {
				myTasks[allTasks[key].id] = (allTasks[key]);
			}
		}
		cb(myTasks);
	}

	function fillAvailableTasks(cb) {
		for(var key in allTasks) {
			if(allTasks[key].status !== 7 && allTasks[key].status !== '7') {
				availableTasks[allTasks[key].id] = (allTasks[key]);
			}
		}
		cb(availableTasks);
	}

	function fillDeletedTasks(cb) {
		for(var key in allTasks) {
			if(allTasks[key].status === 7 || allTasks[key].status === '7') {
				deletedTasks[allTasks[key].id] = (allTasks[key]);
			}
		}
		cb(deletedTasks);
	}

	function getTasks(cb) {
		console.info('getTasks func.');
		var params = 'id != 0';
		if(!checkExist(allTasks)) {
			// console.debug('checkExist is empty');
			xhr.open('GET', '/getTasks?' + params, true);
			xhr.send();
			xhr.onreadystatechange = function() {
				if(xhr.readyState != 4)	return;
				if(xhr.status != 200) {
					alert(xhr.status + ': ' + xhr.statusText);
				} else {
					allTasks = JSON.parse(xhr.responseText);
					allTasksQt = allTasks.length;
					console.debug('All tasks arr:', allTasks);
					cb(showAll);
				}
			}
		} else {
			cb(showAll);
		}
	};

	function checkThisTask(task) {
		console.debug(task);
		if(task.status === '7' || task.status === 7) {
			console.info('status deleted');
			delete availableTasks[task.id];
			delete myTasks[task.id];
			console.debug(task.id);
			console.debug('availableTasks:', availableTasks);
			console.debug('myTasks', myTasks);
			deletedTasks[task.id] = task;
		} else {
			console.info('task is beach');
			availableTasks[task.id] = task;
			if(task.director === myId || task.director === myId.toString()) {
				console.info('task is mine');
				myTasks[task.id] = task;
			} else {
				delete myTasks[task.id];
			}
			delete deletedTasks[task.id];
		}

		if($('#titlePage').text() == 'Мои задачи') {
			fillMyTasks(showAll);
		}
		if($('#titlePage').text() == 'Все задачи') {
			fillAvailableTasks(showAll);
		}
		if($('#titlePage').text() == 'Удаленные задачи') {
			fillDeletedTasks(showAll);
		}
	}

	function addTask(task) { //запрос на добавление задачи
		$.ajax({
			url: 'addTask',
			method: 'POST',
			data: task,
			success: function(result) {
				result = JSON.parse(result);
				console.debug('Result', result);
				if(result.hasOwnProperty('err')) {
					alert(result.err);
				} else {
					alert(result.text);
					console.debug(result.task);
					allTasks[result.task.id] = result.task;
					checkThisTask(result.task);
				}
			}
		});
	}

	function updateTask(task) { //запрос на обновление задачи
		$.ajax({
			url: 'updateTask',
			method: 'POST',
			data: task,
			success: function(result) {
				result = JSON.parse(result);
				console.debug('Result', result);
				if(result.hasOwnProperty('err')) {
					alert('Ошибка:\n' + result.err);
				} else {
					alert(result.text);
					allTasks[task.id] = task;
					console.debug(task);
					checkThisTask(task);
				}
			}
		});
	};

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

	function fillListUsers(task) { //сделать пустое поле при пустом выборе
		$('#taskDirector').select2();
		$('#taskController').select2();
		$('#taskExecutor').select2();
		$('#taskDirector').empty();
		$('#taskController').empty();
		$('#taskExecutor').empty();
		var a = new Date().getTime();
		// console.debug(a);
		$('#taskController').append('<option value=null> </option>');
		$('#taskExecutor').append('<option value=null> </option>');
		for(var key in listUsers) {
			$('#taskDirector').append('<option value="'+key+'" >'+ listUsers[key]+'</option>');
			$('#taskController').append('<option value="'+key+'">'+ listUsers[key]+'</option>');
			$('#taskExecutor').append('<option value="'+key+'">'+ listUsers[key]+'</option>');
		}
		if(task.director !== null) {
			$('#taskDirector [value = "'+ task.director +'" ]').attr('selected', "selected");
		}
		if(task.controller !== null) {
			$('#taskController [value = "'+ task.controller +'" ]').attr('selected', "selected");
		} else {
			$('#taskDirector [value = null]').attr('selected', "selected");
		}
		if(task.executor !== null) {
			$('#taskExecutor [value = "'+ task.Executor +'" ]').attr('selected', "selected");
		} else {
			$('#taskDirector [value = null]').attr('selected', "selected");
		}
		var b = new Date().getTime();
		// console.debug(b);
		console.debug(b-a);
	};

	function fillStaticLists(task) {
		$('#taskType').select2();
		$('#taskStatus').select2();
		$('#taskType').empty();
		$('#taskStatus').empty();
		console.info('fillStaticLists');
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
		console.info('show info func');
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
				if(key === 'parentid') {
					showParent(task.parentid);
				}
			}
		}
		$('#panelTaskEdit').show();
	};

	function onTaskClick() {
		console.log('on task click', this);
		var task = new Object();
		if($(this).data('id')) {	//добавляю ид если есть, чтоб знать есть ли она уже или ее надо добавить
			// console.debug($(this).data('id'));
			task = allTasks[$(this).data('id')];
			// console.debug('before', task);
			$('#buttonTaskAccept').data('id', $(this).data('id'));
		} else {
			task = $(this).data();
			$('#buttonTaskAccept').data('id', 'false');
		}
		// console.debug('after', task);
		fillListUsers(task);
		fillStaticLists(task);
		showInfo(task);
	}

	function showAll(arr) {
		console.info('show all func ', arr);
		$('#listTasks').empty();
		console.debug(mySort);
		if($('#titlePage').text() == 'Мои задачи' && mySort.length !== 0) {
			for(var i = 0; i < mySort.length; i++) {
				var elem = $('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >' + allTasks[mySort[i]].name + '</span></li>');
				$('#listTasks').append(elem);
				$(elem).data('id', allTasks[mySort[i]].id);
				$(elem).find('.text.taskedit').change(changeName);
				elem.click(onTaskClick);
			};
		} else {
			for(var key in arr) {
				var elem = $('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >' + arr[key].name + '</span></li>');
				$('#listTasks').append(elem);
				$(elem).data('id', arr[key].id);
				$(elem).find('.text.taskedit').change(changeName);
				elem.click(onTaskClick);
			};
		}
	}


// function() {
//   var b = a(this).parents("li").first();
//   b.toggleClass("done"), a("input", b).is(":checked") ? c.onCheck.call(b) : c.onUncheck.call(b)
// }
	function checkExist(obj) {//тут проверять вероятно будем из редиски
		for(var key in obj) {
			return true;
		}
		return false;
	};

})
