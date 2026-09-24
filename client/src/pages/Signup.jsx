import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  UserRound,
} from 'lucide-react'
import BrandPanel from '../components/BrandPanel'
import BrandMark from '../components/BrandMark'
import Field from '../components/Field'
import { validateSignup } from '../lib/validate'
import { register } from '../api/client'
import { setSession } from '../auth/session'

export default function Signup() {
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [status, setStatus] = useState('idle') 
  const [formError, setFormError] = useState('')
  const [welcome, setWelcome] = useState('')
  const cardRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Create account — Northlight'
  }, [])

  const handleChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value }
    setValues(next)
    setFormError('')
    if (touched[e.target.name]) setErrors(validateSignup(next))
  }

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
    setErrors(validateSignup(values))
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
    const errs = validateSignup(values)
    setErrors(errs)
    setTouched({ name: true, email: true, password: true, confirm: true })
    if (Object.keys(errs).length > 0) return

    setStatus('submitting')
    setFormError('')
    try {
      
      const { token, user } = await register({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      setSession(token, user)
      setWelcome(user.name.split(' ')[0])
      setStatus('success')
      setTimeout(() => navigate('/dashboard', { replace: true }), 850)
    } catch (err) {
      setStatus('idle')
      const code = err.response?.status
      setFormError(
        code === 409
          ? 'An account with that email already exists — try signing in instead.'
          : code === 400
            ? 'The server rejected those details — check the fields above.'
            : 'Can’t reach the API — is the server running on port 4000?'
      )
      shake()
    }
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
            <button
              type="button"
              onClick={() => navigate('/')}
              className="animate-rise mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mist transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
              Back to sign in
            </button>

            <h1
              className="animate-rise font-display text-[2.6rem] font-light leading-[1.05] tracking-[-0.01em]"
              style={{ animationDelay: '60ms' }}
            >
              Start your <em className="italic text-gold-deep">field journal</em>
            </h1>
            <p
              className="animate-rise mt-4 text-[14px] leading-relaxed text-mist"
              style={{ animationDelay: '110ms' }}
            >
              One minute to set up. No credit card, no noise.
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
                id="name"
                name="name"
                type="text"
                label="Full name"
                icon={UserRound}
                placeholder="Astrid Holm"
                autoComplete="name"
                autoCapitalize="words"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name ? errors.name : ''}
              />

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

              <Field
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                label="Password"
                icon={Lock}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : ''}
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

              <Field
                id="confirm"
                name="confirm"
                type={showPw ? 'text' : 'password'}
                label="Confirm password"
                icon={Lock}
                placeholder="Once more, for certainty"
                autoComplete="new-password"
                value={values.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirm ? errors.confirm : ''}
              />

              <button
                type="submit"
                disabled={status !== 'idle'}
                className="group flex w-full items-center justify-center gap-2.5 bg-ink py-4 font-mono text-[12px] uppercase tracking-[0.26em] text-paper transition-colors duration-200 hover:bg-ink-2 disabled:cursor-wait disabled:opacity-90"
              >
                {status === 'idle' && (
                  <>
                    Create account
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </>
                )}
                {status === 'submitting' && (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                    Setting up…
                  </>
                )}
                {status === 'success' && (
                  <>
                    <Check className="h-4 w-4 text-gold" strokeWidth={2} />
                    Welcome, {welcome}
                  </>
                )}
              </button>
            </form>

            <p
              className="animate-rise mt-8 text-center font-mono text-[11px] leading-relaxed text-mist"
              style={{ animationDelay: '210ms' }}
            >
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-gold-deep underline underline-offset-4 transition-colors hover:text-ink"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}