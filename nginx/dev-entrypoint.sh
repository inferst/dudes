#!/bin/sh

TEMP_CONF=$(mktemp)

cp /default.conf $TEMP_CONF

sed -i '/location \/api/,/}/s/dudes-app:3000/host.docker.internal:4200/' $TEMP_CONF
sed -i '/location \/admin/,/}/s/dudes-app:3000/host.docker.internal:4200/' $TEMP_CONF
sed -i '/location \/client/,/}/s/dudes-app:3000/host.docker.internal:4300/' $TEMP_CONF
sed -i '/location \/socket.io/,/}/s/dudes-app:3000/host.docker.internal:3000/' $TEMP_CONF
sed -i '/location \//,/}/s/dudes-website:3000/host.docker.internal:8000/' $TEMP_CONF

mv $TEMP_CONF /etc/nginx/conf.d/default.conf

exec /docker-entrypoint.sh "$@"
