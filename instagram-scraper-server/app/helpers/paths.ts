import path from 'node:path'

export function getUsersPath() {
  return path.join(import.meta.dirname, '../data/json/users.json')
}

export function getJsonPath(userId: string, type: 'followers' | 'following') {
  return path.join('./app/data/json', `${userId}_${type}.json`)
}
