# Copyright (c) 2011, Yu-Jie Lin
# All rights reserved.
# 
# This file is licensed under the New BSD License,
# see <http://lilbtn.appspot.com/COPYING>
# 
# Website: lil.btn <http://lilbtn.appspot.com>
# Author : Yu-Jie Lin <http://j.mp/Google-livibetter>


import datetime as dt
import os
import time
from md5 import md5
from random import random
from time import gmtime, time
try:
  import simplejson as json
except ImportError:
  import json

from google.appengine.dist import use_library
use_library('django', '1.2')

from google.appengine.api import memcache
from google.appengine.api.capabilities import CapabilitySet
from google.appengine.ext import db, webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

from lilbtn.ui import render_write
import config


class SimpleCounter(db.Model):

  name = db.StringProperty(required=True)
  count = db.IntegerProperty(required=True)
  added = db.DateTimeProperty(auto_now_add=True)
  updated = db.DateTimeProperty(auto_now=True)


def pingpong_incr(key_name):

  # Changing slot every 10 minutes
  slot = gmtime().tm_min / 10 % 2
  # A bug with initial value: http://code.google.com/p/googleappengine/issues/detail?id=2012
  if memcache.incr('%s_%s' % (key_name, slot), namespace='ia') == None:
    # Can set no such key existed
    memcache.set('%s_%s' % (key_name, slot), 1, namespace='ia')


def pingpong_get(key_name, from_ping=True):

  if from_ping:
    slot = gmtime().tm_min / 10 % 2
  else:
    slot = (gmtime().tm_min + 10) / 10 % 2
  return memcache.get('%s_%s' % (key_name, slot), namespace='ia')


def pingpong_delete(key_name):

  slot = (gmtime().tm_min + 10) / 10 % 2
  memcache.delete('%s_%s' % (key_name, slot), namespace='ia')


class UpdateCron(webapp.RequestHandler):

  def update_counter(self, key_name):

    # Checking memory cache
    count = pingpong_get(key_name, from_ping=False)
    if not count:
      return

    counter = SimpleCounter.get_by_key_name(key_name)
    if not counter:
      counter = SimpleCounter(key_name=key_name, name=key_name, count=count)
    else:
      counter.count += count
    counter.put()
    pingpong_delete(key_name)

  def get(self):

    if CapabilitySet('datastore_v3', capabilities=['write']).is_enabled() \
        and CapabilitySet('memcache').is_enabled():
      self.update_counter('scratches')
      self.update_counter('itch_gets')


class ScratchPage(webapp.RequestHandler):

  def get(self):

    tmpl_vars = {
        }
    render_write(tmpl_vars, 'itchape-scratch.html', self.request, self.response)

  def post(self):

    itch = self.request.get('itch', '')[:140]
    secret_phrase = self.request.get('secret_phrase', '')[:40]
    secret_key = self.request.get('secret_key', '')[:16]
    ape_id = self.request.get('ape_id', '')[:16]

    valid_ape_id = md5(secret_key + config.IA_APEGEN_SALT + secret_phrase).hexdigest()
    valid_ape_id = md5(valid_ape_id + secret_key + config.IA_APEGEN_SALT + secret_phrase).hexdigest()[:16]

    if ape_id != valid_ape_id:
      json_result = '{"ape_says":"I\'m not your ape!"}'
    else:
      scratched_at = time()
      the_itch = {
          'itch': template.Template('{{ itch }}').render(template.Context({'itch': itch})),
          'scratched_at': scratched_at
          }
      memcache.set(ape_id, json.dumps(the_itch), time=3600, namespace='ia')
      pingpong_incr('scratches')
      result = the_itch
      result['ape_says'] = "Oooh... that feels good!"
      json_result = json.dumps(result, separators=(',', ':'))

    callback = self.request.get('callback')
    self.response.headers['Content-Type'] = 'application/json'
    if callback:
      self.response.out.write('%s(%s)' % (callback, json_result))
    else:
      self.response.out.write(json_result)

  def head(self):

    pass


class GetItchJSON(webapp.RequestHandler):

  def get(self):

    ape_id = self.request.get('ape_id', '')[:16]
    the_itch = memcache.get(ape_id, 'ia')

    if the_itch:
      # Bad ape...
      json_result = '{"ape_says":"Yeah, I was itching for that!",' + the_itch[1:]
      pingpong_incr('itch_gets')
    else:
      json_result = '{"ape_says":"Not itching, yet!"}'

    callback = self.request.get('callback')
    self.response.headers['Content-Type'] = 'application/json'
    if callback:
      self.response.out.write('%s(%s)' % (callback, json_result))
    else:
      self.response.out.write(json_result)

  def head(self):

    pass


class AdoptPage(webapp.RequestHandler):

  def get(self):

    tmpl_vars = {
        'show_result': False,
        }
    render_write(tmpl_vars, 'itchape-adopt.html', self.request, self.response)

  def post(self):

    # Phrase can be empty
    secret_phrase = self.request.get('secret_phrase', '')[:40]
    # Generate random key
    secret_key = md5(str(time()) + str(random()) + config.IA_KEYGEN_SALT).hexdigest()[:16]
    # Generate Ape ID
    ape_id = md5(secret_key + config.IA_APEGEN_SALT + secret_phrase).hexdigest()
    ape_id = md5(ape_id + secret_key + config.IA_APEGEN_SALT + secret_phrase).hexdigest()[:16]

    tmpl_vars = {
        'show_result': True,
        'secret_phrase': secret_phrase,
        'secret_key': secret_key,
        'ape_id': ape_id,
        }
    render_write(tmpl_vars, 'itchape-adopt.html', self.request, self.response)

  def head(self):

    pass


class ItchApePage(webapp.RequestHandler):

  def get(self):

    scratches = 0
    itch_gets = 0
    scratches_added = dt.datetime.utcnow()
    itch_gets_added = dt.datetime.utcnow()
    if CapabilitySet('datastore_v3', capabilities=['read']).is_enabled():
      counter = SimpleCounter.get_by_key_name('scratches')
      if counter:
        scratches += counter.count
        scratches_added = counter.added
      counter = SimpleCounter.get_by_key_name('itch_gets')
      if counter:
        itch_gets += counter.count
        itch_gets_added = counter.added
    if CapabilitySet('memcache', methods=['get']).is_enabled():
      count = pingpong_get('scratches')
      if count:
        scratches += count
      count = pingpong_get('itch_gets')
      if count:
        itch_gets += count

    tmpl_vars = {
        'scratches': scratches,
        'scratches_added': scratches_added,
        'itch_gets': itch_gets,
        'itch_gets_added': itch_gets_added,
        }
    render_write(tmpl_vars, 'itchape.html', self.request, self.response)
  
  def head(self):

    pass


application = webapp.WSGIApplication([
    ('/itchape/', ItchApePage),
    ('/itchape/adopt', AdoptPage),
    ('/itchape/scratch', ScratchPage),
    ('/itchape/getitch.json', GetItchJSON),
    ('/itchape/cron', UpdateCron),
    ],
    debug=config.DEBUG)


def main():
  
  webapp.template.register_template_library('django.contrib.humanize.templatetags.humanize')
  run_wsgi_app(application)


if __name__ == "__main__":
  main()
