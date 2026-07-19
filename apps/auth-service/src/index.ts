import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { redis } from './redis';
import { auth } from './auth';
import { rateLimiter } from './rate-limit';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', async (req, res) => {
  let redisStatus = 'unknown';

  try {
    await redis.ping();
    redisStatus = 'connected';
  } catch (error) {
    redisStatus = 'disconnected';
  }

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'auth-service',
    redis: redisStatus,
  });
});

// BETTER-AUTH INTEGRATION WRAPPER
app.all('/api/auth/*', toNodeHandler(auth));

// FIXED ROUTE NAME SLASHER
app.use('/api/auth/rate-limit-status', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const remaining = await rateLimiter.getRemaining(ip.toString());
  res.json({ remaining });
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
