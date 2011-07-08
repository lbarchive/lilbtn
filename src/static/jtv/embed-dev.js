var channel = '';

function toggle_chat() {
	var chatbox = $('#chatbox');
	if (chatbox.length > 0) {
		// disable the chat
		chatbox.empty().remove();
		$('#btn-toggle-chat').text('Enable Chat');
		return;
		}
	
	// enable the chat
	chatbox = $('<div/>')
			.attr('id', 'chatbox')
			.appendTo($('body'));
			;

	var chat = $('<iframe/>')
	 		.attr('id', 'chat_embed')
			.attr('src', 'http://www.justin.tv/chat/embed?channel=' + channel + '&default_chat=jtv&popout_chat=true#r=-rid-&s=em')
	 		.attr('frameborder', '0')
			.attr('scrolling', 'no')
			.appendTo(chatbox)
			;
	$('#btn-toggle-chat').text('Disable Chat');
	resize();
	}

function resize() {
	var jtvembed = $('#jtvembed');
	jtvembed
			.height($(window).height())
			.width($(window).width())
			;
	
	var chatbox = $('#chatbox')
	if (chatbox.length == 1) {
		var top = 24; //$('#controls').offset().top + $('#controls').outerHeight(true);
		var height = $(window).height() - top - 29;
		var width = 400;
		var left = $(window).width() - width;
		chatbox
				.css('top', top)
				.css('left', (left < 0) ? 0 : left)
				.height(height)
				.width((left < 0) ? $(window).width() : width)
				;

		var chat = $('#chat_embed');
		// Justin.tv says minimal height is 420, but it actually is 421.
		// I guess the coder must be using height > 420, not >=.
		// Same goes to width, 271 instead of 270.
		if (height < 421 + 20)
			height = 421 + 20;
		chat
				// preserve/wastes 20 pixel for when only one axis needs the scrollbar.
				// Without these pixels, the needed scrollbar will cause the other axis
				// needs scrollbar as well. 20 is just a rough guess.
				.height(height - 20)
				.width(width - 20)
				;
		}
	}

function init_loader() {
	var m = /.*\/cleanjtv\/(.+)/.exec(document.location.href);
	if (m) {
		if (!/[^_a-z0-9]+/.test(m[1])) {
			channel = m[1];
			}
		else {
			m = /.*justin\.tv\/([_a-z0-9]+).*/.exec(m[1]);
			if (m)
				channel = m[1];
			}
		}
	if (!channel)
		return;

	var jtvembed = $('<object/>')
			.attr('id', 'jtvembed')
			.attr('type', 'application/x-shockwave-flash')
			.attr('data', 'http://www.justin.tv/widgets/live_embed_player.swf?channel=' + channel)
			.attr('bgcolor', '#000000')
			.append($('<param/>')
					.attr('name', 'flashvars')
					.attr('value', 'hostname=www.justin.tv&channel=' + channel + '&auto_play=false&start_volume=25')
					)
			.append($('<param/>')
					.attr('name', 'allowFullScreen')
					.attr('value', 'true')
					)
			.append($('<param/>')
					.attr('name', 'allowScriptAccess')
					.attr('value', 'always')
					)
			.append($('<param/>')
					.attr('name', 'allowNetworking')
					.attr('value', 'all')
					)
			.append($('<param/>')
					.attr('name', 'movie')
					.attr('value', 'http://www.justin.tv/widgets/live_embed_player.swf')
					)
			.append($('<param/>')
					.attr('name', 'wmode')
					.attr('value', 'opaque')
					)
			.height($(window).height())
			.width($(window).width())
			;
	jtvembed.appendTo($('body'));

	var controls = $('<div/>')
			.attr('id', 'controls')
			.append($('<button/>')
					.attr('id', 'btn-toggle-chat')
					.text('Enable Chat')
					.click(toggle_chat)
					)
			;
	controls.appendTo($('body'));

	$(window).resize(resize);
	}
$(init_loader);
/* vim: set sw=2 ts=2 noet: */
