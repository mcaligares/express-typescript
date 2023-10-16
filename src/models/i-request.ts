import type { Request } from 'express';

import type { ISession } from '@/models/i-session';

export type IRequest = Request & {
  session: Omit<ISession, 'accessToken'>
}
