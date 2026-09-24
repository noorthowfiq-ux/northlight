import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Copy, FileDown, GitBranch, Loader2, LogOut, MessageSquare, PenLine } from 'lucide-react'
import BrandMark from '../components/BrandMark'
import { me } from '../api/client'
import { clearSession, getSession } from '../auth/session'

const ICONS = {
  file: FileDown,
  git: GitBranch,
  message: MessageSquare,
  pen: PenLine,
}

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export default function Dashboard() {
  const [state, setState] = useState({ status: 'loading' })
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Dashboard — Northlight'

    const { token } = getSession()
    if (!token) {
      navigate('/', { replace: true })
      return
    }

    me(token)
      .then((data) => setState({ status: 'ready', ...data }))
      .catch(() => {
        clearSession() 
        navigate('/', { replace: true })
      })
  }, [navigate])

  const signOut = () => {
    clearSession()
    navigate('/', { replace: true })
  }

  const copyToken = async () => {
    const { token } = getSession()
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      
    }
  }

  if (state.status !== 'ready') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper text-ink">
        <Loader2 className="h-5 w-5 animate-spin text-mist" />
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
          Checking your session…
        </p>
      </div>
    )
  }

  const { user, issuedAt, activity } = state
  const firstName = user.name.split(' ')[0]
  const hour = new Date().getHours()
  const partOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
  const { token } = getSession()

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <BrandMark className="h-6 w-6 text-gold-deep" />
            <span className="font-mono text-[11px] tracking-[0.42em]">NORTHLIGHT</span>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-mist transition-colors hover:border-ink hover:text-ink"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <p className="animate-rise font-mono text-[11px] uppercase tracking-[0.28em] text-mist">
          Session active
        </p>
        <h1
          className="animate-rise mt-4 font-display text-[clamp(2.4rem,5vw,3.4rem)] font-light leading-[1.05]"
          style={{ animationDelay: '60ms' }}
        >
          Good {partOfDay}, <em className="italic text-gold-deep">{firstName}.</em>
        </h1>
        <p
          className="animate-rise mt-4 max-w-lg text-[15px] leading-relaxed text-mist"
          style={{ animationDelay: '110ms' }}
        >
          You’re signed in as <span className="text-ink">{user.role}</span>. This dashboard is a
          demo — but the session behind it is real.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section className="animate-rise border border-line p-7" style={{ animationDelay: '150ms' }}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">Account</h2>
            <dl className="mt-6">
              {[
                ['Name', user.name],
                ['Email', user.email],
                ['Role', user.role],
                [
                  'Signed in',
                  new Date(issuedAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }),
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-6 border-b border-line/70 py-3.5 last:border-0"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">{k}</dt>
                  <dd className="text-right text-[14px]">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="animate-rise border border-line p-7" style={{ animationDelay: '200ms' }}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
              Recent activity
            </h2>
            <ul className="mt-6 space-y-5">
              {activity.map((item) => {
                const Icon = ICONS[item.icon] ?? FileDown
                return (
                  <li key={item.at + item.text} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-line">
                      <Icon className="h-3.5 w-3.5 text-mist" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-[14px] leading-snug">{item.text}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mist">
                        {timeAgo(item.at)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>

        <section
          className="animate-rise mt-6 border border-dashed border-line p-7"
          style={{ animationDelay: '250ms' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
              Session token
            </h2>
            <button
              onClick={copyToken}
              className="flex items-center gap-2 border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mist transition-colors hover:border-ink hover:text-ink"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-ok" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="mt-5 break-all font-mono text-[11px] leading-relaxed text-ink/70">{token}</p>
          <p className="mt-4 text-[13px] leading-relaxed text-mist">
            A real HS256 JWT signed by the Express server with node:crypto — paste it into jwt.io
            and the signature will verify. It expires an hour after issue, and this page bounces
            you back to sign-in when it does.
          </p>
        </section>
      </main>
    </div>
  )
}