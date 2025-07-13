import type { HttpContext } from '@adonisjs/core/http'
import AutomationScraperService from '#services/automation_scraper_service'

export default class InteractionsController {
  async interaction({ response }: HttpContext) {
    let browser

    try {
      const result = await AutomationScraperService.loadContextFromSession()
      browser = result.browser

      await AutomationScraperService.doHumanInteractions(result.page)
    } catch (error) {
      return response.internalServerError({
        status: 'Error',
        message: 'Error in interaction with Instragram session',
      })
    } finally {
      if (browser) {
        try {
          await browser.close()
          response.ok({
            status: 'Ok',
            message: 'Successfully interacted with Instagram and closed the browser',
          })
        } catch (closeError) {
          response.badGateway({ status: 'Error', message: 'Error while closing browser' })
        }
      }
    }
  }
}
