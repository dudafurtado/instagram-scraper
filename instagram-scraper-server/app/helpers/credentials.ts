import { readFileSync } from 'node:fs'
import { join } from 'node:path'

interface Creds {
  sessionid: string
  csrftoken: string
  ds_user_id: string
  ig_app_id: string
}

let creds: Creds

try {
  const path = join(process.cwd(), './app/data/json/instagram_credentials.json')
  const raw = readFileSync(path, 'utf-8')
  creds = JSON.parse(raw)
} catch (error) {
  throw new Error(`❌ Erro ao carregar credenciais: ${error}`)
}

export default creds
