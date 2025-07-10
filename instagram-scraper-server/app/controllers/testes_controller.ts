// import type { HttpContext } from '@adonisjs/core/http'

import AutomationScraperService from '#services/automation_scraper_service'

export default class TestesController {
  async teste() {
    const { browser, page } = await AutomationScraperService.loadContextFromSession()

    try {
      // Vai para o perfil
      await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(3000)

      const html = await page.content()
      console.log('HTML atual:', html.slice(0, 500))

      const searchInput = page.locator('input[placeholder="Pesquisar"]')
      await searchInput.click()
      await searchInput.fill('ffernanda.cs')

      await page.waitForTimeout(2000)

      const firstResult = page.locator('._abm4 a').first()
      await firstResult.click()
      console.log('➡️ Abriu perfil pelo buscador')

      await page.waitForTimeout(5000)

      const firstPhoto = page.locator('article a').first()
      await firstPhoto.click()
      console.log('🖼️ Abriu a primeira foto.')

      await page.waitForTimeout(3000)

      const likeButton = page.locator('svg[aria-label="Curtir"], svg[aria-label="Like"]').first()
      if (await likeButton.isVisible()) {
        await likeButton.click()
        console.log('❤️ Curtiu a foto.')
      } else {
        console.log('⚠️ Botão de Curtir não encontrado.')
      }

      await page.waitForTimeout(2000)
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      await browser.close()
    }
  }
}
