#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source ${DIR}/.config.setup

docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ${DIR}/..

