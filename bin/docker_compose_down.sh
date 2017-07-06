#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source ${DIR}/.config.setup

docker-compose -p ${COMPOSE_STACK_NAME} -f ${DIR}/../docker-compose.yml -f ${DIR}/../docker-compose.override.yml down

