import { PrismaClient } from '@prisma/client';
import { sendOTPEmail } from './email';
import { cache } from './redis';

const prisma = new PrismaClient();

// Generate a 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for email verification
export const sendEmailVerificationOTP = async (email: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  // Check if already verified
  if (user.emailVerified) {
    throw new Error('Email already verified');
  }

  // Generate OTP
  const otp = generateOTP();

  // Store OTP in database
  await prisma.oTP.create({
    data: {
      email,
      code: otp,
      type: 'VERIFY_EMAIL',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      user: { connect: { id: user.id } },
    },
  });

  // Store in Redis for rate limiting
  await cache.set(`otp:verify:${email}`, otp, 600);

  // Send email
  await sendOTPEmail(email, otp, 'verify');

  return { message: 'OTP sent to your email' };
};

// Verify OTP for email verification
export const verifyEmailOTP = async (email: string, otp: string) => {
  // Find valid OTP
  const otpRecord = await prisma.oTP.findFirst({
    where: {
      email,
      code: otp,
      type: 'VERIFY_EMAIL',
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otpRecord) {
    throw new Error('Invalid or expired OTP');
  }

  // Mark OTP as used
  await prisma.oTP.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  // Verify user email
  await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
  });

  // Clear cache
  await cache.del(`otp:verify:${email}`);

  return { message: 'Email verified successfully' };
};

// Send OTP for password reset
export const sendPasswordResetOTP = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const otp = generateOTP();

  await prisma.oTP.create({
    data: {
      email,
      code: otp,
      type: 'RESET_PASSWORD',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      user: { connect: { id: user.id } },
    },
  });

  await cache.set(`otp:reset:${email}`, otp, 600);

  await sendOTPEmail(email, otp, 'reset');

  return { message: 'Password reset OTP sent to your email' };
};

// Verify OTP for password reset
export const verifyPasswordResetOTP = async (email: string, otp: string) => {
  const otpRecord = await prisma.oTP.findFirst({
    where: {
      email,
      code: otp,
      type: 'RESET_PASSWORD',
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otpRecord) {
    throw new Error('Invalid or expired OTP');
  }

  // Mark OTP as used (but keep it for reference)
  await prisma.oTP.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  await cache.del(`otp:reset:${email}`);

  return { message: 'OTP verified. You can now reset your password.' };
};
