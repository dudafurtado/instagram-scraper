import { join } from 'node:path'
import { promisify } from 'node:util'
import { pipeline } from 'node:stream'
import { promises as fs, createWriteStream } from 'node:fs'
import InstagramApi from './clients/instagram_api.js'
import { getJsonPath } from '../helpers/paths.js'
import { readUsers, updateUserProgress, writeUsers } from '../helpers/users_file.js'

const streamPipeline = promisify(pipeline)

export default class InstagramService {
  static async connections(userId: string, profile: any) {
    const types = ['followers', 'following'] as const

    let users = readUsers()
    let progress = {
      followers_collected: 0,
      following_collected: 0,
      images_downloaded: 0,
      total_followers: profile.follower_count,
      total_following: profile.following_count,
      total_images: profile.follower_count + profile.following_count,
    }

    users = updateUserProgress(users, userId, progress)
    writeUsers(users)

    for (const type of types) {
      const jsonPath = getJsonPath(userId, type)

      let allUsers: any[] = []
      let nextMaxId: string | undefined
      let res: any

      try {
        await fs.unlink(jsonPath)
        console.log(`Arquivo antigo ${jsonPath} removido.`)
      } catch {
        console.log(`Nenhum arquivo antigo para remover.`)
      }

      do {
        res = await InstagramApi.getFriendships(userId, type, nextMaxId)

        const usersChunk = res.users.map((u: any) => ({
          id: u.id,
          full_name: u.full_name,
          profile_pic_url: u.profile_pic_url,
          username: u.username,
        }))

        allUsers.push(...usersChunk)

        if (type === 'followers') {
          progress.followers_collected = allUsers.length
        } else {
          progress.following_collected = allUsers.length
        }

        users = updateUserProgress(users, userId, progress)
        writeUsers(users)

        await fs.writeFile(jsonPath, JSON.stringify(allUsers, null, 2))

        console.log(`Página salva. Total acumulado: ${allUsers.length}`)

        for (const user of users) {
          console.log(`Baixando imagem do usuário: ${user.username}`)
          await this.downloadImage(user)

          progress.images_downloaded += 1
          users = updateUserProgress(users, userId, progress)
          writeUsers(users)

          await new Promise((r) => setTimeout(r, Math.random() * (1500 - 800) + 800)) // 800ms - 1.5s
        }

        nextMaxId = res.next_max_id
        console.log(`Próximo max_id: ${nextMaxId}`)

        if (nextMaxId) {
          console.log(`Aguardando entre 2 a 4 segundos antes da próxima página...`)
          await new Promise((r) => setTimeout(r, Math.random() * (4000 - 2000) + 2000)) // 2s - 4s
        }
      } while (nextMaxId)
    }

    console.log('Todos os seguidores foram capturados!')
  }

  static async downloadImage(user: any) {
    try {
      const dest = join(process.cwd(), 'public', 'img', `${user.id}_${user.username}.jpg`)
      const response = await InstagramApi.downloadImage(user.profile_pic_url)

      await streamPipeline(response, createWriteStream(dest))
      console.log(`✔️ ${user.username} avatar salvo`)
    } catch (err) {
      console.warn(`⚠️ ${user.username} falhou: ${err.message}`)
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
