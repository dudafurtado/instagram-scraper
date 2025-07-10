import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'
import InstagramService from './instagram_service.js'
import InstagramApi from './clients/instagram_api.js'
import { BioLink, InfoUser } from '../interfaces/res_info_insta.js'
import { InstagramCredentials, ScraperUser } from '../interfaces/instagram.js'

export default class AutomationScraperService {
  static async login(credentials: InstagramCredentials) {
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext()
    const page = await context.newPage()

    try {
      await page.goto('https://www.instagram.com/')
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

      await this.doHumanInteractions(page)
      await this.saveSession(context)
      await this.collectUserInfo(page, credentials.username, true)
    } finally {
      await browser.close()
    }
  }

  static async doHumanInteractions(page: any) {
    await page.waitForTimeout(3000)

    const firstLikeButton = await page.getByRole('button', { name: 'Curtir' }).first()

    if (await firstLikeButton.isVisible()) {
      await firstLikeButton.click()
      console.log('👉 Curtiu o primeiro post.')
    } else {
      console.log('⚠️ Botão de curtir não encontrado ou não visível.')
    }

    await page.waitForTimeout(2000)

    const followButtons = page.locator('button:has-text("Seguir")')

    const firstFollow = followButtons.nth(0)
    if (await firstFollow.isVisible()) {
      await firstFollow.click()
      console.log('✅ Seguiu o primeiro sugerido.')
    }

    const secondFollow = followButtons.nth(1)
    if (await secondFollow.isVisible()) {
      await secondFollow.click()
      console.log('✅ Seguiu o segundo sugerido.')
    }

    await page.waitForTimeout(2000)
  }

  static async loadContextFromSession() {
    const browser = await chromium.launch({ headless: false, devtools: true })
    const context = await browser.newContext({
      storageState: path.join(import.meta.dirname, '../data/json/session.json'),
      viewport: { width: 1280, height: 720 },
    })
    const page = await context.newPage()

    return { browser, context, page }
  }

  static async collectInfo(usernames: string[]) {
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext({
      storageState: path.join(import.meta.dirname, '../data/json/session.json'),
    })
    const page = await context.newPage()

    try {
      for (const username of usernames) {
        await this.collectUserInfo(page, username, false)
        await new Promise((res) => setTimeout(res, 5000))
      }
    } finally {
      await browser.close()
    }
  }

  static async collectUserInfo(page: any, username: string, isLogged: boolean) {
    console.log(`▶️ Acessando perfil ${username}`)

    const targetUserIdPromise = new Promise<string>((resolve) => {
      page.on('request', (request: any) => {
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

    await page.getByText(/seguidores/i).click()
    await page.waitForTimeout(4000)

    const targetUserId = await targetUserIdPromise
    const info = await InstagramApi.getUserInfo(targetUserId)

    console.log(info)

    const user = await this.saveUserInfo(targetUserId, posts, info.user, isLogged)
    await InstagramService.downloadImage({
      id: targetUserId,
      username,
      profile_pic_url: user.profile_pic_url,
    })

    console.log(`✔️ ${username} salvo!`)
  }

  static async saveUserInfo(userId: string, posts: string, user: InfoUser, isLogged: boolean) {
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
      is_logged: isLogged,

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

    return data
  }

  static async saveSession(context: any) {
    const dir = path.join(import.meta.dirname, '../data/json')
    const sessionPath = path.join(dir, 'session.json')

    await context.storageState({ path: sessionPath })
  }
}
