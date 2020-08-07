#!/usr/bin/env bash

$TOKEN=$1
$DEPLOY_DIR=$2
$REMOTE=$3

curl -H "Authorization: $TOKEN" -d "screen=$SCREEN&workingDir=$DEPLOY_DIR&remote=$REMOTE" https://api.matievisthekat.dev/pull