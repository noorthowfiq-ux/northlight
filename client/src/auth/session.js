const TOKEN_KEY = 'nl_token'
const USER_KEY = 'nl_user'

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getSession() {
  try {
    return {
      token: localStorage.getItem(TOKEN_KEY),
      user: JSON.parse(localStorage.getItem(USER_KEY) ?? 'null'),
    }
  } catch {
    return { token: null, user: null }
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}