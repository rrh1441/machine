#!/bin/bash

# Test if the webhook endpoint is accessible
echo "Testing webhook endpoint accessibility..."
curl -I https://www.seattleballmachine.com/api/webhooks/stripe

echo -e "\n\nTesting with POST (should return 503 if services not configured)..."
curl -X POST https://www.seattleballmachine.com/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  -w "\nHTTP Status: %{http_code}\n"