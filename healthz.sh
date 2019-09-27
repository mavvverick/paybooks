#!/bin/sh

status=$(pm2 jlist | jq -r '.[0].pm2_env.status')
if [ $status != "online" ]; then
    exit 1
else
    exit 0
fi