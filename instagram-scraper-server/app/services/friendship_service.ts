import { join } from 'node:path'
import fs from 'node:fs/promises'
import InstagramService from './instagram_service.js'

export default class RelationshipService {
  static async list(userId: string) {
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

    const followersRaw = await fs.readFile(followersPath, 'utf-8')
    const followingRaw = await fs.readFile(followingPath, 'utf-8')

    const followersData = JSON.parse(followersRaw)
    const followingData = JSON.parse(followingRaw)

    followers = InstagramService.removeDuplicates(followersData)
    following = InstagramService.removeDuplicates(followingData)

    await fs.writeFile(followersPath, JSON.stringify(followers, null, 2))
    await fs.writeFile(followingPath, JSON.stringify(following, null, 2))

    return { followers, following }
  }

  static async compare(id: string) {
    const basePath = `./app/data/json/`

    const followersRaw = await fs.readFile(`${basePath}${id}_followers.json`, 'utf-8')
    const followingRaw = await fs.readFile(`${basePath}${id}_following.json`, 'utf-8')

    const followersFile = JSON.parse(followersRaw)
    const followingFile = JSON.parse(followingRaw)

    const followersIds = new Set(followersFile.map((u: any) => u.username))
    const followingIds = new Set(followingFile.map((u: any) => u.username))

    let notFollowedBack = []
    let notFollowingBack = []

    // Quem você segue mas não te segue
    notFollowedBack = followingFile.filter((u: any) => !followersIds.has(u.username))
    // Quem te segue mas você não segue
    notFollowingBack = followersFile.filter((u: any) => !followingIds.has(u.username))

    await fs.writeFile(
      `${basePath}${id}_not_following_back.json`,
      JSON.stringify(notFollowingBack, null, 2)
    )
    await fs.writeFile(
      `${basePath}${id}_not_followed_back.json`,
      JSON.stringify(notFollowedBack, null, 2)
    )

    return {
      notFollowedBack,
      notFollowingBack,
    }
  }
}
