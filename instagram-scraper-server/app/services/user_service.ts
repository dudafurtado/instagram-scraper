import fs from 'node:fs'
import path from 'node:path'
import { BioLink, InfoUser } from '../interfaces/res_info_insta.js'
import { ScraperUser } from '../interfaces/instagram.js'

export default class UserService {
  static async saveUserInfo(userId: string, posts: string, user: InfoUser, isLogged: boolean) {
    const data = {
      user_id: userId,

      username: user.username,
      full_name: user.full_name,
      biography: user.biography.split('\n'),
      urls: user.bio_links.map((link: BioLink) => link.url),
      profile_pic_url: user.hd_profile_pic_versions[0].url,

      posts: posts.split(' ')[0].replace('.', ''),
      follower_count: user.follower_count,
      following_count: user.following_count,

      is_private: user.is_private,
      is_bestie: user.is_bestie,
      is_verified: user.is_verified,

      address_street: user.address_street,
      city_name: user.city_name,
      contact_phone_number: user.contact_phone_number,
      public_email: user.public_email,
      public_phone_number: user.public_phone_number,

      status: 'to_collect',
      is_logged: isLogged,

      created_at: new Date().toISOString(),
    }

    const dir = path.join(import.meta.dirname, '../data/json')
    const filePath = path.join(dir, 'users.json')
    let db: ScraperUser[] = []

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      db = JSON.parse(fileContent)
    }

    db.push(data)

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8')

    return data
  }
}
