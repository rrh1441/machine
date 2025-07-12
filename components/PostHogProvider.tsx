"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "https://us.i.posthog.com",
      ui_host: "https://us.posthog.com",
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_exceptions: true,
      debug: true, // Always enable debug for troubleshooting
      loaded: (posthog) => {
        console.log('PostHog loaded successfully')
        if (process.env.NODE_ENV === 'development') {
          posthog.debug()
        }
      }
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
