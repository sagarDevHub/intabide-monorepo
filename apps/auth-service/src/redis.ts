import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('⚠️ Redis configuration missing. Running without Redis.');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'http://localhost:6379',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export const cache = {
  async set(key: string, value: any, ttlSeconds: number = 3600) {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  },

  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data as string) : null;
  },

  async del(key: string) {
    await redis.del(key);
  },
};
