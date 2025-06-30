import axios from 'axios'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { pipeline } from 'node:stream'
import { promises as fs, createWriteStream } from 'node:fs'
import { randomUA } from '../helpers/user_agent.js'
import app from '@adonisjs/core/services/app'

const streamPipeline = promisify(pipeline)

export default class InstagramService {
  static async connectionsInstagram(creds: any, id: string, type: 'followers' | 'following') {
    const path = `./app/data/json/${id}_${type}.json`

    let allUsers: any[] = []
    let nextMaxId: string | undefined

    try {
      await fs.unlink(path)
      console.log(`Arquivo antigo ${path} removido.`)
    } catch {
      console.log(`Nenhum arquivo antigo para remover.`)
    }

    do {
      const apiFollow = axios.create({
        baseURL: 'https://www.instagram.com',
        headers: {
          'User-Agent': randomUA,
          'Cookie': `sessionid=${creds.session_id}; csrftoken=${creds.csrf_token}; ds_user_id=${creds.ds_user_id};`,
          'X-CSRFToken': creds.csrftoken,
          'X-IG-App-ID': creds.ig_app_id,
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      const res = await apiFollow.get(`/api/v1/friendships/${id}/${type}/`, {
        params: {
          count: 25,
          ...(nextMaxId && { max_id: nextMaxId }),
        },
      })
      const users = res.data.users.map((u: any) => ({
        id: u.id,
        full_name: u.full_name,
        profile_pic_url: u.profile_pic_url,
        username: u.username,
      }))

      allUsers.push(...users)

      await fs.writeFile(path, JSON.stringify(allUsers, null, 2))

      console.log(`Página salva. Total acumulado: ${allUsers.length}`)

      for (const user of users) {
        await this.downloadImage(creds, user)
        const imgDelay = Math.random() * (1500 - 800) + 800 // 800ms - 1.5s
        await new Promise((resolve) => setTimeout(resolve, imgDelay))
      }

      nextMaxId = res.data.next_max_id

      if (nextMaxId) {
        console.log(`Aguardando entre 2 a 4 segundos antes da próxima página...`)
        const pageDelay = Math.random() * (4000 - 2000) + 2000 // 2s - 4s
        await new Promise((resolve) => setTimeout(resolve, pageDelay))
      }
    } while (nextMaxId)

    console.log('Todos os seguidores foram capturados!')
  }

  static async downloadImage(creds: any, user: any) {
    const dest = join(app.makePath('public/img'), `${user.id}_${user.username}.jpg`)

    try {
      const apiImg = axios.create({
        responseType: 'stream',
        headers: {
          'User-Agent': randomUA,
          'Referer': 'https://www.instagram.com/',
          'Cookie': `sessionid=${creds.session_id}; csrftoken=${creds.csrf_token}; ds_user_id=${creds.ds_user_id};`,
        },
      })
      const response = await apiImg.get(user.profile_pic_url)

      await streamPipeline(response.data, createWriteStream(dest))
      console.log(`✔️ ${user.username} avatar salvo`)
    } catch (err) {
      console.warn(`⚠️ ${user.username} falhou: ${err.message}`)
    }
  }

  static async verifyFiles(userId: string) {
    const basePath = './app/data/json/'

    const followersPath = join(basePath, `${userId}_followers.json`)
    const followingPath = join(basePath, `${userId}_following.json`)

    let followersExists = false
    let followingExists = false

    try {
      await fs.access(followersPath)
      await fs.access(followingPath)

      followersExists = true
      followingExists = true
    } catch {
      followersExists = false
      followingExists = false
    }

    return {
      followers: followersExists ? 'exists' : 'not_found',
      following: followingExists ? 'exists' : 'not_found',
    }
  }

  static async verify(
    userId: string | number,
    expectedFollowers: number,
    expectedFollowing: number
  ) {
    const basePath = './app/data/json'

    let followersFound = 0
    let followingFound = 0
    let followers
    let following

    try {
      const followersFile = join(basePath, `${userId}_followers.json`)
      const followingFile = join(basePath, `${userId}_following.json`)
      const followersRaw = await fs.readFile(followersFile, 'utf-8')
      const followingRaw = await fs.readFile(followingFile, 'utf-8')

      let followersData = JSON.parse(followersRaw)
      let followingData = JSON.parse(followingRaw)

      followersFound = Array.isArray(followersData) ? followersData.length : 0
      followingFound = Array.isArray(followingData) ? followingData.length : 0

      followers = this.removeDuplicates(followersData)
      following = this.removeDuplicates(followingData)

      await fs.writeFile(`${basePath}/${userId}_followers.json`, JSON.stringify(followers, null, 2))
      await fs.writeFile(`${basePath}/${userId}_following.json`, JSON.stringify(following, null, 2))
    } catch (err) {
      console.error(`Erro ao ler:`, err)
    }

    return {
      followersOk: followersFound === expectedFollowers,
      followersFound,
      followers,
      followingOk: followingFound === expectedFollowing,
      followingFound,
      following,
    }
  }

  static removeDuplicates(users: any) {
    const seen = new Set()
    const unique = []

    for (const user of users) {
      if (!seen.has(user.id)) {
        seen.add(user.id)
        unique.push(user)
      }
    }

    return unique
  }
}
