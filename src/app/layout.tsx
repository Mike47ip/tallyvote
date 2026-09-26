import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'TallyVote', description: 'Multi-tenant voting platform' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
