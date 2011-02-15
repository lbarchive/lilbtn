function show_itch(the_itch, target) {
	var $target = $('#' + target);
	var secs = Math.floor((new Date()).getTime() / 1000.0 - the_itch.scratched_at);
	var mins = Math.floor(secs / 60);
	$target.empty();
	if (the_itch.itch) {
		$target
				.append($('<span/>').addClass('itch').html(the_itch.itch))
				.append(' ')
				.append($('<span/>').addClass('itch_timesince').text('(' + mins.toString() + ((mins == 1)?' minute ago)':' minutes ago)')))
				;
		}
	else {
		$target
				.append($('<span/>').addClass('itch').html(the_itch.ape_says))
				;
		}
	}

function get_itch(ape_id, target) {
	var URL = document.location.hostname == 'localhost'
			? 'http://localhost:8080/itchape/getitch.json'
			: document.location.protocol + '//lilbtn.appspot.com/itchape/getitch.json';
	$.getJSON(URL + '?ape_id=' + ape_id + '&callback=?', function(data) {
			show_itch(data, target);
			});
	}
// vim: set sw=2 ts=2 noet:
