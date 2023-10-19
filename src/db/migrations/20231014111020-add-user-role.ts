import type { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

import type { IRole } from '@/models/i-user';

import { USER_TABLE } from '../models/user';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn(USER_TABLE, 'role', {
      allowNull: false,
      defaultValue: 'USER',
      type: DataType.ENUM<IRole>('USER', 'ADMIN', 'ROOT'),
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn(USER_TABLE, 'role');
  }
};
