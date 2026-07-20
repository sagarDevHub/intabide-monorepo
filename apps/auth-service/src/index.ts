import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { signUp, signIn, getUserById, validateToken, resetPassword, otp } from './auth';
import { redis } from './redis';
import { z } from 'zod';

const app = express();
const PORT = process.env.PORT || 3002;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, please try again later.' },
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

const otpSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

// ============= AUTH ROUTES =============

// Sign Up
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

// Sign In
app.post('/api/auth/sign-in', authLimiter, async (req, res) => {
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

// Get Session
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

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

// ============= OTP ROUTES =============

// Send Email Verification OTP
app.post('/api/auth/send-verification-otp', async (req, res) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const result = await otp.sendEmailVerificationOTP(email);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Verify Email OTP
app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const { email, otp: code } = otpSchema.parse(req.body);
    const result = await otp.verifyEmailOTP(email, code);
    res.json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(400).json({ error: error.message });
  }
});

// Resend Verification OTP
app.post('/api/auth/resend-verification', async (req, res) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const result = await otp.sendEmailVerificationOTP(email);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============= PASSWORD RESET ROUTES =============

// Send Password Reset OTP
app.post('/api/auth/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const result = await otp.sendPasswordResetOTP(email);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Verify Password Reset OTP
app.post('/api/auth/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp: code } = otpSchema.parse(req.body);
    const result = await otp.verifyPasswordResetOTP(email, code);
    res.json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(400).json({ error: error.message });
  }
});

// Reset Password (after OTP verification)
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = resetPasswordSchema.parse(req.body);
    const result = await resetPassword(email, newPassword);
    res.json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(400).json({ error: error.message });
  }
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Auth service is running!' });
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
