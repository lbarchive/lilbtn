/* 
Copyright (c) 2010, Yu-Jie Lin
All rights reserved.

This file is licensed under the New BSD License,
see <http://lilbtn.appspot.com/COPYING>

Website: lil.btn <http://lilbtn.appspot.com>
Author : Yu-Jie Lin <http://j.mp/livibetter>
*/


google.load("jquery", "1");


google.setOnLoadCallback(function() {
  $('head').append('<link href="http://lilbtn.appspot.com/g/fb/fb.css" rel="stylesheet" type="text/css"/>');
  });


function lilbtn_g_fb_get_feed_data(feed_url, callback) {
  if (!feed_url || !callback)
    return
  google.setOnLoadCallback(function() {
    var query = "select * from xml where url='https://feedburner.google.com/api/awareness/1.0/GetFeedData?uri=" + encodeURIComponent(feed_url) + "'"
    $.getJSON("http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json&callback=?", function(json) {
      if (json.error)
        callback(json)
      else
        callback(json.query.results.rsp);
      });
    })
  }


function lilbtn_g_fb_text_render(feed_url, container, _texts) {
  lilbtn_g_fb_get_feed_data(feed_url, function(rsp) {
    if (container == undefined)
      container = 'lilbtn_g_fb_text'
    texts = {subscribers: 'Subscribers', hits: 'Hits', reach: 'Reach', on: 'On'}
    if (_texts) {
      if (_texts.subscribers) texts.subscribers = _texts.subscribers;
      if (_texts.hits) texts.hits = _texts.hits;
      if (_texts.reach) texts.reach = _texts.reach;
      if (_texts.on) texts.on = _texts.on;
      }
    ele = $('#' + container)
    if (rsp.error || rsp.stat != 'ok') {
      var msg = 'Error on retrieving feed data: ' + ((rsp.error) ? rsp.error.description : rsp.err.msg) + '; Click to check out lil\u2218btn website for help';
      ele.html('<a href="http://lilbtn.appspot.com/help" class="lilbtn_g_fb_text lilbtn_error""><img src="http://lilbtn.appspot.com/img/error.png" alt="' + msg + '" title="' + msg + '"/></a>');
      return;
      }
    var data = rsp.feed.entry;
    ele
      .text(data.circulation)
      .attr('title', texts.subscribers + ': ' + data.circulation + ' ' + texts.hits + ': ' + data.hits + ' ' + texts.reach + ': ' + data.reach + ' ' + texts.on + ' ' + data.date);
    if (!ele.attr('class') || ele.attr('class').indexOf('lilbtn_g_fb_text') == -1)
      ele.attr('class', ele.attr('class') + ' lilbtn_g_fb_text');
    });
  }


function lilbtn_g_fb_feedcount_render(feed_url, container, _texts) {
  lilbtn_g_fb_get_feed_data(feed_url, function(rsp) {
    if (container == undefined)
      container = 'lilbtn_g_fb_feedcount'
    texts = {readers: 'readers', subscribers: 'Subscribers', hits: 'Hits', reach: 'Reach', on: 'On'}
    if (_texts) {
      if (_texts.readers) texts.readers = _texts.readers;
      if (_texts.subscribers) texts.subscribers = _texts.subscribers;
      if (_texts.hits) texts.hits = _texts.hits;
      if (_texts.reach) texts.reach = _texts.reach;
      if (_texts.on) texts.on = _texts.on;
      }
    ele = $('#' + container)
    if (rsp.error || rsp.stat != 'ok') {
      var msg = 'Error on retrieving feed data: ' + ((rsp.error) ? rsp.error.description : rsp.err.msg) + '; Click to check out lil\u2218btn website for help';
      ele.html('<a href="http://lilbtn.appspot.com/help" class="lilbtn_g_fb_feedcount lilbtn_error""><img src="http://lilbtn.appspot.com/img/error.png" alt="' + msg + '" title="' + msg + '"/></a>');
      return;
      }
    var data = rsp.feed.entry;
    count = data.circulation;
    if (count > 99999)
      count = Math.floor(count / 1000) + 'K';
    ele
      .html('<a href="' + feed_url + '" class="lilbtn_g_fb_feedcount_link"><span class="lilbtn_g_fb_feedcount_outer"><span class="lilbtn_g_fb_feedcount_count">' + count + '</span><span class="lilbtn_g_fb_feedcount_text">' + texts.readers + '</span></span></a>')
      .attr('title', texts.subscribers + ': ' + data.circulation + ' ' + texts.hits + ': ' + data.hits + ' ' + texts.reach + ': ' + data.reach + ' ' + texts.on + ' ' + data.date);
    if (!ele.attr('class') || ele.attr('class').indexOf('lilbtn_g_fb_feedcount') == -1)
      ele.attr('class', ele.attr('class') + ' lilbtn_g_fb_feedcount');
    });
  }
// vim:ts=2:sw=2:et:ai:
