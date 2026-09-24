import { useEffect, useState } from 'react'
import BrandMark from './BrandMark'


function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function BrandPanel() {
  const now = useClock()
  const time = now.toLocaleTimeString('en-GB', { hour12: false })

  return (
    <aside className="relative hidden overflow-hidden bg-ink text-paper lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:p-12 xl:w-[48%] xl:p-16">
            <BrandMark className="pointer-events-none absolute inset-0 m-auto h-[55%] w-[55%] text-gold/10" />
      <div className="grain" />

      <header className="animate-rise relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <BrandMark className="h-7 w-7 text-gold" />
          <span className="font-mono text-[11px] tracking-[0.42em] text-paper/90">NORTHLIGHT</span>
        </div>
        <span className="hidden font-mono text-[10px] tracking-[0.2em] text-paper/50 sm:block">
          FIELD SYSTEM — N°01
        </span>
      </header>

      <div className="animate-rise relative z-10 max-w-[26rem]" style={{ animationDelay: '120ms' }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold">
          The quiet workspace
        </p>
        <p className="mt-7 font-display text-[clamp(2.5rem,3.6vw,3.6rem)] font-light leading-[1.07] tracking-[-0.01em]">
          Good work is made
          <br />
          in the <em className="italic text-gold">cold, clear light.</em>
        </p>
        <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-paper/55">
          Northlight keeps projects, notes and reviews in one calm place —
          built for small teams who care about the craft.
        </p>
      </div>

      <footer
        className="animate-rise relative z-10 flex items-end justify-between font-mono text-[10px] tracking-[0.18em] text-paper/50"
        style={{ animationDelay: '220ms' }}
      >
        <div className="space-y-1.5">
          <p>59.3294° N — 18.0686° E</p>
          <p className="text-paper/75">LOCAL TIME&nbsp;&nbsp;{time}</p>
        </div>
        <p>MMXXV</p>
      </footer>
    </aside>
  )
}
