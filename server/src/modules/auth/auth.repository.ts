import { UserModel, type IUser } from './user.model.js';
import type { AuthUser } from '@gathergrid/shared';

export function toAuthUser(doc: IUser): AuthUser {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    isVerified: doc.isVerified,
    avatarUrl: doc.avatarUrl,
    bio: doc.bio,
    interests: doc.interests || [],
    homeLocation: doc.homeLocation,
    defaultRadiusKm: doc.defaultRadiusKm || 25,
  };
}

export class AuthRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(data);
    return user.save();
  }

  async updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }
}

export const authRepository = new AuthRepository();
