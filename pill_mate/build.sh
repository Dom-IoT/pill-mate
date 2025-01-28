#!/usr/bin/bash

set -e

source .env

build_backend() {
    pushd backend
    npm install
    npm run build
    popd
}

build_frontend() {
    if [ $DEV -eq 0 ]; then
        pushd frontend
        npm install
        npm run build
        popd
    fi
}

build_backend &
build_frontend &
wait
