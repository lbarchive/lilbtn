# Copyright (c) 2010, Yu-Jie Lin
# All rights reserved.
# 
# This file is licensed under the New BSD License,
# see <http://lilbtn.appspot.com/COPYING>
# 
# Website: lil.btn <http://lilbtn.appspot.com>
# Author : Yu-Jie Lin <http://j.mp/livibetter>


import os

from google.appengine.dist import use_library
use_library('django', '1.2')

from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

from lilbtn.ui import render_write
import config


class StaticPage(webapp.RequestHandler):

  def get(self, pagename):

    if not pagename:
      pagename = 'home'

    render_write({}, pagename + '.html', self.request, self.response)

  def head(self, pagename):

    pass


application = webapp.WSGIApplication([
    ('/(donate|help)?', StaticPage),
    ],
    debug=config.DEBUG)


def main():
  
  run_wsgi_app(application)


if __name__ == "__main__":
  main()
