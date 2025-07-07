import type { HttpContext } from '@adonisjs/core/http'
import AutomationScraperService from '#services/automation_scraper_service'

export default class AuthController {
  public async store({ request, response }: HttpContext) {
    const { username, password, search } = request.only(['username', 'password', 'search'])

    if (!username || !password || !search) {
      return response.badRequest({ message: 'Username, password and search fields are required.' })
    }

    const searches = Array.isArray(search) ? search : [search]

    try {
      await AutomationScraperService.loginAndCollectInfo({ username, password }, searches)

      return response.ok({ message: 'Login successful and cookies saved' })
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'Failed to log in to Instagram' })
    }
  }
}
