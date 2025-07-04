import type { HttpContext } from '@adonisjs/core/http'
import AutomationScraperService from '#services/automation_scraper_service'

export default class AuthController {
  public async store({ request, response }: HttpContext) {
    const { username, password, search } = request.only(['username', 'password', 'search'])

    if (!username || !password) {
      return response.badRequest({ message: 'Username e password são obrigatórios' })
    }

    try {
      await AutomationScraperService.loginAndCollectInfo({ username, password, search })

      return response.ok({ message: 'Login realizado e cookies salvos' })
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'Falha ao realizar login no Instagram' })
    }
  }
}
