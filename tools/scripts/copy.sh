#!/usr/bin/env bash

yarn build:lib

path=${PWD}
echo $path

rm -rf $1/node_modules/@juristr/ngx-lazy-el
cp -r dist/libs/ngx-lazy-el $1/node_modules/@juristr