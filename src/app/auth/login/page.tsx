// src/app/auth/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase(), password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Invalid email or password')
      setLoading(false)
      return
    }

    if (data.role === 'superadmin') router.push('/superadmin')
    else router.push('/dashboard')
    router.refresh()
  }

  const inp = "w-full bg-[#1E2A47] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#0F1629' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">🗳️</span>
          <h1 className="text-3xl font-black tracking-tight mb-1">Tally<span className="text-indigo-400">Vote</span></h1>
          <p className="text-sm text-slate-400">Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email address</label>
            <input
              type="email" className={inp} placeholder="you@organization.com"
              value={email} onChange={e => setEmail(e.target.value)} required autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
            <input
              type="password" className={inp} placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Signing in...
                </span>
              : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-xs mt-8 text-slate-500">
          Don't have an account? Contact your TallyVote administrator.
        </p>
      </div>
    </div>
  )
}