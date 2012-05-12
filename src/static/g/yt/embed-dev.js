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
  var search_id = m[1];
  var search_type = 'videos';
  var search_extra = '';
  var search_fields = "title,author(name),link[@rel='alternate'],media:group(media:thumbnail)"
//<iframe width="640" height="360" src="http://localhost:8080/embed/videoseries?index=7&amp;list=PL5D9354CAD0109DE5&amp;hl=en_US" frameborder="0" allowfullscreen></iframe>
  if (search_id == 'videoseries') {
    search_type = 'playlists';
    var playlist_id = /.*list=PL([0-9A-Z]+).*/.exec(document.location.search)[1];
    console.log(playlist_id);
    search_id = playlist_id;
    search_fields = 'entry(' + search_fields + ')';
    var start_index = /.*index=(\d+).*/.exec(document.location.search);
    start_index = start_index ? parseInt(start_index[1]) + 1 : 1;
    search_extra = '&start-index=' + start_index + '&max-results=1';
    }
  var yt_api_url = document.location.protocol
                 + '//gdata.youtube.com/feeds/api/'
                 + search_type
                 + '/'
                 + search_id
                 + '?v=2&fields='
                 + search_fields
                 + '&alt=json'
                 + search_extra;
  console.log(yt_api_url);
  var yt_api_url_en = encodeURIComponent('select * from json where url="' + yt_api_url + '"');
  var yql_url = document.location.protocol + '//query.yahooapis.com/v1/public/yql?q=' + yt_api_url_en + '&format=json&callback=?';
  $.getJSON(yql_url, function(data) {
      var loader = $('<div/>').attr('id', 'loader');
      if (!data.query.results) {
        // no results, something went wrong
        $('<div/>')
            .addClass('meta')
            .append($('<div/>').addClass('title').text('Unable to get video information'))
            .appendTo(loader)
            ;
        var url = 'http://www.youtube.com/'
                + (search_type == 'videos' ?  'watch?v=' : 'playlist?list=')
                + search_id;
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
      var entry = (search_type == 'videos')
                ? data.query.results.json.entry
                : data.query.results.json.feed.entry;
      var title = entry.title._t;
      var url = entry.link.href;
      if (search_type == 'playlists')
        url += '&list=PL' + search_id;
      // TODO Find out is that possible a video could have more than one author
      var author = entry.author.name._t;
      var thumbs = {};
      $.each(entry.media_group.media_thumbnail, function (idx, thumb) {
        thumbs[thumb.yt_name] = thumb;
        });
      // Video title
      $('<div/>')
          .addClass('meta')
          .append($('<div/>', {alt: title, title: title}).addClass('title').text(title))
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
