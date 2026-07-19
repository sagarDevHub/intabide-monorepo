import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { signUp, signIn, getUserById, validateToken } from './auth';
import { redis } from './redis';
import { z } from 'zod';

const app = express();
const PORT = process.env.PORT || 3002;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later.' },
});

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(limiter);

// Health check
app.get('/health', async (req, res) => {
  let redisStatus = 'unknown';
  try {
    await redis.ping();
    redisStatus = 'connected';
  } catch {
    redisStatus = 'disconnected';
  }
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'auth-service',
    redis: redisStatus,
  });
});

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Sign Up route
app.post('/api/auth/sign-up', async (req, res) => {
  try {
    const { email, password, name } = signUpSchema.parse(req.body);
    const result = await signUp(email, password, name);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(400).json({ error: error.message });
  }
});

// Sign In route
app.post('/api/auth/sign-in', async (req, res) => {
  try {
    const { email, password } = signInSchema.parse(req.body);
    const result = await signIn(email, password);
    res.json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(401).json({ error: error.message });
  }
});

// Get Session route (protected)
app.get('/api/auth/session', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = validateToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// Logout route
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Auth service is running!' });
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
