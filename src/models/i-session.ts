import type { IUser } from './i-user';

export type ISession = {
  user: IUser
  accessToken: string
}
