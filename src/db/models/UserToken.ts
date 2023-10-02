/* eslint-disable indent */
import type { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';

import type { IUserToken } from '@/models/i-user-token';

import User from './User';

type UserTokenAttributes = IUserToken & { id: string };

type UserTokenCreationAttributes = Optional<UserTokenAttributes, 'id'>;

@Table({ tableName: 'UserTokens' })
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

  @BelongsTo(() => User)
  user!: User;

  @Column
  @CreatedAt
  creationDate!: Date;

  @Column
  @UpdatedAt
  updatedOn!: Date;
}

export default UserToken;