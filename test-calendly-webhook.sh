#!/bin/bash

# Test Calendly webhook with a sample event
echo "Testing Calendly webhook endpoint..."

# Sample Calendly invitee.created event
PAYLOAD='{
  "event": "invitee.created",
  "payload": {
    "uuid": "test-invitee-123",
    "email": "test@example.com",
    "name": "Test User",
    "event": {
      "uuid": "test-event-456",
      "start_time": "2025-01-15T10:00:00Z",
      "end_time": "2025-01-15T11:00:00Z"
    },
    "cancel_url": "https://calendly.com/cancellations/test",
    "reschedule_url": "https://calendly.com/reschedule/test"
  }
}'

# Test local endpoint
echo "Testing local endpoint..."
curl -X POST http://localhost:3000/api/webhooks/calendly \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  -w "\nHTTP Status: %{http_code}\n"

echo -e "\n\nTesting production endpoint..."
curl -X POST https://www.seattleballmachine.com/api/webhooks/calendly \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  -w "\nHTTP Status: %{http_code}\n"

echo -e "\n\nTo debug a specific customer, run:"
echo "curl https://www.seattleballmachine.com/api/debug/credits?email=customer@example.com"