#!/usr/bin/env bash

function build_client() {
    (npm run _install client && npm run clean client && npm run _install client && cd client && npm run build)
}

function build_img() {
    (cd api/image && go build main.go)
}

function build_bot() {
    npm run _install bot && npm run clean bot && npm run _install bot && npm run tsc
}

if [ $1 == "bot" ]; then
    build_bot
else
    if [ $1 == "img" ]; then
        build_img
    else
        if [ $1 == "client" ]; then
            build_client
        else
            if [ $1 == "all" ]; then
                build_bot
                build_client
                build_img
            else
                echo "No valid build option provided"
            fi
        fi
    fi
fi
