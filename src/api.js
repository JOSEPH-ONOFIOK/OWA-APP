const BASE = 'https://owa-api.onrender.com'

async function post(path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body) })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'Something went wrong')
  return data
}

async function postForm(path, formData, token) {
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'Something went wrong')
  return data
}

async function get(path, token) {
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { method: 'GET', headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'Something went wrong')
  return data
}

export const api = {
  registerStudent: (body)           => post('/auth/register/student', body),
  registerDriver:  (body)           => post('/auth/register/driver', body),
  verify:          (body)           => post('/auth/verify/email', body),
  login:           (body)           => post('/auth/login', body),
  recoverPassword: (body)           => post('/auth/password/recover', body),
  resetPassword:   (body)           => post('/auth/password/reset', body),
  driverOnboard:   (fd, token)      => postForm('/drivers/onboard', fd, token),
  driverDetails:   (fd, token)      => postForm('/drivers/details', fd, token),
  driverBank:      (body, token)    => post('/drivers/bank', body, token),
  userProfile:     (token)          => get('/users/profile', token),
  driverProfile:   (token)          => get('/drivers/profile', token),
}

export const formatPhone = (local) => '+234' + local.replace(/\D/g, '').replace(/^0/, '')

export const saveToken   = (t)    => localStorage.setItem('owa_token', t)
export const getToken    = ()     => localStorage.getItem('owa_token')
export const saveName    = (name) => localStorage.setItem('owa_name', name)
export const getSavedName = ()    => localStorage.getItem('owa_name') ?? ''

export const getRoleFromToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1])).role ?? null
  } catch {
    return null
  }
}
