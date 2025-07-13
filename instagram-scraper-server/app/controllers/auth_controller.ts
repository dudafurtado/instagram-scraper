import type { HttpContext } from '@adonisjs/core/http'
import AutomationScraperService from '#services/automation_scraper_service'
import SessionService from '#services/session_service'

export default class AuthController {
  public async store({ request, response }: HttpContext) {
    const payload = request.body()

    if (payload.method === 'cookies' && !payload.cookies) {
      return response.badRequest({ status: 'Error', message: 'Cookies are required.' })
    }

    if (payload.method === 'credentials' && !payload.username && !payload.password) {
      return response.badRequest({
        status: 'Error',
        message: 'Username and password are required.',
      })
    }

    try {
      if (payload.method === 'credentials') {
        await AutomationScraperService.login({
          username: payload.username,
          password: payload.password,
        })
      } else {
        await SessionService.saveExtensionCookiesAsStorageState(payload.cookies)
      }

      return response.ok({ status: 'Ok', message: 'Login successful and cookies saved' })
    } catch (error) {
      return response.internalServerError({
        status: 'Error',
        message: 'Failed to log in to Instagram',
      })
    }
  }

  public async show({ response }: HttpContext) {
    try {
      if (await SessionService.sessionExists()) {
        response.ok({ status: 'Ok', message: 'Valid session found' })
      } else {
        response.ok({ status: 'Error', message: 'No valid session found' })
      }
    } catch (error) {
      return response.internalServerError({
        status: 'Error',
        message: 'Failed to find session in Instagram',
      })
    }
  }

  public async destroy({ response }: HttpContext) {
    const result = await SessionService.deleteSessionFile()

    if (!result.success) {
      if (result.err.code === 'ENOENT') {
        return response.notFound({ status: 'Error', message: 'Session file not found' })
      } else {
        return response.badGateway({ status: 'Error', message: 'Error deleting session file' })
      }
    }

    return response.ok({ status: 'Ok', message: 'Session destroyed successfully.' })
  }
}
