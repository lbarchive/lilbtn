#!/bin/bash

URL=${2:-http://lilbtn.appspot.com/itchape/getitch.json}

curl -G -d "ape_id=$1" "$URL"
