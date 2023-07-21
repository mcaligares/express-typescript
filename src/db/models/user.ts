import { sequelize } from '.';
import type { Model, Optional } from 'sequelize';
import { DataTypes } from 'sequelize';
import type { IUser } from 'models/i-user';

export type UserAttributes = IUser & {
  id: string
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>

interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const User = sequelize.define<UserInstance>(
  'User',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    needChangePassword: {
      type: DataTypes.BOOLEAN,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
    }
  }
);

export default User;