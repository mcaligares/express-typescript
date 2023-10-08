/* eslint-disable indent */
import type { Optional } from 'sequelize';
import { AllowNull, Column, CreatedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';

import type { IUserToken } from '@/models/i-user-token';

import User from './user';

export const USER_TOKEN_TABLE = 'UserTokens';

type UserTokenAttributes = IUserToken & { id: number };

type UserTokenCreationAttributes = Optional<UserTokenAttributes, 'id'>;

@Table({ tableName: USER_TOKEN_TABLE })
class UserToken extends Model<UserTokenAttributes, UserTokenCreationAttributes> {
  @AllowNull(false)
  @Column
  type!: string;

  @AllowNull(false)
  @Column
  token!: string;

  @Column
  expiresIn!: Date;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @Column
  @CreatedAt
  creationDate!: Date;

  @Column
  @UpdatedAt
  updatedOn!: Date;
}

export default UserToken;