#!bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
source $SCRIPTPATH/.env

docker-machine ssh $DOCKER_HOST "cd /covid-planet && bash pull-latest-and-restart-containers.sh"