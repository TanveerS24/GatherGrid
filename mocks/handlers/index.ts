import { authHandlers } from './auth.handlers';
import { activitiesHandlers } from './activities.handlers';
import { registrationsHandlers } from './registrations.handlers';
import { teamsHandlers } from './teams.handlers';
import { notificationsHandlers } from './notifications.handlers';
import { reviewsHandlers } from './reviews.handlers';
import { organizersHandlers } from './organizers.handlers';
import { reportsHandlers } from './reports.handlers';
import { adminHandlers } from './admin.handlers';
import { geoHandlers } from './geo.handlers';

export const handlers = [
  ...authHandlers,
  ...activitiesHandlers,
  ...registrationsHandlers,
  ...teamsHandlers,
  ...notificationsHandlers,
  ...reviewsHandlers,
  ...organizersHandlers,
  ...reportsHandlers,
  ...adminHandlers,
  ...geoHandlers,
];
