/*
Copyright (c) 2010, Yu-Jie Lin
All rights reserved.

This file is licensed under the New BSD License,
see <http://lilbtn.appspot.com/COPYING>

Website: lil.btn <http://lilbtn.appspot.com>
Author : Yu-Jie Lin <http://j.mp/livibetter>
*/


google.load("jquery", "1");


function how_btn_works() {
  if ($('#btn div.btn').length > 0)
    return;
  var container = $('#btn')
  var btn = $('<div class="btn"><a href="http://www.youtube.com/watch?v=gt9j80Jkc_A"><em>Yeah, you do know how a button works, don\'t you?</em></a></div>');
  container
    .hide()
    .prepend(btn)
    .slideDown('slow')
    .fadeIn('slow');
  window.timer_btn = undefined;
  }


google.setOnLoadCallback(function () {
  $('#btn-trigger')
    .mouseover(function() {
      if ($('#btn div.btn').length > 0 || window.timer_btn)
        return;
      window.timer_btn = window.setTimeout(how_btn_works, 3000);
      })
    .mouseout(function() {
      if (window.timer_btn) {
        window.clearTimeout(window.timer_btn);
        window.timer_btn = undefined;
        }
      });
  });

// vim:ts=2:sw=2:et:ai:
