import express from 'express'
import cors from 'cors'
import { users } from './users.js'
import { signToken, verifyToken } from './token.js'

const app = express()
const PORT = process.env.PORT || 4000


app.use(cors({ origin: process.env.WEB_ORIGIN || 'http://localhost:5173' })) 
app.use(express.json()) 

                    
const attempts = new Map()
const WINDOW_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 5

function loginRateLimit(req, res, next) {
  const record = attempts.get(req.ip)
  if (record && Date.now() - record.firstAt < WINDOW_MS && record.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((WINDOW_MS - (Date.now() - record.firstAt)) / 1000)
    res.set('Retry-After', String(retryAfter))
    return res.status(429).json({ message: `Too many attempts. Try again in ${retryAfter}s.` })
  }
  next() 
}

function recordFailure(ip) {
  const record = attempts.get(ip)
  if (!record || Date.now() - record.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: Date.now() })
  } else {
    record.count += 1
  }
}


app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'northlight-api', time: new Date().toISOString() })
})


app.post('/api/auth/login', loginRateLimit, async (req, res) => {
  const { email, password } = req.body ?? {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  
  await new Promise((resolve) => setTimeout(resolve, 550))

  const user = users.find((u) => u.email === email.trim().toLowerCase())
  const valid = Boolean(user && user.password === password)

  if (!valid) {
    recordFailure(req.ip)
    
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  attempts.delete(req.ip) 
  const token = signToken({ sub: user.id, email: user.email, name: user.name })
  res.json({
    token,
    user: { name: user.name, email: user.email, role: user.role },
  })
})

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body ?? {}
  const cleanName = (name ?? '').trim()
  const cleanEmail = (email ?? '').trim().toLowerCase()


  if (!cleanName || !cleanEmail || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ message: 'That doesn’t look like a valid email.' })
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' })
  }

 
  if (users.some((u) => u.email === cleanEmail)) {
    return res.status(409).json({ message: 'An account with that email already exists.' })
  }

  await new Promise((resolve) => setTimeout(resolve, 550)) // same honest delay as login

  const user = {
    id: `usr_${String(users.length + 1).padStart(2, '0')}`,
    email: cleanEmail,
    password,
    name: cleanName,
    role: 'Member',
    activity: [
      {
        at: new Date().toISOString(),
        icon: 'pen',
        text: `Joined Northlight — welcome aboard`,
      },
    ],
  }
  users.push(user)

  
  const token = signToken({ sub: user.id, email: user.email, name: user.name })
  res.status(201).json({
    token,
    user: { name: user.name, email: user.email, role: user.role },
  })
})

app.get('/api/auth/me', (req, res) => {
  const header = req.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Missing bearer token.' })

  const payload = verifyToken(token)
  if (!payload) return res.status(401).json({ message: 'Invalid or expired token.' })

  const user = users.find((u) => u.id === payload.sub)
  if (!user) return res.status(401).json({ message: 'Unknown user.' })

  res.json({
    user: { name: user.name, email: user.email, role: user.role },
    issuedAt: new Date(payload.iat * 1000).toISOString(),
    activity: user.activity,
  })
})

app.listen(PORT, () => {
  console.log(`▲ northlight API — http://localhost:${PORT}`)
})