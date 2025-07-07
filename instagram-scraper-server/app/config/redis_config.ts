import env from '#start/env'

export const redisConnection = {
  host: env.get('REDIS_HOST'),
  port: Number(env.get('REDIS_PORT')),
}
