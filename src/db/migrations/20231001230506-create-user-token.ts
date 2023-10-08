import type { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

import { USER_TABLE } from '../models/user';
import { USER_TOKEN_TABLE } from '../models/usertoken';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(USER_TOKEN_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataType.INTEGER
      },
      userId: {
        type: DataType.INTEGER,
        references: {
          model: USER_TABLE,
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      type: {
        type: DataType.STRING
      },
      token: {
        type: DataType.STRING
      },
      expiresIn: {
        allowNull: false,
        type: DataType.DATE
      },
      createdAt: {
        allowNull: false,
        type: DataType.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataType.DATE
      }
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(USER_TOKEN_TABLE);
  }
};
