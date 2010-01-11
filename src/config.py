# Copyright (c) 2010, Yu-Jie Lin
# All rights reserved.
# 
# This file is licensed under the New BSD License,
# see <http://lilbtn.appspot.com/COPYING>
# 
# Website: lil.btn <http://lilbtn.appspot.com>
# Author : Yu-Jie Lin <http://j.mp/livibetter>


import logging

from config_base import *
try:
  from config_custom import *
except ImportError:
  logging.warning('You do not have config_custom.py.')
