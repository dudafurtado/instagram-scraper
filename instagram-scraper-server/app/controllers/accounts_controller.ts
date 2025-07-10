import fs from 'node:fs'
import path from 'node:path'
import type { HttpContext } from '@adonisjs/core/http'
import { InstagramQueue } from '../queues/instagram_queue.js'
import AutomationScraperService from '#services/automation_scraper_service'
import { readUsers } from '../helpers/users_file.js'

export default class AccountsController {
  async store({ request, response }: HttpContext) {
    const { search } = request.only(['search'])

    if (!search) {
      return response.badRequest({ message: 'Search field is required.' })
    }

    const searches = Array.isArray(search) ? search : [search]

    try {
      await AutomationScraperService.collectInfo(searches)

      return response.ok({ message: 'Info collected successfully' })
    } catch (err) {
      console.error(err)
      return response.internalServerError({ message: 'Error collecting info' })
    }
  }

  async index({ response }: HttpContext) {
    const filePath = path.join(process.cwd(), 'app', 'data', 'json', 'users.json')

    if (!fs.existsSync(filePath)) {
      return response.status(404).json({ message: 'Arquivo users.json não encontrado' })
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)

    const toCollect = data.filter((u: any) => u.status === 'to_collect')
    const collected = data.filter((u: any) => u.status === 'collected')
    const collecting = data.filter((u: any) => u.status === 'collecting')

    return response.ok({
      to_collect: toCollect,
      collecting,
      collected,
    })
  }

  async show({ response }: HttpContext) {
    try {
      const users = readUsers()
      const user = users.find((u: any) => u.isLogged === true)

      if (!user) {
        return response.badRequest({ message: `No user found logged` })
      }

      return response.ok(user)
    } catch (err) {
      console.error(err)
      return response.status(500).json({ message: err.message })
    }
  }

  public async listFailedJobs({ response }: HttpContext) {
    const failedJobs = await InstagramQueue.getJobs(['failed'])
    return response.ok(failedJobs)
  }
}
