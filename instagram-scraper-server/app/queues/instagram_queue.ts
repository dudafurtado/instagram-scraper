import { Queue } from 'bullmq'
import { redisConnection } from '../config/redis_config.js'

export const InstagramQueue = new Queue('instagram', {
  connection: redisConnection,
})
