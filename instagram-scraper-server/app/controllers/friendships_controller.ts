import fs from 'node:fs/promises'
import { join } from 'node:path'
import type { HttpContext } from '@adonisjs/core/http'
import RelationshipService from '#services/friendship_service'
import { InstagramQueue } from '../queues/instagram_queue.js'
import { findUserById, readUsers, updateUserStatus, writeUsers } from '../helpers/users_file.js'
import InstagramService from '#services/instagram_service'

export default class RelationshipsController {
  public async index({ request, response }: HttpContext) {
    const userId = request.qs().userId

    if (!userId) {
      return response.badRequest({ error: 'Missing userId param' })
    }

    const basePath = './app/data/json'
    const followersPath = join(basePath, `${userId}_followers.json`)
    const followingPath = join(basePath, `${userId}_following.json`)

    let followersExists = false
    let followingExists = false

    try {
      await fs.access(followersPath)
      followersExists = true
    } catch {}

    try {
      await fs.access(followingPath)
      followingExists = true
    } catch {}

    let followers = []
    let following = []

    try {
      const followersRaw = await fs.readFile(followersPath, 'utf-8')
      const followingRaw = await fs.readFile(followingPath, 'utf-8')

      const followersData = JSON.parse(followersRaw)
      const followingData = JSON.parse(followingRaw)

      followers = InstagramService.removeDuplicates(followersData)
      following = InstagramService.removeDuplicates(followingData)

      await fs.writeFile(followersPath, JSON.stringify(followers, null, 2))
      await fs.writeFile(followingPath, JSON.stringify(following, null, 2))
    } catch (err) {
      console.error('Erro ao ler arquivos:', err)
      return response.internalServerError({ error: 'Erro ao processar arquivos' })
    }

    return response.ok({
      followers,
      following,
    })
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
