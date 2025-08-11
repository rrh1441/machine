#!/bin/bash

# This script recreates the Calendly webhook with a custom signing key
# The signing key MUST be provided when creating the webhook - it cannot be retrieved later

CALENDLY_TOKEN="eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzU0OTQxMzM0LCJqdGkiOiJmYzJhNWNlYi1lODIxLTQxNTktOTllYS03MWMwMDE5MmIyYWQiLCJ1c2VyX3V1aWQiOiIyYmRkYzlkZS0xOWI1LTRlNWEtYTMzOC1hZDllODE1ODNkMWYifQ.1KvhNmy8af4kT0Ymm7LmkldS5pBSDnI7dXzCrQ-Iruqun5d7bxmdYFKexBeqSPP_5A9rF3hPCLqvWqvuk_2Deg"  # Replace with your token
CUSTOM_SIGNING_KEY="your_secure_random_key_here_$(openssl rand -hex 32)"  # Generate a secure key

echo "Generated signing key: $CUSTOM_SIGNING_KEY"
echo ""

# Get organization URI
echo "Getting organization info..."
ORG_URI=$(curl -s -H "Authorization: Bearer $CALENDLY_TOKEN" \
  https://api.calendly.com/users/me | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['resource']['current_organization'])")

echo "Organization URI: $ORG_URI"

# Delete existing webhooks first
echo "Checking for existing webhooks..."
EXISTING_WEBHOOKS=$(curl -s -H "Authorization: Bearer $CALENDLY_TOKEN" \
  "https://api.calendly.com/webhook_subscriptions?organization=$ORG_URI&scope=organization" | \
  python3 -c "import sys, json; hooks = json.load(sys.stdin)['collection']; [print(h['uri']) for h in hooks if 'seattleballmachine.com' in h['callback_url']]" 2>/dev/null)

if [ ! -z "$EXISTING_WEBHOOKS" ]; then
  echo "Deleting existing webhook(s)..."
  for webhook_uri in $EXISTING_WEBHOOKS; do
    curl -X DELETE -H "Authorization: Bearer $CALENDLY_TOKEN" "$webhook_uri"
    echo "Deleted: $webhook_uri"
  done
fi

# Create new webhook with custom signing key
echo ""
echo "Creating new webhook with signing key..."
RESPONSE=$(curl -s -X POST https://api.calendly.com/webhook_subscriptions \
  -H "Authorization: Bearer $CALENDLY_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"https://www.seattleballmachine.com/api/webhooks/calendly\",
    \"events\": [\"invitee.created\", \"invitee.canceled\"],
    \"organization\": \"$ORG_URI\",
    \"scope\": \"organization\",
    \"signing_key\": \"$CUSTOM_SIGNING_KEY\"
  }")

# Check if successful
if echo "$RESPONSE" | grep -q "callback_url"; then
  echo "✅ Webhook created successfully!"
  echo ""
  echo "========================================="
  echo "ADD THESE TO YOUR VERCEL ENVIRONMENT VARIABLES:"
  echo "========================================="
  echo "CALENDLY_WEBHOOK_SIGNING_KEY=$CUSTOM_SIGNING_KEY"
  echo "CALENDLY_ORGANIZATION_URI=$ORG_URI"
  echo "CALENDLY_API_TOKEN=$CALENDLY_TOKEN"
  echo "========================================="
  echo ""
  echo "IMPORTANT: Save the signing key above! It cannot be retrieved later."
else
  echo "❌ Failed to create webhook:"
  echo "$RESPONSE"
fi