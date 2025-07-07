import { Worker, Job } from 'bullmq'
import InstagramService from '#services/instagram_service'
import { redisConnection } from '../config/redis_config.js'
import { readUsers, updateUserStatus, writeUsers } from '../helpers/users_file.js'

export const InstagramWorker = new Worker(
  'instagram',
  async (job: Job) => {
    const { userId, profile } = job.data

    console.log(`▶️ Executando job para usuário ${userId}`)

    let users = readUsers()
    users = updateUserStatus(users, userId, 'collecting')
    writeUsers(users)

    await InstagramService.connections(userId, profile)

    users = updateUserStatus(users, userId, 'collected')
    writeUsers(users)

    console.log(`✅ Job concluído para usuário ${userId}`)
  },
  {
    connection: redisConnection,
  }
)
