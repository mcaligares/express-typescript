import { DataTypes, type QueryInterface } from 'sequelize';

import { USER_TABLE } from '../models/user';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(USER_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      needChangePassword: {
        type: DataTypes.BOOLEAN
      },
      confirmed: {
        type: DataTypes.BOOLEAN
      },
      enabled: {
        type: DataTypes.BOOLEAN
      },
      creationDate: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedOn: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deletionDate: {
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(USER_TABLE, { cascade: true });
  }
};
