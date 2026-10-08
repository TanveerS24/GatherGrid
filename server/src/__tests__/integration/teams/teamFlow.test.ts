import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from '../../helpers/dbHelper.js';
import { createTestUser, getAuthHeader } from '../../helpers/authHelper.js';
import { createTestActivity, createTestTeam } from '../../helpers/factories.js';
import { TeamModel } from '../../../modules/activities/team.model.js';

describe('Team Creation, Listing & Joining (Integration)', () => {
  const app = createApp();

  beforeAll(async () => {
    await connectTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('creates a team for a team activity and designates creator as leader', async () => {
    const leader = await createTestUser({ name: 'Captain Marvel' });
    const headers = getAuthHeader(leader._id.toString());
    const activity = await createTestActivity({ isTeamEvent: true });

    const payload = {
      name: 'Avengers Rec',
      description: 'Competitive 3v3 squad.',
      maxMembers: 3,
      lookingFor: ['Defender'],
    };

    const res = await request(app)
      .post(`/api/v1/activities/${activity.id}/teams`)
      .set(headers)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Avengers Rec');
    expect(res.body.data.leaderId).toBe(leader._id.toString());
    expect(res.body.data.members).toHaveLength(1);
    expect(res.body.data.joinCode).toBeDefined();
  });

  it('allows second user to join an existing team', async () => {
    const leader = await createTestUser({ name: 'Leader' });
    const member = await createTestUser({ name: 'Rookie' });
    const activity = await createTestActivity({ isTeamEvent: true });

    const team = await createTestTeam({
      activityId: activity.id,
      leaderId: leader._id.toString(),
      maxMembers: 3,
    });

    const res = await request(app)
      .post(`/api/v1/activities/${activity.id}/teams/${team.id}/join`)
      .set(getAuthHeader(member._id.toString()))
      .send({ role: 'Forward' });

    expect(res.status).toBe(200);
    expect(res.body.data.members).toHaveLength(2);

    const updated = await TeamModel.findOne({ id: team.id });
    expect(updated?.members.some((m) => m.userId === member._id.toString())).toBe(true);
  });
});
