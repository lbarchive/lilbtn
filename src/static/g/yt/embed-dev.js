function change_thumbnail(thumb_name) {
	$('.thumbnail').fadeOut('normal', function() {$(this).remove()});
	// Show the thumbnail
	var thumbs = yt.thumbs;
	var thumb = (thumb_name.indexOf('default') != -1) ? (('hqdefault' in thumbs) ? thumbs['hqdefault'] : thumbs['default']) : thumbs[thumb_name];
	// Calculating resizing
	var thumb_width = thumb.width;
	var thumb_height = thumb.height;
	var width = $(window).width();
	var height = $(window).height();
	if (width / thumb_width * thumb_height / height >
			height / thumb_height * thumb_width / width) {
		thumb_height = width / thumb_width * thumb_height;
		thumb_width = width;
		}
	else {
		thumb_width = height / thumb_height * thumb_width;
		thumb_height = height;
		}
	$('<img/>')
			.addClass('thumbnail')
			.attr('src', thumb.url)
			.css('left', ((width - thumb_width) / 2).toFixed() + 'px')
			.css('top', ((height - thumb_height) / 2).toFixed() + 'px')
			.width(thumb_width)
			.height(thumb_height)
			.hide()
			.appendTo($('#loader'))
			.fadeIn('normal')
			;
	}

function slideshow() {
	yt.slideshow_timer = undefined;
	switch (yt.slideshow_name) {
		case 'start':
			yt.slideshow_name = 'middle';
			break;
		case 'middle':
			yt.slideshow_name = 'end';
			break;
		default:
			yt.slideshow_name = 'start';
			break;
		}
	change_thumbnail(yt.slideshow_name);
	yt.slideshow_timer = window.setTimeout('slideshow()', 3000);
	}

function start_slideshow() {
	yt.slideshow_timer = window.setTimeout('slideshow()', 3000);
	}

function end_slideshow() {
	if (yt.slideshow_timer) {
		window.clearTimeout(yt.slideshow_timer);
		yt.slideshow_timer = undefined;
		}
	if (yt.slideshow_name != 'default') {
		yt.slideshow_name = 'default';
		change_thumbnail('default');
		}
	}

function load_yt_player() {
	var width = $(window).width();
	var height = $(window).height();
  var html = '<iframe title="YouTube video player" width="' + width + '" height="' + height+ '" src="' + document.location.protocol+ '//www.youtube.com' + document.location.pathname + document.location.search + '" frameborder="0" allowfullscreen></iframe>';
	$(html)
			.appendTo($('body'))
			.load(function() {
					$('#loader').fadeOut('normal', function() {
							$(this).remove()
							});
					})
			;
	}

function init_loader() {
	// Extract information from document.location.href
	var m = /\/embed\/([_0-9a-zA-Z-]+)$/.exec(document.location.pathname);
	if (!m) {
		// shouldn't be happening since app.yaml filter out already
		// FIXME
		return;
		}
	var video_id = m[1];
	var yt_api_url = document.location.protocol + '//gdata.youtube.com/feeds/api/videos/' + video_id + "?v=2&fields=title,author(name),link[@rel='alternate'],media:group(media:thumbnail)&alt=json";
  var yt_api_url_en = encodeURIComponent('select * from json where url="' + yt_api_url + '"');
  var yql_url = document.location.protocol + '//query.yahooapis.com/v1/public/yql?q=' + yt_api_url_en + '&format=json&callback=?';
  $.getJSON(yql_url, function(data) {
			var loader = $('<div/>').attr('id', 'loader');
			if (!data.query.results) {
				$('<div/>')
						.addClass('meta')
						.append($('<div/>').addClass('title').text('Unable to get video information'))
						.appendTo(loader)
						;
				url = 'http://www.youtube.com/watch?v=' + video_id;
				$('<div/>')
						.addClass('watch-on-yt')
						.append($('<a/>')
								.attr('href', url)
								.html('Watch on YouTube &raquo;')
								.click(function(evt) {
										evt.preventDefault();
										window.open(url);
										return false;
										})
								)
						.appendTo(loader)
						;
				loader.appendTo($('body'));
				return;
				}
			var entry = data.query.results.json.entry;
			var title = entry.title._t;
			var url = entry.link.href;
			// TODO Find out is that possible a video could have more than one author
			var author = entry.author.name._t;
			var thumbs = {};
			$.each(entry.media_group.media_thumbnail, function (idx, thumb) {
				thumbs[thumb.yt_name] = thumb;
				});
			// Video title
			$('<div/>')
					.addClass('meta')
					.append($('<div/>').addClass('title').text(title))
					.append($('<div/>').addClass('author').text('by ' + author))
					.appendTo(loader)
					;
			// Link to YT
			$('<div/>')
					.addClass('watch-on-yt')
					.append($('<a/>')
							.attr('href', url)
							.html('Watch on YouTube &raquo;')
							.click(function(evt) {
									evt.preventDefault();
									window.open(url);
									return false;
									})
							)
					.appendTo(loader)
					;
			// Hint text
			$('<div/>')
					.addClass('hint')
					.text('Click to load YouTube Player')
					.appendTo(loader)
					;
			loader.appendTo($('body'));
			var yt = {
					title: title,
					url: url,
					author: author,
					thumbs: thumbs,
					slideshow_name: 'default'
					};
			window.yt = yt;
			change_thumbnail('default');
			loader
					.mouseenter(start_slideshow)
					.mouseleave(end_slideshow)
					.click(load_yt_player)
					;
			});
	}
$(init_loader);
/* vim: set sw=2 ts=2 noet: */
