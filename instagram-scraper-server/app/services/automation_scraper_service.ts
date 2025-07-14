import path from 'node:path'
import { chromium } from 'playwright-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import InstagramService from './instagram_service.js'
import InstagramApi from './clients/instagram_api.js'
import { InstagramCredentials } from '../interfaces/instagram.js'
import SessionService from './session_service.js'
import UserService from './user_service.js'
import { randomUA } from '../helpers/user_agent.js'

chromium.use(StealthPlugin())

export default class AutomationScraperService {
  static async login(credentials: InstagramCredentials) {
    let browser

    try {
      browser = await chromium.launch({ headless: false })

      const context = await browser.newContext({
        locale: 'pt-BR',
        geolocation: { latitude: -23.5505, longitude: -46.6333 },
        permissions: ['geolocation', 'notifications'],
        userAgent: randomUA,
      })

      const page = await context.newPage()

      const spoofPlatform = (ua: string): string => {
        if (ua.includes('Windows')) return 'Win32'
        if (ua.includes('Macintosh')) return 'MacIntel'
        if (ua.includes('Linux')) return 'Linux x86_64'
        return 'Unknown'
      }

      const platform = spoofPlatform(randomUA)

      await context.addInitScript(`
        Object.defineProperty(navigator, 'platform', { get: () => '${platform}' });
      `)

      await page.goto('https://www.instagram.com/accounts/login/', {
        waitUntil: 'domcontentloaded',
      })

      await page.getByRole('textbox', { name: 'Telefone, nome de usuário ou' }).click()
      await page.waitForTimeout(300 + Math.random() * 400)
      await page
        .getByRole('textbox', { name: 'Telefone, nome de usuário ou' })
        .type(credentials.username, { delay: 120 })

      await page.getByRole('textbox', { name: 'Senha' }).click()
      await page.waitForTimeout(300 + Math.random() * 400)
      await page.getByRole('textbox', { name: 'Senha' }).type(credentials.password, { delay: 130 })

      await page.waitForTimeout(1000)
      await page.getByRole('button', { name: 'Entrar', exact: true }).click()

      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 30000 })

      const notNow = page.getByRole('button', { name: /Agora não/i })
      if (await notNow.isVisible({ timeout: 3000 })) {
        await notNow.click()
      }

      await page.waitForTimeout(3000)

      await SessionService.saveSessionOfContext(context)
      await this.collectUserInfo(page, credentials.username, true)
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }

  static async loadContextFromSession() {
    const browser = await chromium.launch({ headless: false, devtools: true })
    const context = await browser.newContext({
      storageState: path.join(import.meta.dirname, '../data/json/session.json'),
    })
    const page = await context.newPage()

    return { browser, context, page }
  }

  static async collectInfo(usernames: string[]) {
    let browser

    try {
      browser = await chromium.launch({ headless: false })
      const context = await browser.newContext({
        storageState: path.join(import.meta.dirname, '../data/json/session.json'),
      })
      const page = await context.newPage()

      await page.mouse.move(100 + Math.random() * 50, 100 + Math.random() * 50, { steps: 10 })
      await page.waitForTimeout(1000 + Math.random() * 500)
      await page.mouse.wheel(0, 300 + Math.random() * 100)

      await page.waitForTimeout(3000)
      for (const username of usernames) {
        await page.waitForTimeout(3000)
        await this.collectUserInfo(page, username, false)
        await new Promise((res) => setTimeout(res, 5000))
      }
    } finally {
      if (browser) {
        await browser.close()
      }
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
    await page.waitForTimeout(3000)

    await page.mouse.move(100 + Math.random() * 50, 100 + Math.random() * 50, { steps: 10 })
    await page.waitForTimeout(1000 + Math.random() * 500)
    await page.mouse.wheel(0, 300 + Math.random() * 100)

    const posts = await page.getByText(/publicações/).innerText()

    await page.getByText(/seguidores/i).click()
    await page.waitForTimeout(5000)

    const targetUserId = await targetUserIdPromise
    const info = await InstagramApi.getUserInfo(targetUserId)

    await page.waitForTimeout(3000)

    const user = await UserService.saveUserInfo(targetUserId, posts, info.user, isLogged)
    await InstagramService.downloadImage({
      id: targetUserId,
      username,
      profile_pic_url: user.profile_pic_url,
    })

    console.log(`✔️ ${username} salvo!`)
  }

  static async doHumanInteractions(page: any) {
    await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3000)

    await this.likeFirstFeedPosts(page)
    await this.searchAndVisitRandomUser(page)
    await this.likeRandomPhotoFromProfile(page)
  }

  private static async likeFirstFeedPosts(page: any) {
    const likeButtons = await page.getByRole('button', { name: 'Curtir' })

    for (let i = 0; i < 2; i++) {
      const button = likeButtons.nth(i)
      if (await button.isVisible()) {
        await button.click()
        await button.click()
        console.log(`👉 Curtiu o post #${i + 1}`)
        await page.mouse.wheel(0, 500)
        await page.waitForTimeout(1000)
      } else {
        console.log(`⚠️ Botão de curtir #${i + 1} não visível.`)
      }
    }

    await page.waitForTimeout(2000)
  }

  private static async searchAndVisitRandomUser(page: any) {
    const usernames = [
      'giuligartner',
      'girl_loves_coding',
      'sooyaaa__',
      'danaigurira',
      'laurencohan',
    ]

    const username = usernames[Math.floor(Math.random() * usernames.length)]

    const openSearch = page.locator('span', { hasText: 'Pesquisa' }).first()
    await openSearch.click()
    await page.waitForTimeout(800)

    const searchInput = page.locator('input[type="text"]')
    await searchInput.waitFor({ timeout: 5000 })
    await searchInput.click()
    await page.waitForTimeout(300)

    for (const char of username) {
      await searchInput.type(char, { delay: 150 + Math.random() * 100 })
    }

    await page.waitForTimeout(1200)

    const userLink = page.locator(`a[href="/${username}/"]`).first()

    try {
      await userLink.waitFor({ state: 'visible', timeout: 5000 })
      await userLink.scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)
      await userLink.click({ trial: true })
      await userLink.click()
      console.log(`➡️ Abriu perfil: ${username}`)
    } catch (e) {
      console.error(`❌ Erro ao clicar no perfil ${username}:`, e)
      await page.screenshot({ path: `erro_click_perfil_${username}.png` })
    }

    await page.waitForTimeout(5000)
  }

  private static async likeRandomPhotoFromProfile(page: any) {
    await page.waitForSelector('div._aagw', { timeout: 10000 })
    const posts = await page.locator('div._aagw').elementHandles()

    if (posts.length === 0) {
      console.log('⚠️ Nenhum post encontrado.')
      return
    }

    const post = posts[Math.floor(Math.random() * posts.length)]
    await post.click()
    console.log('🖼️ Abriu um post aleatório.')

    await page.waitForTimeout(2000)

    const likeButton = page.locator('svg[aria-label="Curtir"], svg[aria-label="Like"]').first()
    if (await likeButton.isVisible()) {
      await likeButton.click()
      await likeButton.click()
      console.log('❤️ Curtiu o post do perfil.')
    } else {
      console.log('⚠️ Botão de curtir não visível no modal.')
    }

    const closeButton = page.locator('svg[aria-label="Fechar"], svg[aria-label="Close"]').first()
    if (await closeButton.isVisible()) {
      await closeButton.click()
      await page.waitForTimeout(1000)
    }
  }
}
