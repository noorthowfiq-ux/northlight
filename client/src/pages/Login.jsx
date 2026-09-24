import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Eye, EyeOff, Loader2, Lock, Mail,UserPlus } from 'lucide-react'
import BrandPanel from '../components/BrandPanel'
import BrandMark from '../components/BrandMark'
import Field from '../components/Field'
import ApiStatus from '../components/ApiStatus'
import { validateLogin } from '../lib/validate'
import { login } from '../api/client'
import { setSession } from '../auth/session'

export default function Login() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [status, setStatus] = useState('idle') 
  const [formError, setFormError] = useState('')
  const [welcome, setWelcome] = useState('')
  const cardRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Sign in — Northlight'
  }, [])

  const handleChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value }
    setValues(next)
    setFormError('')
    
    if (touched[e.target.name]) setErrors(validateLogin(next))
  }

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
    setErrors(validateLogin(values))
  }

  const shake = () => {
    const el = cardRef.current
    if (!el) return
    el.classList.remove('animate-shake')
    void el.offsetWidth 
    el.classList.add('animate-shake')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateLogin(values)
    setErrors(errs)
    setTouched({ email: true, password: true })
    if (Object.keys(errs).length > 0) return

    setStatus('submitting')
    setFormError('')
    try {
      const { token, user } = await login(values)
      setSession(token, user)
      setWelcome(user.name.split(' ')[0])
      setStatus('success')
      setTimeout(() => navigate('/dashboard', { replace: true }), 850)
    } catch (err) {
      setStatus('idle')
      const code = err.response?.status
      setFormError(
        code === 401
          ? 'Those credentials didn’t match our records — please create an account first..'
          : code === 429
            ? 'Too many attempts. Take a breath and try again in a minute.'
            : 'Can’t reach the API — is the server running on port 4000?'
      )
      shake()
    }
  }

  const fillDemo = () => {
    setValues({ email: 'mara@northlight.app', password: 'northlight123' })
    setErrors({})
    setTouched({})
    setFormError('')
  }

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <BrandPanel />

      <main className="flex flex-1 items-center justify-center px-6 py-14 sm:px-10">
        <div className="w-full max-w-[25rem]">
          {/* mobile-only brand row */}
          <div className="mb-12 flex items-center gap-3 lg:hidden">
            <BrandMark className="h-6 w-6 text-gold-deep" />
            <span className="font-mono text-[11px] tracking-[0.42em]">NORTHLIGHT</span>
          </div>

          <div ref={cardRef}>
            <p className="animate-rise font-mono text-[11px] uppercase tracking-[0.3em] text-mist">
              Welcome back
            </p>
            <h1
              className="animate-rise mt-4 font-display text-[2.6rem] font-light leading-[1.05] tracking-[-0.01em]"
              style={{ animationDelay: '60ms' }}
            >
              Sign in to your <em className="italic text-gold-deep">workspace</em>
            </h1>
            <p
              className="animate-rise mt-4 text-[14px] leading-relaxed text-mist"
              style={{ animationDelay: '110ms' }}
            >
              Enter your credentials to get back to the field.
            </p>

            {formError && (
              <div
                role="alert"
                className="animate-rise mt-6 flex items-start gap-2.5 border-l-2 border-error bg-error/[0.06] px-4 py-3 font-mono text-[12px] leading-relaxed text-error"
              >
                <span className="mt-[5px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-error" />
                {formError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="animate-rise mt-9 space-y-6"
              style={{ animationDelay: '160ms' }}
            >
              <Field
                id="email"
                name="email"
                type="email"
                label="Email"
                icon={Mail}
                placeholder="you@studio.com"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck="false"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : ''}
              />

              <div>
                <Field
                  id="password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  label="Password"
                  icon={Lock}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password ? errors.password : ''}
                  labelRight={
                    <button
                      type="button"
                      onClick={() => setShowForgot((v) => !v)}
                      className="font-mono text-[11px] text-mist underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      Forgot?
                    </button>
                  }
                  right={
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      className="shrink-0 text-mist transition-colors hover:text-ink"
                    >
                      {showPw ? (
                        <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={1.5} />
                      )}
                    </button>
                  }
                />
                {showForgot && (
                  <p className="animate-rise mt-3 font-mono text-[11px] leading-relaxed text-mist">
                    Resets are disabled in this demo build — use the demo access below.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status !== 'idle'}
                className="group flex w-full items-center justify-center gap-2.5 bg-ink py-4 font-mono text-[12px] uppercase tracking-[0.26em] text-paper transition-colors duration-200 hover:bg-ink-2 disabled:cursor-wait disabled:opacity-90"
              >
                {status === 'idle' && (
                  <>
                    Sign in
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </>
                )}
                {status === 'submitting' && (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                    Verifying…
                  </>
                )}
                {status === 'success' && (
                  <>
                    <Check className="h-4 w-4 text-gold" strokeWidth={2} />
                    Welcome back, {welcome}
                  </>
                )}
              </button>
            </form>

            <div
              className="animate-rise mt-9 border border-dashed border-line px-4 py-4 font-mono text-[11px] leading-relaxed text-mist"
              style={{ animationDelay: '210ms' }}
            >
              <span className="text-ink/80">Demo access</span> — mara@northlight.app /
              northlight123{' '}
              <button
                type="button"
                onClick={fillDemo}
                className="ml-1 whitespace-nowrap text-gold-deep underline underline-offset-4 transition-colors hover:text-ink"
              >
                autofill
              </button>
            </div>
                        <div className="animate-rise mt-9" style={{ animationDelay: '240ms' }}>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="group flex w-full items-center justify-center gap-2.5 border border-ink py-4 font-mono text-[12px] uppercase tracking-[0.26em] text-ink transition-colors duration-200 hover:bg-ink hover:text-paper"
              >
                <UserPlus className="h-4 w-4" strokeWidth={1.5} />
                Create account
              </button>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-mist">
                New to Northlight? Start a field journal
              </p>
            </div>
            <div
              className="animate-rise mt-9 flex items-center justify-between"
              style={{ animationDelay: '260ms' }}
            >
              <button
                type="button"
                onClick={() => setShowInvite((v) => !v)}
                className="font-mono text-[11px] text-mist underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Request an invite
              </button>
              <ApiStatus />
            </div>
            {showInvite && (
              <p className="animate-rise mt-3 font-mono text-[11px] leading-relaxed text-mist">
                Invites are closed while we’re in beta — wave two opens in spring.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}