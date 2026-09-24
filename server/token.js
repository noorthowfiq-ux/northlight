import { createHmac, timingSafeEqual } from 'node:crypto'


const SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me'


const b64url = (str) => Buffer.from(str).toString('base64url')


export function signToken(payload, ttlSeconds = 60 * 60) {
  const now = Math.floor(Date.now() / 1000) 

  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = b64url(
    JSON.stringify({ ...payload, iat: now, exp: now + ttlSeconds })
  )
 
  const sig = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url')

  return `${header}.${body}.${sig}`
}


export function verifyToken(token) {
  const [header, body, sig] = token.split('.')
  if (!header || !body || !sig) return null


  const expected = createHmac('sha256', SECRET).update(`${header}.${body}`).digest()
  const given = Buffer.from(sig, 'base64url')
 
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url'))
    if (payload.exp * 1000 < Date.now()) return null // expired wristband
    return payload
  } catch {
    return null 
  }
}