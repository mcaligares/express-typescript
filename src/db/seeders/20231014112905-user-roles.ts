require('dotenv').config();

import { type QueryInterface } from 'sequelize';

import { USER_TABLE } from '../models/user';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkUpdate(USER_TABLE, {
      role: 'ADMIN'
    }, {
      email: process.env.ADMIN_EMAIL
    });
  },
};
