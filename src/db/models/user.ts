/* eslint-disable indent */
import type { Optional } from 'sequelize';
import { AllowNull, Column, CreatedAt, DeletedAt, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import type { IUser } from '@/models/i-user';

type UserAttributes = IUser & { id: string };

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

@Table({ tableName: 'Users' })
class User extends Model<UserAttributes, UserCreationAttributes> {
  @Unique
  @AllowNull(false)
  @Column
  email!: string;

  @Unique
  @AllowNull(false)
  @Column
  username!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @Column
  needChangePassword!: boolean;

  @Column
  confirmed!: boolean;

  @Column
  enabled!: boolean;

  @Column
  @CreatedAt
  creationDate!: Date;

  @Column
  @UpdatedAt
  updatedOn!: Date;

  @Column
  @DeletedAt
  deletionDate!: Date;
}

export default User;