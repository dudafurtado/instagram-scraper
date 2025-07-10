/* eslint-disable @typescript-eslint/naming-convention */
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
  const origins = session.origins || []

  const getCookie = (name: string) => {
    const found = cookies.find((c: any) => c.name === name)
    if (!found) throw new Error(`Cookie "${name}" not found in session.`)
    return found.value
  }

  const ig_app_id = appIdFromLocalStorage(origins)

  const creds = {
    session_id: getCookie('sessionid'),
    csrf_token: getCookie('csrftoken'),
    ds_user_id: getCookie('ds_user_id'),
    ig_app_id,
  }

  console.log(creds)

  return creds
}

function appIdFromLocalStorage(origins: any) {
  let ig_app_id = process.env.INSTAGRAM_IG_APP_ID

  for (const origin of origins) {
    const ls = origin.localStorage || []
    for (const entry of ls) {
      if (!entry.value) continue

      try {
        const valueParsed = JSON.parse(entry.value)
        const items = valueParsed.items || []

        for (const item of items) {
          if (item.extra) {
            const extraParsed = JSON.parse(item.extra)
            if (extraParsed.app_id) {
              ig_app_id = extraParsed.app_id
              break
            }
          }
        }
      } catch {
        continue
      }
    }
  }

  return ig_app_id
}

export function buildCookieHeader(creds: {
  session_id: string
  csrf_token: string
  ds_user_id: string
}) {
  return `sessionid=${creds.session_id}; csrftoken=${creds.csrf_token}; ds_user_id=${creds.ds_user_id};`
}
