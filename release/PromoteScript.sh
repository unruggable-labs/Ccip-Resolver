#!/bin/bash

START=$(date +%s)

PROJECTDIR=/Users/thomasclowes/Development/Ccip-Resolver/

# We will send them to this host
HOST=54.210.126.85
 
# This directory on the host
HOSTDIR=/home/unruggable-gateway/Ccip-Resolver

cd ${PROJECTDIR}

#Build the site
echo "Building Ccip-Resolver"
npm run build

if [ "$?" -eq "0" ]
then
    echo "Successfully built."
else
    exit
fi

#Set the ulimit
ulimit -n 4096

echo "Installing updates..."

rsync -r -a -v -u -e "ssh -i ~/keystore/Autoscale.pem" ${PROJECTDIR} ubuntu@${HOST}:${HOSTDIR} --include='*.min.js' --exclude-from 'release/exclude-from-production.txt' --delete-excluded --no-perms --omit-dir-times --delete-after --filter 'protect /.ssh/'

if [ "$?" -eq "0" ]
then
    echo "Successfully installed the updates on the server."
else
    exit
fi

END=$(date +%s)
DIFF=$(( $END - $START ))
echo "Deployment took $DIFF seconds"