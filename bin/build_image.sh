#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker build -t arueth/quali-utils-nodejs:latest ${DIR}/..
