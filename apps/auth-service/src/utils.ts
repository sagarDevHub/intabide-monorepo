import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
export const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

// Verify JWT token
export const verifyToken = (token: string): { id: string; email: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch (error) {
    return null;
  }
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password with hash
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
