$(function () {
	$('#txtUserName').keypress(function (e) {
		if (e.which == 13) {
			var name = $("#txtUserName").val();
			if (name.length > 0) {
				chat.server.connect(name);
			}
			else {
				alert("Введите имя");
			}
		}
	});
	$('#message').keypress(function (e) {
		if (e.which == 13) {
			chat.server.send($('#username').val(), $('#message').val(), $('#hdId').val());
			$('#message').val('');
		}
	});
	$('#chatBody').hide();
	$('#loginBlock').show();
	// Ссылка на автоматически-сгенерированный прокси хаба
	var chat = $.connection.chatHub;
	// Объявление функции, которая хаб вызывает при получении сообщений
	chat.client.addMessage = function (name, message, id) {
		// Добавление сообщений на веб-страницу 
		var now = new Date();
		var userId = $('#hdId').val();

		if (userId != id) {
			$('#chatroom').append('<div class="incoming_msg"><div class="incoming_msg_img">' + name + '<img src="https://ptetutorials.com/images/user-profile.png" alt="' + name + '"></div><div class="received_msg"><div class="received_withd_msg"><p>' +
				htmlEncode(message) + '</p><span class="time_date"> ' +
				now.getHours() + ':' + now.getMinutes() + '    |    ' + now.getDate() + '.' + now.getMonth() + '.' + now.getFullYear()
				+ '</span></div></div></div>');
		}
		else {
			$('#chatroom').append('<div class="outgoing_msg"><div class= "sent_msg"><p>' +
				htmlEncode(message) + '</p><span class="time_date"> ' +
				now.getHours() + ':' + now.getMinutes() + '    |' + now.getDate() + '.' + now.getMonth() + '.' + now.getFullYear()
				+ '</span> </div ></div >');
		}

	};

	// Функция, вызываемая при подключении нового пользователя
	chat.client.onConnected = function (id, userName, allUsers) {

		$('#loginBlock').hide();
		$('#chatBody').show();
		// установка в скрытых полях имени и id текущего пользователя
		$('#hdId').val(id);
		$('#username').val(userName);
		$('#header').html('<h3>Добро пожаловать, ' + userName + '</h3>');

		// Добавление всех пользователей
		for (i = 0; i < allUsers.length; i++) {

			AddUser(allUsers[i].ConnectionId, allUsers[i].Name);
		}
	}

	// Добавляем нового пользователя
	chat.client.onNewUserConnected = function (id, name) {

		AddUser(id, name);
	}

	// Удаляем пользователя
	chat.client.onUserDisconnected = function (id, userName) {

		$('#' + id).remove();
	}

	// Открываем соединение
	$.connection.hub.start().done(function () {

		$('#sendmessage').click(function () {
			// Вызываем у хаба метод Send
			chat.server.send($('#username').val(), $('#message').val(), $('#hdId').val());
			$('#message').val('');
		});

		// обработка логина
		$("#btnLogin").click(function () {

			var name = $("#txtUserName").val();
			if (name.length > 0) {
				chat.server.connect(name);
			}
			else {
				alert("Введите имя");
			}
		});
	});
});
// Кодирование тегов
function htmlEncode(value) {
	var encodedValue = $('<div />').text(value).html();
	return encodedValue;
}
//Добавление нового пользователя
function AddUser(id, name) {

	var userId = $('#hdId').val();

	if (userId != id) {
		$("#chatusers").append('<div class="chat_list"id="' + id + '"><div class="chat_people"><div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div><div class="chat_ib"><h5>' + name + '</h5></div></div>');
	}
}