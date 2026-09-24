import { useEffect, useState } from 'react'
import { API_BASE } from '../api/client'

export default function ApiStatus() {
  const [up, setUp] = useState(null) 

  useEffect(() => {
    let alive = true

    const check = async () => {
      try {
        
        const signal =
          typeof AbortSignal !== 'undefined' && AbortSignal.timeout
            ? AbortSignal.timeout(2500)
            : undefined
        const res = await fetch(`${API_BASE}/api/health`, { signal })
        if (alive) setUp(res.ok)
      } catch {
        if (alive) setUp(false)
      }
    }

    check() 
    const id = setInterval(check, 15000) 

    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  const color = up === null ? 'bg-mist' : up ? 'bg-ok' : 'bg-error'
  const label = up === null ? 'API · checking' : up ? 'API · online' : 'API · offline'

  return (
    <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
      <span className={`relative flex h-1.5 w-1.5 rounded-full ${color}`}>
        {up && <span className="absolute inset-0 animate-ping rounded-full bg-ok/60" />}
      </span>
      {label}
    </span>
  )
}