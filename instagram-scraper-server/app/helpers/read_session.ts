import fs from 'node:fs'
import path from 'node:path'

export function readSession() {
  const sessionPath = path.join(import.meta.dirname, '../data/json/session.json')

  if (!fs.existsSync(sessionPath)) {
    throw new Error('Session file not found. Do login first.')
  }

  const sessionRaw = fs.readFileSync(sessionPath, 'utf-8')
  const session = JSON.parse(sessionRaw)

  const creds = {
    session_id: session.session_id,
    csrf_token: session.csrf_token,
    ds_user_id: session.ds_user_id,
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
