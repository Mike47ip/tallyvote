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
  const [showPassword, setShowPassword] = useState(false)

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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`${inp} pr-11`}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
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
            Don&apos;t have an account? Contact your TallyVote administrator.
        </p>
      </div>
    </div>
  )
}