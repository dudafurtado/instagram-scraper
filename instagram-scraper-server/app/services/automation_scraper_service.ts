import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'
import hash from '@adonisjs/core/services/hash'
import InstagramService from './instagram_service.js'
import { InstagramCredentials, ScraperUser } from '../interfaces/instagram.js'
import { BioLink, InfoUser } from '../interfaces/res_info_insta.js'

export default class AutomationScraperService {
  static async loginAndCollectInfo(credentials: InstagramCredentials) {
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext()
    const page = await context.newPage()

    try {
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

      await page.goto(`https://www.instagram.com/${credentials.search}/`)

      const posts = await page.getByText(/publicações/).innerText()
      const profilePic = await page.locator('header img[alt*="Foto do perfil"]').getAttribute('src')

      const cookies = await context.cookies()
      const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ')
      const sessionid = cookies.find((c) => c.name === 'sessionid')
      const csrfToken = cookies.find((c) => c.name === 'csrftoken')?.value
      const dsUserId = cookies.find((c) => c.name === 'ds_user_id')?.value

      if (!sessionid || !csrfToken || !dsUserId) {
        throw new Error('Cookies não encontrados')
      }

      const expiredAt = sessionid?.expires ? new Date(sessionid.expires * 1000) : null

      await page.getByText(/seguidores/i).click()
      await page.waitForTimeout(4000)

      const targetUserId = await targetUserIdPromise

      const info = await page.evaluate(
        async ({ userID, cookie }) => {
          const res = await fetch(`https://i.instagram.com/api/v1/users/${userID}/info/`, {
            headers: {
              'User-Agent': 'Instagram 219.0.0.12.117 Android',
              'x-ig-app-id': '936619743392459',
              'Cookie': cookie,
            },
            credentials: 'include',
          })

          return (await res.json()) as { user: InfoUser; status: string }
        },
        { userID: targetUserId, cookie: cookieHeader }
      )

      await InstagramService.downloadImage(
        { session_id: sessionid, csrf_token: csrfToken, ds_user_id: dsUserId },
        { id: targetUserId, username: credentials.search, profile_pic_url: profilePic }
      )

      const data = {
        user_id: targetUserId,

        username: credentials.search,
        full_name: info.user.full_name,
        biography: info.user.biography.split('\n'),
        urls: info.user.bio_links.map((link: BioLink) => link.url),
        profile_pic_url: info.user.hd_profile_pic_versions[0].url,

        posts: posts.split(' ')[0].replace('.', ''),
        follower_count: info.user.follower_count,
        following_count: info.user.following_count,

        is_private: info.user.is_private,
        is_bestie: info.user.is_bestie,

        address_street: info.user.address_street,
        city_name: info.user.city_name,
        contact_phone_number: info.user.contact_phone_number,
        public_email: info.user.public_email,
        public_phone_number: info.user.public_phone_number,

        created_at: new Date().toISOString(),
      }

      const session = {
        username: credentials.username,
        password: await hash.make(credentials.password),

        session_id: sessionid.value,
        csrf_token: csrfToken,
        ds_user_id: dsUserId,
        ig_app_id: '936619743392459',

        expired_at: expiredAt ? expiredAt.toISOString() : null,
      }

      const dir = path.join(import.meta.dirname, '../data/json')
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      const filePath = path.join(dir, 'users.json')

      let db: ScraperUser[] = []

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        db = JSON.parse(fileContent)
      }

      db.push(data)

      fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8')
    } finally {
      await browser.close()
    }
  }
}
