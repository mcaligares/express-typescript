/* eslint-disable indent */
import { AllowNull, Column, CreatedAt, DataType, DeletedAt, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import type { IRole, IUser, IUserWithID } from '@/models/i-user';

export const USER_TABLE = 'Users';

type UserCreationAttributes = IUser;

@Table({ tableName: USER_TABLE })
class User extends Model<IUserWithID, UserCreationAttributes> {
  @Unique
  @AllowNull(false)
  @Column
  email!: string;

  @Unique
  @AllowNull(false)
  @Column
  username!: string;

  @AllowNull(false)
  @Column(DataType.ENUM<IRole>('USER', 'ADMIN', 'ROOT'))
  role!: IRole;

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