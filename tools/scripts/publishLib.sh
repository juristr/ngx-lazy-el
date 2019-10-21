#!/usr/bin/env zsh

yarn build:lib

cd dist/libs/ngx-lazy-el
npm login
npm publish
