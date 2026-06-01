'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm]         = useState({ email: '', password: '' })
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }))
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.email.trim())                       e.email    = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email    = 'Enter a valid email'
    if (!form.password)                           e.password = 'Password is required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setLoading(true)
    // TODO: call auth service
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'hsl(var(--background))' }}>
      {/* Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: 'hsl(var(--accent))', boxShadow: 'var(--shadow-accent)' }}>
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="text-center">
              <h1 className="text-[22px] font-display font-800 tracking-tight text-foreground">Welcome back</h1>
              <p className="mt-1 text-[13px]" style={{ color: 'hsl(var(--foreground-muted))' }}>Sign in to your Streamix account</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Field label="Email"    type="email"    value={form.email}    onChange={set('email')}    placeholder="you@example.com"  error={errors.email}    autoComplete="email" />
            <Field
              label="Password" type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')}
              placeholder="Your password" error={errors.password} autoComplete="current-password"
              suffix={
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ color: 'hsl(var(--foreground-subtle))' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <Link href="/forgot-password" className="text-[12px] font-medium self-end -mt-2 transition-opacity hover:opacity-70" style={{ color: 'hsl(var(--accent))' }}>
              Forgot password?
            </Link>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 rounded-md text-[14px] font-display font-700 text-white flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: 'hsl(var(--accent))', boxShadow: 'var(--shadow-accent)', opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = 'hsl(var(--accent-hover))' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = 'hsl(var(--accent))' }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ backgroundColor: 'hsl(var(--border))' }} />
            <span className="text-[11px]" style={{ color: 'hsl(var(--foreground-subtle))' }}>New to Streamix?</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'hsl(var(--border))' }} />
          </div>

          <Link
            href="/register"
            className="w-full py-2.5 rounded-md text-[13px] font-medium text-center transition-colors"
            style={{ backgroundColor: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.backgroundColor = 'hsl(var(--surface-hover))')}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.backgroundColor = 'hsl(var(--surface))')}
          >
            Create an account
          </Link>
        </div>
      </div>

      {/* Branding panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[420px] shrink-0" style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 fill-white text-white" />
          <span className="text-[14px] font-display font-700" style={{ color: 'hsl(var(--sidebar-fg))' }}>Streamix</span>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[26px] font-display font-800 tracking-tight leading-tight" style={{ color: 'hsl(var(--sidebar-fg))' }}>
              Cloud-native<br />video processing
            </p>
            <p className="mt-3 text-[13px] leading-relaxed" style={{ color: 'hsl(var(--sidebar-fg-muted))' }}>
              Upload once. Transcode everywhere. Built on Go, Redis Streams, FFmpeg, and S3 — production-grade architecture from day one.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['HLS Streaming', 'FFmpeg', 'Redis Streams', 'S3 Storage', 'Realtime Progress'].map(f => (
              <span key={f} className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'hsl(var(--sidebar-item-hover))', color: 'hsl(var(--sidebar-fg))', border: '1px solid hsl(var(--sidebar-border))' }}>
                {f}
              </span>
            ))}
          </div>
        </div>
        <p className="text-[11px]" style={{ color: 'hsl(var(--sidebar-fg-muted))' }}>
          © {new Date().getFullYear()} Streamix. Open-source media platform.
        </p>
      </div>
    </div>
  )
}

interface FieldProps {
  label: string; type: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string; error?: string; autoComplete?: string; suffix?: React.ReactNode
}
function Field({ label, type, value, onChange, placeholder, error, autoComplete, suffix }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-foreground">{label}</label>
      <div className="relative flex items-center">
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
          className="w-full px-3 py-2.5 rounded-md text-[13px] outline-none transition-all"
          style={{
            backgroundColor: 'hsl(var(--surface))',
            border: `1px solid ${error ? 'hsl(var(--error))' : 'hsl(var(--border))'}`,
            color: 'hsl(var(--foreground))',
            paddingRight: suffix ? '2.5rem' : undefined,
          }}
          onFocus={e => (e.currentTarget.style.borderColor = error ? 'hsl(var(--error))' : 'hsl(var(--accent))')}
          onBlur={e => (e.currentTarget.style.borderColor = error ? 'hsl(var(--error))' : 'hsl(var(--border))')}
        />
        {suffix && <div className="absolute right-3 flex items-center">{suffix}</div>}
      </div>
      {error && <p className="text-[11px]" style={{ color: 'hsl(var(--error))' }}>{error}</p>}
    </div>
  )
}