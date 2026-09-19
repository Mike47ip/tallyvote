import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title:'TallyVote Admin', description:'Election management dashboard' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
