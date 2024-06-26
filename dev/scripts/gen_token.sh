#!/bin/bash

API_URL="http://localhost:3001/oauth/token"
PAYLOAD='{
  "email": "user@example.com",
  "password": "password",
  "grant_type": "password",
  "client_id": "webapp_id",
  "client_secret": "web_app_secret"
}'

response=$(curl --request POST \
  --url "$API_URL" \
  --header 'Content-Type: application/json' \
  --data "$PAYLOAD")

echo "$response"
