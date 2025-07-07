import axios from 'axios'
import { buildCookieHeader, readSession } from '../../helpers/read_session.js'
import { randomUA } from '../../helpers/user_agent.js'

export default class InstagramApi {
  static async createWebClient() {
    const creds = readSession()

    return axios.create({
      baseURL: 'https://www.instagram.com/api/v1',
      headers: {
        'User-Agent': randomUA,
        'Cookie': buildCookieHeader(creds),
        'X-CSRFToken': creds.csrf_token,
        'X-IG-App-ID': creds.ig_app_id,
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
  }

  static async createMobileClient() {
    const creds = readSession()

    return axios.create({
      baseURL: 'https://i.instagram.com/api/v1',
      headers: {
        'User-Agent': 'Instagram 219.0.0.12.117 Android',
        'x-ig-app-id': creds.ig_app_id,
        'Cookie': buildCookieHeader(creds),
      },
    })
  }

  static async createImageClient() {
    const creds = readSession()

    return axios.create({
      responseType: 'stream',
      headers: {
        'User-Agent': randomUA,
        'Referer': 'https://www.instagram.com/',
        'Cookie': buildCookieHeader(creds),
      },
    })
  }

  static async getFriendships(id: string, type: 'followers' | 'following', nextMaxId?: string) {
    const api = await this.createWebClient()
    const params: any = { count: 25 }
    if (nextMaxId) params.max_id = nextMaxId

    const res = await api.get(`/friendships/${id}/${type}/`, { params })
    return res.data
  }

  static async getUserInfo(userId: string) {
    const api = await this.createMobileClient()
    const res = await api.get(`/users/${userId}/info/`)
    return res.data
  }

  static async downloadImage(profile_pic_url: string) {
    const api = await this.createImageClient()
    const res = await api.get(profile_pic_url)
    return res.data
  }
}
