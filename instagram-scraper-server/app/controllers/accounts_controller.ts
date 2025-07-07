import fs from 'node:fs'
import path from 'node:path'
import type { HttpContext } from '@adonisjs/core/http'
import { InstagramQueue } from '../queues/instagram_queue.js'

export default class AccountsController {
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

  public async listFailedJobs({ response }: HttpContext) {
    const failedJobs = await InstagramQueue.getJobs(['failed'])
    return response.ok(failedJobs)
  }
}
