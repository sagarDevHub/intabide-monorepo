import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('⚠️ Redis configuration missing. Running without Redis.');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'http://localhost:6379',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export const redisHelpers = {
  // State management
  async setSession(sessionId: string, data: any, ttlSeconds: number = 86400) {
    await redis.setex(`session${sessionId}`, ttlSeconds, JSON.stringify(data));
  },

  async getSession(sessionId: string) {
    const data = await redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data as string) : null;
  },

  async deleteSesson(sessionId: string) {
    await redis.del(`session:${sessionId}`);
  },

  // User cache
  async cacheUser(userId: string, userData: any) {
    await redis.setex(`user:${userId}`, 3600, JSON.stringify(userData));
  },

  async getUserCache(userId: string) {
    const data = await redis.get(`user:${userId}`);
    return data ? JSON.parse(data as string) : null;
  },

  // Rate limiting
  async incrementAttempts(key: string, windowsSeconds: number = 60): Promise<number> {
    const count = await redis.incr(`attemts:${key}`);
    if (count === 1) {
      await redis.expire(`attempts:${key}`, windowsSeconds);
    }
    return count;
  },

  async getAttepmpts(key: string): Promise<number> {
    const count = await redis.get(`attempts:${key}`);
    return count ? parseInt(count as string, 10) : 0;
  },

  async resetAttempts(key: string) {
    await redis.del(`attempts:${key}`);
  },
};
