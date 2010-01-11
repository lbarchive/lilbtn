# Copyright (c) 2010, Yu-Jie Lin
# All rights reserved.
# 
# This file is licensed under the New BSD License,
# see <http://lilbtn.appspot.com/COPYING>
# 
# Website: lil.btn <http://lilbtn.appspot.com>
# Author : Yu-Jie Lin <http://j.mp/livibetter>


import os

from google.appengine.ext.webapp import template

import config


def render_write(tmpl_values, tmpl_name, request=None, response=None):
  # A helper function to set up some common stuff, render, then write to client
  if 'HEAD' not in tmpl_values:
    tmpl_values['HEAD'] = ''
  tmpl_values['HEAD'] += '  <link href="/css/main.css?r=1" type="text/css" rel="stylesheet"/>\n'
  tmpl_values['HEAD'] += '  <script src="http://www.google.com/jsapi" type="text/javascript"></script>\n'
  tmpl_values['HEAD'] += '  <script src="/js/main.js" type="text/javascript"></script>\n'
 
  tmpl_values['config'] = config

  path = os.path.join(os.path.dirname(__file__), '../tmpl/' + tmpl_name)
  
  render_html = template.render(path, tmpl_values)
  if response:
    response.out.write(render_html)
  return render_html
