import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';
import { UserModel } from '../../../modules/auth/user.model.js';
import { ActivityModel } from '../../../modules/activities/activity.model.js';
import { RegistrationModel } from '../../../modules/registrations/registration.model.js';
import { TeamModel } from '../../../modules/activities/team.model.js';
import { UserRole } from '@gathergrid/shared';

describe('Model Schemas & Database Index Constraints (Integration)', () => {
  beforeAll(async () => {
    await connectTestDatabase();
    // Ensure all model indexes are created in mongo
    await Promise.all([
      UserModel.init(),
      ActivityModel.init(),
      RegistrationModel.init(),
      TeamModel.init(),
    ]);
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('enforces unique index on UserModel email', async () => {
    await UserModel.create({
      name: 'User One',
      email: 'unique@gathergrid.test',
      passwordHash: 'hash1',
      role: UserRole.PARTICIPANT,
    });

    await expect(
      UserModel.create({
        name: 'User Two',
        email: 'unique@gathergrid.test',
        passwordHash: 'hash2',
        role: UserRole.PARTICIPANT,
      })
    ).rejects.toThrow();
  });

  it('enforces compound unique index on RegistrationModel (activityId + userId)', async () => {
    await RegistrationModel.create({
      id: 'reg-u1',
      activityId: 'act-same',
      userId: 'user-same',
      userName: 'Same User',
    });

    await expect(
      RegistrationModel.create({
        id: 'reg-u2',
        activityId: 'act-same',
        userId: 'user-same',
        userName: 'Same User Duplicate',
      })
    ).rejects.toThrow();
  });
});
