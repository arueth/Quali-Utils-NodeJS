#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker container run \
        -d \
        --name quali_utils_nodejs \
        -p 80:80 \
        -v quali_utils_data:/usr/src/app/data \
        arueth/quali-utils-nodejs:latest
