import type { IUser } from '@/models/i-user';
import type { IUserToken } from '@/models/i-user-token';

export type UserTransactionResult = {
  user: IUser,
  userToken: IUserToken,
}
