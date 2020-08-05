#!/usr/bin/env bash

$TOKEN=$1
$BRANCH=$2
$DEPLOY_DIR=$3
$REMOTE=$4

curl -H "Authorization: $TOKEN" -d "branch=$BRANCH&screen=$SCREEN&workingDir=$DEPLOY_DIR&remote=$REMOTE" https://api.matievisthekat.dev/pull