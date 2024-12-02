#!/usr/bin/with-contenv bashio

set -e

source .env

bashio::log.info "Generating nginx config..."

mkdir --parents /etc/nginx/http.d

cat << EOF > /etc/nginx/http.d/ingress.conf
server {
    listen 8099;
    allow  172.30.32.2;
    deny   all;

    location /api/ {
        proxy_pass http://127.0.0.1:${BACKEND_PORT}/;
    }
EOF

if [ $DEV -eq 0 ]; then
    cat << EOF >> /etc/nginx/http.d/ingress.conf
    location / {
        root /app/dist;
        index index.html;
    }
}
EOF
else
    ADDON_ID=$(curl -sSL -X GET -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" -H "Content-Type: application/json" http://supervisor/addons/local_hello_world/info | jq -r .data.ingress_entry | cut -d / -f 4)

    bashio::log.info "ADDON_ID=${ADDON_ID}"

    cat << EOF >> /etc/nginx/http.d/ingress.conf
    location / {
        proxy_pass http://10.0.2.2:${FRONTEND_PORT}/api/hassio_ingress/${ADDON_ID}/;
    }
}
EOF
fi

cat /etc/nginx/http.d/ingress.conf

bashio::log.info "Starting nginx server..."

exec nginx -g "daemon off;error_log /dev/stdout debug;" & cd backend && npm run start
