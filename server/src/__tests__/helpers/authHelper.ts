import jwt, { type SignOptions } from 'jsonwebtoken';
import { UserRole } from '@gathergrid/shared';
import { env } from '../../config/env.js';
import { UserModel, type IUser } from '../../modules/auth/user.model.js';

export interface TestUserOptions {
  name?: string;
  email?: string;
  role?: UserRole;
  isVerified?: boolean;
}

export async function createTestUser(options: TestUserOptions = {}): Promise<IUser> {
  const email = options.email || `test-${Math.random().toString(36).slice(2, 8)}@gathergrid.test`;
  const name = options.name || 'Test User';
  const role = options.role || UserRole.PARTICIPANT;

  return UserModel.create({
    name,
    email,
    passwordHash: '$2b$10$abcdefghijklmnopqrstuvw',
    role,
    isVerified: options.isVerified ?? true,
    interests: [],
    defaultRadiusKm: 25,
  });
}

export function signTestToken(userId: string, role: string = UserRole.PARTICIPANT): string {
  return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

export function getAuthHeader(userId: string, role: string = UserRole.PARTICIPANT): { Authorization: string } {
  const token = signTestToken(userId, role);
  return { Authorization: `Bearer ${token}` };
}
