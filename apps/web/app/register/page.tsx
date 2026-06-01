'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap, Loader2, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm]         = useState({ email: '', username: '', password: '', confirm: '' })
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }))
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.email.trim())                           e.email    = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email))     e.email    = 'Enter a valid email'
    if (!form.username.trim())                        e.username = 'Username is required'
    else if (form.username.length < 3)                e.username = 'At least 3 characters'
    else if (!/^[a-z0-9_]+$/.test(form.username))    e.username = 'Lowercase letters, numbers, underscores only'
    if (!form.password)                               e.password = 'Password is required'
    else if (form.password.length < 8)                e.password = 'At least 8 characters'
    if (form.password !== form.confirm)               e.confirm  = "Passwords don't match"
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

  const passwordStrength = getPasswordStrength(form.password)

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'hsl(var(--background))' }}>
      {/* Branding panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[420px] shrink-0" style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 fill-white text-white" />
          <span className="text-[14px] font-display font-700" style={{ color: 'hsl(var(--sidebar-fg))' }}>Streamix</span>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[26px] font-display font-800 tracking-tight leading-tight" style={{ color: 'hsl(var(--sidebar-fg))' }}>
              Start building.<br />Start streaming.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed" style={{ color: 'hsl(var(--sidebar-fg-muted))' }}>
              Join Streamix to get access to a production-grade distributed media platform. Upload, transcode, and stream at any scale.
            </p>
          </div>
          {['No upload fees', 'HLS adaptive streaming', 'Realtime job progress', 'Open source'].map(f => (
            <div key={f} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'hsl(var(--accent))' }} />
              <span className="text-[13px]" style={{ color: 'hsl(var(--sidebar-fg))' }}>{f}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px]" style={{ color: 'hsl(var(--sidebar-fg-muted))' }}>
          © {new Date().getFullYear()} Streamix. Open-source media platform.
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl lg:hidden" style={{ backgroundColor: 'hsl(var(--accent))', boxShadow: 'var(--shadow-accent)' }}>
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="text-center">
              <h1 className="text-[22px] font-display font-800 tracking-tight text-foreground">Create your account</h1>
              <p className="mt-1 text-[13px]" style={{ color: 'hsl(var(--foreground-muted))' }}>Get started with Streamix today</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Field label="Email"    type="email" value={form.email}    onChange={set('email')}    placeholder="you@example.com"       error={errors.email}    autoComplete="email" />
            <Field label="Username" type="text"  value={form.username} onChange={set('username')} placeholder="lowercase_username"     error={errors.username} autoComplete="username" hint="Letters, numbers, underscores" />

            {/* Password with strength meter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-foreground">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder="At least 8 characters" autoComplete="new-password"
                  className="w-full px-3 py-2.5 pr-10 rounded-md text-[13px] outline-none transition-all"
                  style={{ backgroundColor: 'hsl(var(--surface))', border: `1px solid ${errors.password ? 'hsl(var(--error))' : 'hsl(var(--border))'}`, color: 'hsl(var(--foreground))' }}
                  onFocus={e => (e.currentTarget.style.borderColor = errors.password ? 'hsl(var(--error))' : 'hsl(var(--accent))')}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.password ? 'hsl(var(--error))' : 'hsl(var(--border))')}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3" style={{ color: 'hsl(var(--foreground-subtle))' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i <= passwordStrength.score
                            ? passwordStrength.score <= 1 ? 'hsl(var(--error))'
                              : passwordStrength.score === 2 ? 'hsl(var(--warning))'
                              : passwordStrength.score === 3 ? 'hsl(217 91% 60%)'
                              : 'hsl(var(--success))'
                            : 'hsl(var(--border))',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] shrink-0" style={{ color: 'hsl(var(--foreground-subtle))' }}>{passwordStrength.label}</span>
                </div>
              )}
              {errors.password && <p className="text-[11px]" style={{ color: 'hsl(var(--error))' }}>{errors.password}</p>}
            </div>

            <Field label="Confirm Password" type="password" value={form.confirm} onChange={set('confirm')} placeholder="Re-enter your password" error={errors.confirm} autoComplete="new-password" />

            <button
              onClick={handleSubmit} disabled={loading}
              className="w-full py-2.5 rounded-md text-[14px] font-display font-700 text-white flex items-center justify-center gap-2 transition-all mt-1"
              style={{ backgroundColor: 'hsl(var(--accent))', boxShadow: 'var(--shadow-accent)', opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = 'hsl(var(--accent-hover))' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = 'hsl(var(--accent))' }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </div>

          <p className="text-center text-[12px]" style={{ color: 'hsl(var(--foreground-muted))' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium transition-opacity hover:opacity-70" style={{ color: 'hsl(var(--accent))' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

interface FieldProps {
  label: string; type: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string; error?: string; autoComplete?: string; hint?: string
}
function Field({ label, type, value, onChange, placeholder, error, autoComplete, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-foreground">{label}</label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
        className="w-full px-3 py-2.5 rounded-md text-[13px] outline-none transition-all"
        style={{ backgroundColor: 'hsl(var(--surface))', border: `1px solid ${error ? 'hsl(var(--error))' : 'hsl(var(--border))'}`, color: 'hsl(var(--foreground))' }}
        onFocus={e => (e.currentTarget.style.borderColor = error ? 'hsl(var(--error))' : 'hsl(var(--accent))')}
        onBlur={e => (e.currentTarget.style.borderColor = error ? 'hsl(var(--error))' : 'hsl(var(--border))')}
      />
      {(error || hint) && <p className="text-[11px]" style={{ color: error ? 'hsl(var(--error))' : 'hsl(var(--foreground-subtle))' }}>{error ?? hint}</p>}
    </div>
  )
}

function getPasswordStrength(pwd: string): { score: number; label: string } {
  if (!pwd) return { score: 0, label: '' }
  let score = 0
  if (pwd.length >= 8)                          score++
  if (pwd.length >= 12)                         score++
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd))  score++
  if (/[^A-Za-z0-9]/.test(pwd))                score++
  score = Math.max(1, Math.min(4, score))
  return { score, label: ['', 'Weak', 'Fair', 'Good', 'Strong'][score] }
}