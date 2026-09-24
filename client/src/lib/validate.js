const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin({ email, password }) {
  const errors = {}
  const e = (email ?? '').trim()

  if (!e) errors.email = 'Email is required'
  else if (!EMAIL_RE.test(e)) errors.email = 'That doesn’t look like a valid email'

  if (!password) errors.password = 'Password is required'
  else if (password.length < 8) errors.password = 'Must be at least 8 characters'

  return errors
}

export function validateSignup({ name, email, password, confirm }) {
  const errors = {}
  const n = (name ?? '').trim()
  const e = (email ?? '').trim()

  if (!n) errors.name = 'Name is required'
  else if (n.length < 2) errors.name = 'That looks too short'

  if (!e) errors.email = 'Email is required'
  else if (!EMAIL_RE.test(e)) errors.email = 'That doesn’t look like a valid email'

  if (!password) errors.password = 'Password is required'
  else if (password.length < 8) errors.password = 'Must be at least 8 characters'

  if (!confirm) errors.confirm = 'Please repeat your password'
  else if (password && confirm !== password) errors.confirm = 'Passwords don’t match'

  return errors
}