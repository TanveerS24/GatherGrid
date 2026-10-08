import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { RegisterInput, LoginInput, AuthUser } from '@gathergrid/shared';
import { env } from '../../config/env.js';
import { AppError } from '../../common/errors/index.js';
import { authRepository, toAuthUser } from './auth.repository.js';
import type { IUser } from './user.model.js';

export interface TokenPayload {
  userId: string;
  role: string;
}

export class AuthService {
  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
    });
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    } catch {
      throw AppError.unauthorized('Invalid or expired authentication session');
    }
  }

  async register(input: RegisterInput): Promise<{ user: AuthUser; token: string }> {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw AppError.conflict('An account with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const userDoc = await authRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      organizationName: input.organizationName,
      isVerified: false,
      interests: [],
      defaultRadiusKm: 25,
    });

    const user = toAuthUser(userDoc);
    const token = this.generateToken({ userId: user.id, role: user.role });
    return { user, token };
  }

  async login(input: LoginInput): Promise<{ user: AuthUser; token: string }> {
    const userDoc = await authRepository.findByEmail(input.email);
    if (!userDoc) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(input.password, userDoc.passwordHash);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const user = toAuthUser(userDoc);
    const token = this.generateToken({ userId: user.id, role: user.role });
    return { user, token };
  }

  async getMe(userId: string): Promise<AuthUser> {
    const userDoc = await authRepository.findById(userId);
    if (!userDoc) {
      throw AppError.unauthorized('User session not found');
    }
    return toAuthUser(userDoc);
  }

  async updateProfile(userId: string, data: Partial<AuthUser>): Promise<AuthUser> {
    const updated = await authRepository.updateById(userId, data as unknown as Partial<IUser>);
    if (!updated) {
      throw AppError.notFound('User profile not found');
    }
    return toAuthUser(updated);
  }
}

export const authService = new AuthService();
