#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source ${DIR}/.config.setup

docker container run \
        -it \
        -e NODEJS_PORT=${NODEJS_PORT} \
        --name ${CONTAINER_NAME} \
        --network ${NETWORK} \
        -v ${DATA_VOLUME}:/usr/src/app/www/data \
        ${IMAGE_NAME}:${IMAGE_TAG} \
        ash
