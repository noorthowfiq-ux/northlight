

const BASE = 'http://localhost:4000'


async function call(method, path, { body, token } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    
  }
  return { status: res.status, data }
}


function log(label, result) {
  console.log('\n────────────────────────────────────────')
  console.log(label)
  console.log('→ status:', result.status)
  console.log('→ body:  ', JSON.stringify(result.data))
}


if (process.argv.includes('lockout')) {
  console.log('Hammering /api/auth/login with wrong passwords…\n')
  for (let i = 1; i <= 6; i++) {
    const r = await call('POST', '/api/auth/login', {
      body: { email: 'mara@northlight.app', password: `wrong-${i}` },
    })
    console.log(`attempt ${i}: status ${r.status} — ${r.data.message}`)
  }
  console.log('\nYou are now locked out for 5 minutes.')
  console.log('To clear it instantly: open server/users.js, add a blank line, save.')
  console.log('(The auto-restart wipes the bouncer’s in-memory clipboard.)')
  process.exit(0)
}


console.log('Northlight API — smoke test\n')

log('TEST 1 — GET /api/health (is the server up?)',
  await call('GET', '/api/health'))

const good = await call('POST', '/api/auth/login', {
  body: { email: 'mara@northlight.app', password: 'northlight123' },
})
log('TEST 2 — POST /api/auth/login (correct password)', good)

log('TEST 3 — POST /api/auth/login (wrong password)',
  await call('POST', '/api/auth/login', {
    body: { email: 'mara@northlight.app', password: 'definitely-wrong' },
  }))

const token = good.data?.token
if (!token) {
  console.log('\n✗ Test 2 returned no token — check the [api] terminal for errors.')
  process.exit(1)
}

log('TEST 4 — GET /api/auth/me (valid token)',
  await call('GET', '/api/auth/me', { token }))


const lastChar = token[token.length - 1]
const swapped = lastChar === 'A' ? 'B' : 'A'
const tampered = token.slice(0, -1) + swapped
log('TEST 5 — GET /api/auth/me (TAMPERED token)',
  await call('GET', '/api/auth/me', { token: tampered }))

console.log('\n────────────────────────────────────────')
console.log('TEST 6 — decoding the token payload (needs NO secret):')
const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString())
console.log(payload)
console.log('\nAnyone can read a JWT — it is SIGNED, not encrypted.')
console.log('The signature only guarantees nobody changed the contents.')
console.log('\nDone. Six tests ran.')