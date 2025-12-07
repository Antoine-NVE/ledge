#!/bin/sh
set -e

echo "Injecting API URL: $VITE_API_URL"

sed -i "s|PLACEHOLDER_API_URL|$VITE_API_URL|g" /usr/share/nginx/html/assets/*.js

exec nginx -g "daemon off;"
