import { http, HttpResponse } from 'msw';
import { currentSession } from './auth.handlers';
import type { Team, SoloPoolParticipant } from '@gathergrid/shared';

let teamsStore: Team[] = [
  {
    id: 'team-1',
    activityId: 'act-2',
    name: 'Neural Navigators',
    description: 'Working on satellite imagery analysis for wildfire prediction.',
    joinCode: 'GG-8492',
    leaderId: 'user-part-1',
    leaderName: 'Maya Lin',
    members: [
      { userId: 'user-part-1', name: 'Maya Lin', joinedAt: '2026-10-06T12:00:00Z' },
      { userId: 'user-part-2', name: 'Jordan Lee', joinedAt: '2026-10-06T14:30:00Z' },
    ],
    minSize: 2,
    maxSize: 5,
    status: 'ready',
    lockDeadline: '2026-10-23T18:00:00Z',
  },
];

let soloPoolStore: SoloPoolParticipant[] = [
  { userId: 'user-3', userName: 'Alex Rivera', activityId: 'act-2', optedInAt: '2026-10-06T16:00:00Z' },
];

export const teamsHandlers = [
  http.get('*/api/v1/activities/:id/teams', ({ params }) => {
    const list = teamsStore.filter((t) => t.activityId === params.id);
    return HttpResponse.json({ status: 'ok', data: list });
  }),

  http.post('*/api/v1/activities/:id/teams', async ({ params, request }) => {
    if (!currentSession) return HttpResponse.json({ status: 'error', code: 'UNAUTHORIZED' }, { status: 401 });
    const body = (await request.json()) as any;
    const newTeam: Team = {
      id: 'team-' + Math.random().toString(36).slice(2, 8),
      activityId: params.id as string,
      name: body.name,
      description: body.description,
      joinCode: 'GG-' + Math.floor(1000 + Math.random() * 9000),
      leaderId: currentSession.id,
      leaderName: currentSession.name,
      members: [{ userId: currentSession.id, name: currentSession.name, joinedAt: new Date().toISOString() }],
      minSize: 2,
      maxSize: 5,
      status: 'forming',
    };
    teamsStore.push(newTeam);
    return HttpResponse.json({ status: 'ok', data: newTeam }, { status: 201 });
  }),

  http.post('*/api/v1/teams/join-code', async ({ request }) => {
    if (!currentSession) return HttpResponse.json({ status: 'error', code: 'UNAUTHORIZED' }, { status: 401 });
    const body = (await request.json()) as any;
    const team = teamsStore.find((t) => t.joinCode === body.code);
    if (!team) {
      return HttpResponse.json({ status: 'error', code: 'INVALID_CODE', message: 'Team code is invalid' }, { status: 404 });
    }
    if (team.members.length >= team.maxSize) {
      return HttpResponse.json({ status: 'error', code: 'TEAM_FULL', message: 'Team has reached maximum members' }, { status: 400 });
    }
    team.members.push({ userId: currentSession.id, name: currentSession.name, joinedAt: new Date().toISOString() });
    return HttpResponse.json({ status: 'ok', data: team });
  }),

  http.post('*/api/v1/teams/:id/leave', ({ params }) => {
    return HttpResponse.json({ status: 'ok', data: { success: true } });
  }),

  http.delete('*/api/v1/teams/:id', ({ params }) => {
    teamsStore = teamsStore.filter((t) => t.id !== params.id);
    return HttpResponse.json({ status: 'ok', data: { success: true } });
  }),

  http.get('*/api/v1/activities/:id/solo-pool', ({ params }) => {
    const pool = soloPoolStore.filter((s) => s.activityId === params.id);
    return HttpResponse.json({ status: 'ok', data: pool });
  }),

  http.post('*/api/v1/activities/:id/solo-pool', async ({ params, request }) => {
    if (!currentSession) return HttpResponse.json({ status: 'error', code: 'UNAUTHORIZED' }, { status: 401 });
    const body = (await request.json()) as any;
    if (body.optIn) {
      soloPoolStore.push({
        userId: currentSession.id,
        userName: currentSession.name,
        activityId: params.id as string,
        optedInAt: new Date().toISOString(),
      });
    } else {
      soloPoolStore = soloPoolStore.filter((s) => s.userId !== currentSession!.id);
    }
    return HttpResponse.json({ status: 'ok', data: { optedIn: body.optIn } });
  }),
];

