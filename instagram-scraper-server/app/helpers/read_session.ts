import fs from 'node:fs'
import path from 'node:path'

export function readSession() {
  const sessionPath = path.join(import.meta.dirname, '../data/json/session.json')

  if (!fs.existsSync(sessionPath)) {
    throw new Error('Session file not found. Do login first.')
  }

  const sessionRaw = fs.readFileSync(sessionPath, 'utf-8')
  const session = JSON.parse(sessionRaw)

  const cookies = session.cookies
  const getCookie = (name: string) => {
    const found = cookies.find((c: any) => c.name === name)
    if (!found) throw new Error(`Cookie "${name}" not found in session.`)
    return found.value
  }

  const creds = {
    session_id: getCookie('sessionid'),
    csrf_token: getCookie('csrftoken'),
    ds_user_id: getCookie('ds_user_id'),
    ig_app_id: session.ig_app_id,
    username: session.username,
  }

  return creds
}

export function buildCookieHeader(creds: {
  session_id: string
  csrf_token: string
  ds_user_id: string
}) {
  return `sessionid=${creds.session_id}; csrftoken=${creds.csrf_token}; ds_user_id=${creds.ds_user_id};`
}
