# -*- coding: utf-8 -*-
# Copyright (c) 2010, Yu-Jie Lin
# All rights reserved.
# 
# This file is licensed under the New BSD License,
# see <http://lilbtn.appspot.com/COPYING>
# 
# Website: lil.btn <http://lilbtn.appspot.com>
# Author : Yu-Jie Lin <http://j.mp/livibetter>


import os

# Switches
DEBUG = True

# Variables
SITE_NAME = u'lil∘btn'

# Under development server?
DEV = os.environ['SERVER_SOFTWARE'].startswith('Development')

# Base URI
if DEV:
  BASE_URI = 'http://localhost:8080/'
  BASE_SECURE_URI = BASE_URI
else:
  BASE_URI = 'http://%s.appspot.com/' % os.environ['APPLICATION_ID']
  BASE_SECURE_URI = 'https://%s.appspot.com/' % os.environ['APPLICATION_ID']

BEFORE_HEAD_END = ''
BEFORE_BODY_END = ''
