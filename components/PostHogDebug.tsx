"use client"

import { usePostHog } from 'posthog-js/react'
import { Button } from '@/components/ui/button'

export function PostHogDebug() {
  const posthog = usePostHog()

  const testEvent = () => {
    console.log('Testing PostHog event...')
    posthog.capture('debug_test_event', {
      timestamp: new Date().toISOString(),
      source: 'debug_component',
      test: true
    })
    console.log('Event sent!')
  }

  const testIdentify = () => {
    console.log('Testing PostHog identify...')
    posthog.identify('test-user-' + Date.now(), {
      email: 'test@example.com',
      source: 'debug'
    })
    console.log('Identify sent!')
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50">
      <h3 className="font-bold mb-2">PostHog Debug</h3>
      <div className="space-y-2">
        <Button onClick={testEvent} size="sm" className="w-full">
          Test Event
        </Button>
        <Button onClick={testIdentify} size="sm" variant="outline" className="w-full">
          Test Identify
        </Button>
        <div className="text-xs">
          <p>PostHog: {posthog ? '✅ Connected' : '❌ Not Connected'}</p>
          <p>Check console for logs</p>
        </div>
      </div>
    </div>
  )
}