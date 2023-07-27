import type { Request } from 'express';
import type { ISession } from './i-session';

export type IRequest = Request & {
  session: ISession
}
