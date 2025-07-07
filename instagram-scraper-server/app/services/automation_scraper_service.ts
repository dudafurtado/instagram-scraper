import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'
import env from '#start/env'
import InstagramService from './instagram_service.js'
import InstagramApi from './clients/instagram_api.js'
import { BioLink, InfoUser } from '../interfaces/res_info_insta.js'
import { InstagramCredentials, ScraperUser } from '../interfaces/instagram.js'

export default class AutomationScraperService {
  static async loginAndCollectInfo(credentials: InstagramCredentials, usernames: string[]) {
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext()
    const page = await context.newPage()

    try {
      await page.goto('https://www.instagram.com/accounts/login/')
      await page.getByRole('textbox', { name: 'Telefone, nome de usuário ou' }).click()
      await page
        .getByRole('textbox', { name: 'Telefone, nome de usuário ou' })
        .fill(credentials.username)
      await page.getByRole('textbox', { name: 'Senha' }).fill(credentials.password)
      await page.getByRole('button', { name: 'Entrar', exact: true }).click()
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 30000 })

      const notNow = page.getByRole('button', { name: /Agora não/i })
      if (await notNow.isVisible({ timeout: 3000 })) {
        await notNow.click()
      }

      const cookies = await context.cookies()
      const sessionid = cookies.find((c: any) => c.name === 'sessionid')
      const csrfToken = cookies.find((c: any) => c.name === 'csrftoken')?.value
      const dsUserId = cookies.find((c: any) => c.name === 'ds_user_id')?.value

      this.saveSession({
        username: credentials.username,
        sessionid,
        csrfToken,
        dsUserId,
      })

      for (const username of usernames) {
        console.log(`Coletando dados de: ${username}`)

        const targetUserIdPromise = new Promise<string>((resolve) => {
          page.on('request', (request) => {
            const url = request.url()
            if (url.includes('/api/v1/friendships/') && url.includes('/followers')) {
              const match = url.match(/friendships\/(\d+)\/followers/)
              if (match) {
                resolve(match[1])
              }
            }
          })
        })

        await page.goto(`https://www.instagram.com/${username}/`)

        const posts = await page.getByText(/publicações/).innerText()
        const profilePic = await page
          .locator('header img[alt*="Foto do perfil"]')
          .getAttribute('src')

        await page.getByText(/seguidores/i).click()
        await page.waitForTimeout(4000)

        const targetUserId = await targetUserIdPromise
        const info = await InstagramApi.getUserInfo(targetUserId)

        await InstagramService.downloadImage({
          id: targetUserId,
          username,
          profile_pic_url: profilePic,
        })

        await this.saveUserInfo(targetUserId, posts, info.user)

        console.log(`✔️ ${username} salvo!`)
      }
    } finally {
      await browser.close()
    }
  }

  static async saveUserInfo(userId: string, posts: string, user: InfoUser) {
    const data = {
      user_id: userId,

      username: user.username,
      full_name: user.full_name,
      biography: user.biography.split('\n'),
      urls: user.bio_links.map((link: BioLink) => link.url),
      profile_pic_url: user.hd_profile_pic_versions[0].url,

      posts: posts.split(' ')[0].replace('.', ''),
      follower_count: user.follower_count,
      following_count: user.following_count,

      is_private: user.is_private,
      is_bestie: user.is_bestie,
      is_verified: user.is_verified,

      address_street: user.address_street,
      city_name: user.city_name,
      contact_phone_number: user.contact_phone_number,
      public_email: user.public_email,
      public_phone_number: user.public_phone_number,

      status: 'to_collect',

      created_at: new Date().toISOString(),
    }

    const dir = path.join(import.meta.dirname, '../data/json')
    const filePath = path.join(dir, 'users.json')
    let db: ScraperUser[] = []

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      db = JSON.parse(fileContent)
    }

    db.push(data)

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8')
  }

  static saveSession(cookies: any) {
    const expiredAt = cookies.sessionid?.expires ? new Date(cookies.sessionid.expires * 1000) : null

    const session = {
      username: cookies.username,

      session_id: cookies.sessionid.value,
      csrf_token: cookies.csrfToken,
      ds_user_id: cookies.dsUserId,
      ig_app_id: env.get('INSTAGRAM_IG_APP_ID'),

      expired_at: expiredAt ? expiredAt.toISOString() : null,
    }

    const dir = path.join(import.meta.dirname, '../data/json')
    const sessionPath = path.join(dir, 'session.json')

    fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2), 'utf-8')
  }
}
