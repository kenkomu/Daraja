#!/bin/bash

# Start ngrok in the background
ngrok http 3000 &

# Wait for ngrok to start
sleep 5

# Get the ngrok URL
export NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')
echo "NGROK URL: $NGROK_URL"

# Start the server
npm start
