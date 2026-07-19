import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { redis } from './redis';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET || 'default-secret-change-me',

  // 1. GLOBAL REDIS SECONDARY STORAGE CAPABILITY
  secondaryStorage: {
    get: async (key: string) => {
      const data = await redis.get(key);
      return data ? String(data) : null;
    },
    set: async (key: string, value: string, ttl?: number) => {
      if (ttl) {
        await redis.set(key, value, { ex: ttl });
      } else {
        await redis.set(key, value);
      }
    },
    delete: async (key: string) => {
      await redis.del(key);
    },
  },

  // 2. RATE LIMIT CONFIGURATION USING SECONDARY STORAGE
  rateLimit: {
    window: 60,
    max: 10,
    storage: 'secondary-storage', // Offloads counters cleanly to Redis via the layer above
  },

  // Session management
  session: {
    expiresIn: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  // Email/Password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  // Social providers
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // Callbacks
  callbacks: {
    session: async ({ session, user }: any) => {
      return {
        session,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      };
    },
  },

  // Database hooks
  databaseHooks: {
    user: {
      create: {
        after: async (user: any) => {
          console.log(`New user created: ${user.email}`);
          await redis.hset(`user:${user.id}`, {
            id: user.id,
            email: user.email,
            name: user.name || '',
            createdAt: user.createdAt.toString(),
          });
        },
      },
    },
  },
});
