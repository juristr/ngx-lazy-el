#!/usr/bin/env bash

yarn build:lib

cd dist/libs/ngx-lazy-el
npm login
npm publish