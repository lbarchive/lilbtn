#!/bin/bash

URL=${5:-https://lilbtn.appspot.com/itchape/scratch}

curl -s -d "secret_phrase=$1" -d "secret_key=$2" -d "ape_id=$3" -d "itch=$4" "$URL"
