var JTV_CONTROLS_HEIGHT = 29;
var channel = '';
var chatbox_pinned = false;
var show_jtv_controls = true;
var chat_width = 400;

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
			.appendTo($('body'))
			;

	var chat = $('<iframe/>')
	 		.attr('id', 'chat_embed')
			.attr('src', 'http://www.justin.tv/chat/embed?channel=' + channel + '&default_chat=jtv&popout_chat=true#r=-rid-&s=em')
	 		.attr('frameborder', '0')
			.attr('scrolling', 'no')
			.appendTo(chatbox)
			;
			
	if (!chatbox_pinned)
		chatbox
				.mouseenter(fade_in)
				.mouseleave(fade_out)
				.delay(1000)
				.mouseleave()
				;

	$('#btn-toggle-chat').text('Disable Chat');
	resize();
	}

function toggle_pin_chat() {
	// Update switch and button text first
	chatbox_pinned = !chatbox_pinned;
	$('#btn-toggle-pin-chat').text(chatbox_pinned ? 'Unpin Chat' : 'Pin Chat');
	var chatbox = $('#chatbox');
	if (chatbox.length == 0)
		return;

	if (chatbox_pinned) 
		chatbox
				.mouseenter()
				.unbind('mouseenter')
				.unbind('mouseleave')
	else
		chatbox
				.mouseenter(fade_in)
				.mouseleave(fade_out)
				.mouseleave()
				;
	}

function toggle_jtv_controls() {
	show_jtv_controls = !show_jtv_controls;
	$('#btn-toggle-jtv-controls').text((show_jtv_controls ? 'Hide' : 'Show') + ' Controls');
	resize();
	}

function inc_chat_width() {
	chat_width += 20;
	resize();
	}

function dec_chat_width() {
	chat_width -= 20;
	if (chat_width < 300)
		chat_width = 300;
	resize();
	}

function resize() {
	var jtvembed = $('#jtvembed');
	jtvembed
			.height($(window).height() + (show_jtv_controls ? 0 : JTV_CONTROLS_HEIGHT))
			.width($(window).width())
			;
	
	var chatbox = $('#chatbox')
	if (chatbox.length == 1) {
		var top = 40;
		var height = $(window).height() - top - (!show_jtv_controls ? 0 : JTV_CONTROLS_HEIGHT);
		var width = chat_width;
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

// Using animate() to fade element, so the element won't be hidden and
// mouseenter event can still occur on the element after fadeout.
function fade_in() {
	$(this).animate({'opacity': 0.8});
	}

function fade_out() {
	$(this).animate({'opacity': 0});
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

	var _param = function(name, value) {
		return $('<param/>').attr('name', name).attr('value', value);
		}

	var jtvembed = $('<object/>')
			.attr('id', 'jtvembed')
			.attr('type', 'application/x-shockwave-flash')
			.attr('data', 'http://www.justin.tv/widgets/live_embed_player.swf?channel=' + channel)
			.attr('bgcolor', '#000000')
			.append(_param('flashvars'				, 'hostname=www.justin.tv&channel=' + channel + '&auto_play=false&start_volume=25'))
			.append(_param('allowFullScreen'	, 'true'))
			.append(_param('allowScriptAccess', 'always'))
			.append(_param('allowNetworking'	, 'all'))
			.append(_param('movie'						, 'http://www.justin.tv/widgets/live_embed_player.swf'))
			.append(_param('wmode'						, 'opaque'))
			.height($(window).height() + (show_jtv_controls ? 0 : JTV_CONTROLS_HEIGHT))
			.width($(window).width())
			.appendTo($('body'));

	var controls = $('<div/>')
			.attr('id', 'controls')
			.append($('<div/>').append($('<button/>')
					.attr('id', 'btn-toggle-chat')
					.text('Enable Chat')
					.click(toggle_chat)
					))
			.append($('<div/>').append($('<button/>')
					.attr('id', 'btn-toggle-pin-chat')
					.text('Pin Chat')
					.click(toggle_pin_chat)
					))
			.append($('<div/>')
					.append($('<button/>')
							.attr('id', 'btn-chat-width-inc')
							.text('[<< ]')
							.addClass('half-size')
							.click(inc_chat_width)
							)
					.append($('<button/>')
							.attr('id', 'btn-chat-width-dec')
							.text('[>> ]')
							.addClass('half-size')
							.click(dec_chat_width)
							)
					)
			.append($('<div/>').append($('<button/>')
					.attr('id', 'btn-toggle-jtv-controls')
					.text('Hide Controls')
					.click(toggle_jtv_controls)
					))
			.mouseenter(fade_in)
			.mouseleave(fade_out)
			.appendTo($('body'))
			// Fading out the controls, hopefully the first time user would catch a
			// glimpse of the controls.
			.delay(1000)
			.mouseleave()
			;

	$(window).resize(resize);
	}
$(init_loader);
/* vim: set sw=2 ts=2 noet: */
