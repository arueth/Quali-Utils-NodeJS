#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker container run \
        -d \
        -e NODEJS_PORT=80 \
        --name quali_utils_nodejs \
        -p 80:80 \
        -v qualiutils_data:/usr/src/app/www/data \
        arueth/quali-utils-nodejs:latest
