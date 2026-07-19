import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken, verifyToken } from './utils';
import { cache } from './redis';

const prisma = new PrismaClient();

// Sign Up
export const signUp = async (email: string, password: string, name?: string) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  // Generate token
  const token = generateToken(user.id, user.email);

  // Cache user
  await cache.set(`user:${user.id}`, { id: user.id, email: user.email, name: user.name });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
};

// Sign In
export const signIn = async (email: string, password: string) => {
  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken(user.id, user.email);

  // Cache user
  await cache.set(`user:${user.id}`, { id: user.id, email: user.email, name: user.name });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
};

// Get User by ID
export const getUserById = async (userId: string) => {
  // Try cache first
  const cached = await cache.get<{ id: string; email: string; name: string }>(`user:${userId}`);
  if (cached) {
    return cached;
  }

  // Get from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, avatar: true },
  });

  if (user) {
    await cache.set(`user:${userId}`, user);
  }

  return user;
};

// Validate Token
export const validateToken = (token: string) => {
  return verifyToken(token);
};
