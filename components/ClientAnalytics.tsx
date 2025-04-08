// app/components/ClientAnalytics.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import the Analytics component with SSR disabled
const Analytics = dynamic(
  () => import("@vercel/analytics/react").then((mod) => mod.Analytics),
  { ssr: false }
);

export default function ClientAnalytics() {
  return <Analytics />;
}