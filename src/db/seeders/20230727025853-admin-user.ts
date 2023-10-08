require('dotenv').config();

import { USER_TABLE } from 'db/models/user';
import type { QueryInterface } from 'sequelize';

import { encrypt } from '@/services/crypt.service';

export default {
  up: async (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert(USER_TABLE, [
      {
        email: process.env.ADMIN_EMAIL,
        username: process.env.ADMIN_USERNAME,
        password: encrypt(
          process.env.ADMIN_PASSWORD as string,
          process.env.SECRET_KEY_PASSWORD as string,
        ),
        needChangePassword: false,
        confirmed: true,
        enabled: true,
        creationDate: new Date(),
        updatedOn: new Date()
      }
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete(USER_TABLE, {
      attribute: {
        email: process.env.ADMIN_EMAIL
      }
    }, {});
  }
};
