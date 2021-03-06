// var $ = require('jquery-3.0.0');
var xhr = new XMLHttpRequest();
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

$(document).ready(function() {
	getTasks(fillMyTasks);

	// var observer = new MutationObserver(function(mutations) {
	//     mutations.forEach(function(mutation) {
	// 	    // if(mutation.type === 'characterData' && mutation.target.nodeName === '#text') {
	// 	    // 	$('#panelTaskEdit #taskName').val(mutation.target.data);
	// 	    // }
	//         console.debug('Mutation:', mutation);
	//     });
	// });
	// var config = {characterData: true, subtree: true, childList: true, attributes: true};
	// var target = document.querySelector('#listTasks');
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

	$('#listTasks').bind('sortupdate', function(e, ui) {
		changeSort();
		console.debug($('#listTasks').sortable('toArray'));
	})

	// $('#listTasks').sortable({'update':function(e, ui) {
	// }});

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
		console.debug('sorting order',arr);
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
	};

	function changeName(e) {
		console.debug('changeName func.');
		if($(this).context.id) { //смена имени в панели редактирования справа
			// if(e.keyCode === 13 && e.key === 'Enter') {
			// 	console.debug(e.keyCode, e.key);
			// 	$('#buttonTaskAccept').triggerHandler('click');
			// }
			var li = $('#listTasks li');
			//хуй знает, пока что не придумал как менее затратно это сделать
			// mySort[$('#buttonTaskAccept').data('sortid')];
			for(var i = 0; i < li.length; i++) {
				if($(li[i]).data('id') ===  $('#buttonTaskAccept').data('id')) {
						$(li[i]).find('.text.taskedit').val($(this).val());
				}
			}
		} else { //смена имени в списке задач слева
			if(e.keyCode === 13 && e.key === 'Enter') {
				console.debug(e.keyCode, e.key);
				$('#buttonTaskAccept').triggerHandler('click');
			}
			$('#panelTaskEdit #taskName').val($(this).val());
			// console.debug($(this));
		}
	}

	$('#buttonAddTask1').on('click', function(event) {
		getTasks(function(cb) {
			var task = {name: 'New Task1', director: myId, type: 1, status: 5, parentid: null};
			var elem = $('<li class="flexrow" style="" ><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><input class="text taskedit" value="' + task.name + '"></li>');
			$(elem).data('name', task.name)
						 .data('director', task.director)
						 .data('type', task.type)
						 .data('status', task.status)
						 .data('id', 'false');
			// mySort.unshift('false');
			$('#listTasks').prepend(elem);
			$(elem).find('.text.taskedit').keydown(blockEnter).keyup(changeName);
			$(elem).find(':input').focus();
			$(elem).find(':input').blur(function() {$('#buttonTaskAccept').triggerHandler('click')});
			console.debug(mySort);
			elem.click(onTaskClick);
			elem.triggerHandler('click');
		});
	});

	$('#buttonAddTask2').on('click', function(event) {
		getTasks(function(cb) {
			var task = {name: 'New Task1', director: myId, type: 1, status: 5};
			var elem = $('<li class="flexrow" style="" ><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><input class="text taskedit" value="' + task.name + '"></span></li>');
			$(elem).data('name', task.name)
						 .data('director', task.director)
						 .data('type', task.type)
						 .data('status', task.status);
			$('#listTasks').append(elem);
			$(elem).find('.text.taskedit').keydown(blockEnter).keyup(changeName);
			$(elem).find(':input').focus();
			$(elem).find(':input').blur(function() {$('#buttonTaskAccept').triggerHandler('click')});
			elem.click(onTaskClick);
			elem.triggerHandler('click');
		});
	});

	$('#buttonTaskAccept').click(function(event) {
		console.info('task accept click');
		var data = $('#panelTaskEdit [name]');
		var task = new Object();
		console.debug(data);
		for(var i = 0; i < data.length; i++) {
			if(data[i].name !== null) {
				// console.debug(data[i].name, $.trim($(data[i]).val()));
				if($.trim($(data[i]).val()) === '' || $.trim($(data[i]).val()) === 'null') {
					task[data[i].name] =  null;
				} else {
					task[data[i].name] = $.trim($(data[i]).val());
				}
			}
		}
		console.debug(task);
		if($('#buttonTaskAccept').data('id') !== 'false') { //если не фолс то надо обновить, так как ИД уже есть
			console.info('need update');
			task.id = $('#buttonTaskAccept').data('id');
			updateTask(task);
		} else {
			console.debug($('#buttonTaskAccept').data('id'));
			console.info('need add')
			addTask(task);
		}
		// changeSort();
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
		console.info('myTasks butt.');
		$('#titlePage').text('Мои задачи');
		$('#buttonAddTask1').show();
		$('#buttonAddTask2').show();
		getTasks(fillMyTasks);
	});

	$('#buttonAllTasks').click(function() {
		console.info('allTasks butt.');
		$('#titlePage').text('Все задачи');
		$('#buttonAddTask1').show();
		$('#buttonAddTask2').show();
		getTasks(fillAvailableTasks);
	});

	$('#buttonDeletedTasks').click(function() {
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

	function spawnNotification(theBody) {
		if (!("Notification" in window)) {
    	alert("This browser does not support desktop notification");
  	} else if (Notification.permission === "granted") {
    	// Если разрешено то создаем уведомлений
    	var notification = new Notification(theBody);
  	} else if (Notification.permission !== 'denied') {
   	 		Notification.requestPermission(function (permission) {
      	// Если пользователь разрешил, то создаем уведомление
      	if (permission === "granted") {
        	var notification = new Notification(theBody);
      	}
    	});
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
					console.debug(result.task);
					allTasks[result.task.id] = result.task;
					spawnNotification(result.text);
					var arr = $('#listTasks li.flexrow');
					for(var i = 0; i < arr.length; i++) {
						if($(arr[i]).data('id') === 'false') {
							// console.debug(result.task.id);
							$(arr[i]).data('id', result.task.id);
						}
					}
					// console.debug($(this));
					// $(elem).data('id', result.task.id);
					changeSort();
					checkThisTask(result.task);
					// alert(result.text);
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
					spawnNotification(result.text);
					// alert(result.text);
					allTasks[task.id] = task;
					console.debug(task);
					changeSort();
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
		console.debug(task);
		$('#taskController').append('<option value=null> </option>');
		$('#taskExecutor').append('<option value=null> </option>');
		for(var key in listUsers) {
			$('#taskDirector').append('<option value="'+key+'" >'+ listUsers[key]+'</option>');
			$('#taskController').append('<option value="'+key+'">'+ listUsers[key]+'</option>');
			$('#taskExecutor').append('<option value="'+key+'">'+ listUsers[key]+'</option>');
		}
		if(task.director !== null) {
			// console.debug(task.director);
			$('#taskDirector [value = "'+ task.director +'" ]').attr('selected', "selected");
		}
		if(task.controller !== null) {
			// console.debug(task.controller);
			$('#taskController [value = "'+ task.controller +'" ]').attr('selected', "selected");
		} else {
			$('#taskDirector [value = null]').attr('selected', "selected");
		}
		if(task.executor !== null) {
			// console.debug(task.executor);
			$('#taskExecutor [value = "'+ task.executor +'" ]').attr('selected', "selected");
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
		for(var key in task) {
			// console.debug(task[key], key);
			if(key !== 'null') {
				if(key === 'name') {
					$('#panelTaskEdit #taskName').val(task.name);
				}
				if(key === 'description') {
					$('#panelTaskEdit #taskDescription').val(task.description);
				}
				if(key === 'director') {
					$('#taskDirector').append('<option value="'+task.director+'" ></option>');
					$('#taskDirector [value = "'+ task.director +'" ]').attr('selected', "selected");
				}
				if(key === 'type') {
					$('#taskType').append('<option value="'+task.type+'" ></option>');
					$('#taskType [value = "'+ task.type +'" ]').attr('selected', "selected");
				}
				if(key === 'status') {
					$('#taskStatus').append('<option value="'+task.status+'" ></option>');
					$('#taskStatus [value = "'+ task.status +'" ]').attr('selected', "selected");
				}
				// if(key === 'parentid') {
				// 	showParent(task.parentid);
				// }
			}
		}
		$('#panelTaskEdit').show();
		$('#taskName').keydown(blockEnter).keyup(changeName);
	};

	function blockEnter(e) { //блокирую enter чтоб не было переноса строки и обновления страницы в списке задач и поле редактирования соответственно
		if(e.key === 'Enter' && e.keyCode === 13) {
			e.preventDefault();
		}
	}

	$('#buttonShowExtra').click(function() {
		var task = allTasks[$('#buttonTaskAccept').data('id')] || {name: 'New Task1', director: myId, type: 1, status: 5, parentid: null};
		fillListUsers(task);
		fillStaticLists(task);
		showParent(task.parentid);
	})

	$('#buttonDeleteTask').click(function(e) {
		// console.debug($('#buttonTaskAccept').data('id'));
		console.debug(allTasks[$('#buttonTaskAccept').data('id')]);
		// allTasks[$('#buttonTaskAccept').data('id')];
		// console.debug($(this));
		$('#taskStatus').append('<option value="'+ 7 +'" ></option>');
		$('#taskStatus [value = 7]').attr('selected', "selected");
		for(var i = 0; i < mySort.length; i++) {
			if(mySort[i] === $('#buttonTaskAccept').data('id')) {
				delete mySort[i];
			}
		}
		$('#buttonTaskAccept').triggerHandler('click');
	})

	function onTaskClick(e) {
		// console.debug(e);
		$('#panelTaskExtra').addClass('collapsed-box');
		$('#panelTaskExtra .box-body').css('display', 'none');
		console.log('on task click', this);
		var task = new Object();
		if($(this).data('id') !== 'false') {	//добавляю ид если есть (и беру задачу из массива задач), чтоб знать есть ли она уже или ее надо добавить
			task = allTasks[$(this).data('id')];
			$('#buttonTaskAccept').data('id', $(this).data('id'));
		} else {	//беру задачу по-умолчанию, зашитую в скрипт и в ид пишу фолс
			task = $(this).data();
			console.debug($(this).data());
			$('#buttonTaskAccept').data('id', 'false');
		}
		// console.debug('after', task);
		showInfo(task);
	}

	function showAll(arr) {
		console.info('show all func ', arr);
		$('#listTasks').empty();
		console.debug(mySort);
		if($('#titlePage').text() == 'Мои задачи' && mySort.length !== 0) {
			for(var i = 0; i < mySort.length; i++) { //вынести в функцию два куска и просто проходить по ней сколько то раз

				var elem = $('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><input class="text taskedit" value="' + allTasks[mySort[i]].name + '"></li>');
				$('#listTasks').append(elem);
				$(elem).data('id', allTasks[mySort[i]].id).data('sortid', i);
				$(elem).find('.text.taskedit').keydown(blockEnter).keyup(changeName);
				elem.click(onTaskClick);
			};
		} else {
			for(var key in arr) {
				var elem = $('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><input class="text taskedit" value="' + arr[key].name + '"></li>');
				$('#listTasks').append(elem);
				$(elem).data('id', arr[key].id);
				$(elem).find('.text.taskedit').keydown(blockEnter).keyup(changeName);
				elem.click(onTaskClick);
				elem.blur(function() {
					alert(e);
				})
			}
		}
		// var target = document.querySelector('#listTasks');
		// observer.observe(target, config);
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
