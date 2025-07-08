import type { HttpContext } from '@adonisjs/core/http'
import RelationshipService from '#services/friendship_service'
import { InstagramQueue } from '../queues/instagram_queue.js'
import { findUserById, readUsers, updateUserStatus, writeUsers } from '../helpers/users_file.js'

export default class FriendshipsController {
  public async index({ request, response }: HttpContext) {
    const userId = request.qs().userId

    if (!userId) {
      return response.badRequest({ error: 'Missing userId param' })
    }

    try {
      const relationships = await RelationshipService.list(userId)

      return response.ok(relationships)
    } catch (err) {
      console.error('Erro ao ler arquivos:', err)
      return response.internalServerError({ error: 'Erro ao processar arquivos' })
    }
  }

  public async collect({ request, response }: HttpContext) {
    const { userId } = request.qs()

    if (!userId) {
      return response.badRequest({
        error: 'User ID is a required field.',
      })
    }

    let users = readUsers()
    const profile = findUserById(users, userId)

    if (!profile) {
      return response.badRequest({
        error: 'User not found in users.json.',
      })
    }

    users = updateUserStatus(users, userId, 'queue')
    writeUsers(users)

    await InstagramQueue.add('instagram', {
      userId,
      profile,
    })

    return response.ok({ message: 'Job adicionado à fila com sucesso!' })
  }

  public async compare({ request, response }: HttpContext) {
    const userId = request.qs().userId

    if (!userId) {
      return response.badRequest({
        error: 'User ID is a required field.',
      })
    }

    const result = await RelationshipService.compare(userId)

    return response.json(result)
  }
}
