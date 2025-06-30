/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContext } from '@adonisjs/core/http'
import InstagramService from '#services/instagram_service'

export default class InstagramController {
  public async follow({ request, response }: HttpContext) {
    const { session_id, csrf_token, ds_user_id, ig_app_id, user_id, type } = request.body()

    if (!session_id || !csrf_token || !ds_user_id || !ig_app_id || !user_id || !type) {
      return response.badRequest({
        error: 'All fields are required.',
      })
    }

    if (!['followers', 'following', 'both'].includes(type)) {
      return response.badRequest({ error: 'Type has to be followers, following or both.' })
    }

    const creds = {
      session_id,
      csrf_token,
      ds_user_id,
      ig_app_id,
    }

    try {
      if (type === 'both') {
        await InstagramService.connectionsInstagram(creds, user_id, 'followers')
        await InstagramService.connectionsInstagram(creds, user_id, 'following')
      }

      await InstagramService.connectionsInstagram(creds, user_id, type)

      return response.ok({
        message: `${type} collection started and saved.`,
      })
    } catch (error) {
      response.json({ status: '🚫 Request failed', message: error })
    }
  }

  public async checkFiles({ request, response }: HttpContext) {
    const { userId } = request.qs()

    if (!userId) {
      return response.badRequest({ error: 'User Id is required' })
    }

    const result = await InstagramService.verifyFiles(userId)

    return response.ok(result)
  }

  public async checkData({ request, response }: HttpContext) {
    const userId = request.input('userId')
    const followersCount = Number(request.input('followers'))
    const followingCount = Number(request.input('following'))

    const result = await InstagramService.verify(userId, followersCount, followingCount)

    return response.ok(result)
  }
}
