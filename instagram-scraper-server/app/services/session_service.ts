import path from 'node:path'
import fs from 'node:fs/promises'

export default class SessionService {
  static async sessionExists(): Promise<boolean> {
    try {
      const fullPath = path.resolve('./app/data/json/session.json')

      await fs.access(fullPath)

      const content = await fs.readFile(fullPath, 'utf-8')
      const parsed = JSON.parse(content)

      return parsed && Object.keys(parsed).length > 0
    } catch (err) {
      return false
    }
  }

  static async saveSessionOfContext(context: any) {
    const dir = path.join(import.meta.dirname, '../data/json')
    const sessionPath = path.join(dir, 'session.json')

    await context.storageState({ path: sessionPath })
  }

  static async saveExtensionCookiesAsStorageState(cookies: string) {
    if (typeof cookies !== 'string') {
      throw new Error('Expected cookies as string')
    }

    const cookiesJson = JSON.parse(cookies)

    if (!Array.isArray(cookiesJson)) {
      throw new Error('Parsed cookies are not an array')
    }

    const formattedCookies = cookiesJson.map((cookie: any) => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path || '/',
      expires: cookie.expirationDate || -1,
      httpOnly: cookie.httpOnly || false,
      secure: cookie.secure || false,
      sameSite:
        cookie.sameSite?.toLowerCase() === 'lax'
          ? 'Lax'
          : cookie.sameSite?.toLowerCase() === 'strict'
            ? 'Strict'
            : 'None',
    }))
    const storageState = {
      cookies: formattedCookies,
      origins: [],
    }

    await fs.writeFile('./app/data/json/session.json', JSON.stringify(storageState, null, 2))
  }

  static async deleteSessionFile() {
    const sessionPath = path.resolve('./app/data/json/session.json')

    console.log(sessionPath)

    try {
      await fs.access(sessionPath)
      await fs.unlink(sessionPath)

      return { success: true }
    } catch (err: any) {
      return { success: false, err }
    }
  }
}
