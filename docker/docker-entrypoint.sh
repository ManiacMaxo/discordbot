#!/bin/sh

mkdir -p /var/log/node
touch /var/log/node/access.log /var/log/node/error.log

cd /app && npm run start > /var/log/node/access.log 2> /var/log/node/error.log &

exec tail -f /var/log/**/*.log
