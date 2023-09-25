import type { IUser } from '@/models/i-user';

export type ISession = {
  user: IUser
  accessToken: string
}
