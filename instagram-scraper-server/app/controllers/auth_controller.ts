import fs from 'node:fs'
import path from 'node:path'
import type { HttpContext } from '@adonisjs/core/http'
import AutomationScraperService from '#services/automation_scraper_service'

export default class AuthController {
  public async store({ request, response }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])

    if (!username || !password) {
      return response.badRequest({ message: 'Username and password fields are required.' })
    }

    try {
      await AutomationScraperService.login({ username, password })

      return response.ok({ message: 'Login successful and cookies saved' })
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'Failed to log in to Instagram' })
    }
  }

  public async destroy({ response }: HttpContext) {
    const sessionPath = path.join(import.meta.dirname, '../../data/json/session.json')

    if (fs.existsSync(sessionPath)) {
      fs.unlinkSync(sessionPath)
      return response.ok({ message: 'Session destroyed successfully.' })
    } else {
      return response.notFound({ message: 'Session file not found.' })
    }
  }
}
