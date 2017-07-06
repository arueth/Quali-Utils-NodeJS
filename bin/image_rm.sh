#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source ${DIR}/.config.setup

docker image rm ${IMAGE_NAME}:${IMAGE_TAG}
