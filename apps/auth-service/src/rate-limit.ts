import { redis } from './redis';

interface RateLimitConfig {
  windowSeconds: number;
  maxRequests: number;
}

export class RateLimiter {
  private windowSeconds: number;
  private maxRequests: number;

  constructor(config: RateLimitConfig) {
    this.windowSeconds = config.windowSeconds || 60;
    this.maxRequests = config.maxRequests || 10;
  }

  async check(key: string): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const redisKey = `rate_limit:${key}`;
    const now = Date.now();

    const count = await redis.get(redisKey);
    const currentCount = count ? parseInt(count as string, 10) : 0;

    if (currentCount >= this.maxRequests) {
      const ttl = await redis.ttl(redisKey);
      return {
        allowed: false,
        remaining: 0,
        resetIn: ttl > 0 ? ttl : this.windowSeconds,
      };
    }

    const newCount = await redis.incr(redisKey);
    if (newCount === 1) {
      await redis.expire(redisKey, this.windowSeconds);
    }

    return {
      allowed: true,
      remaining: Math.max(0, this.maxRequests - this.windowSeconds),
      resetIn: (await redis.ttl(redisKey)) || this.windowSeconds,
    };
  }

  async getRemaining(key: string): Promise<number> {
    const count = await redis.get(`rate_limit:${key}`);
    const currentCount = count ? parseInt(count as string, 10) : 0;
    return Math.max(0, this.maxRequests - currentCount);
  }

  async reset(key: string) {
    await redis.del(`rate_limit:${key}`);
  }
}

// Default rate limiter instances
export const rateLimiter = new RateLimiter({
  windowSeconds: 60,
  maxRequests: 10,
});
export const strictRateLimiter = new RateLimiter({
  windowSeconds: 300,
  maxRequests: 5,
});
export const permissiveRateLimiter = new RateLimiter({
  windowSeconds: 60,
  maxRequests: 30,
});
