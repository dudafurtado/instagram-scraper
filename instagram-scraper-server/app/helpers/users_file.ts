import fs from 'node:fs'
import { getUsersPath } from './paths.js'

export function readUsers() {
  const filePath = getUsersPath()
  if (!fs.existsSync(filePath)) {
    throw new Error('Users file not found.')
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function writeUsers(users: any[]) {
  const filePath = getUsersPath()
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8')
}

export function findUserById(users: any[], userId: string) {
  return users.find((u: any) => u.user_id === userId)
}

export function updateUserStatus(users: any[], userId: string, status: string) {
  return users.map((u: any) => (u.user_id === userId ? { ...u, status } : u))
}

export function updateUserProgress(users: any[], userId: string, progress: any) {
  return users.map((u) => (u.user_id === userId ? { ...u, progress } : u))
}

export function clearUserProgress(users: any[], userId: string) {
  return users.map((u) => (u.user_id === userId ? { ...u, progress: undefined } : u))
}
