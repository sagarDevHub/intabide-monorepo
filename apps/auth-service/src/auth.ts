import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken, verifyToken } from './utils';
import { cache } from './redis';
import {
  sendEmailVerificationOTP,
  verifyEmailOTP,
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
} from './otp';

const prisma = new PrismaClient();

// Sign Up
export const signUp = async (email: string, password: string, name?: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      emailVerified: false,
    },
  });

  // Send verification OTP
  await sendEmailVerificationOTP(email);

  const token = generateToken(user.id, user.email);

  return {
    user: { id: user.id, email: user.email, name: user.name, emailVerified: false },
    token,
    message: 'Please verify your email with the OTP sent to your inbox.',
  };
};

// Sign In
export const signIn = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  if (!user.emailVerified) {
    // Send new verification OTP
    await sendEmailVerificationOTP(email);
    throw new Error('Email not verified. A new verification OTP has been sent.');
  }

  const token = generateToken(user.id, user.email);

  await cache.set(`user:${user.id}`, { id: user.id, email: user.email, name: user.name });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
};

// Get User by ID
export const getUserById = async (userId: string) => {
  const cached = await cache.get<any>(`user:${userId}`);
  if (cached) {
    return cached;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, avatar: true, emailVerified: true },
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

// Reset Password
export const resetPassword = async (email: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  // Clear cache
  await cache.del(`user:${user.id}`);

  return { message: 'Password reset successfully' };
};

// Resend Verification OTP
export const resendVerificationOTP = async (email: string) => {
  await sendEmailVerificationOTP(email);
  return { message: 'Verification OTP resent' };
};

// Export OTP functions
export const otp = {
  sendEmailVerificationOTP,
  verifyEmailOTP,
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
};
