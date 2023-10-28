require('dotenv').config();

import crypto from 'crypto-js/';
import type { QueryInterface } from 'sequelize';

import { USER_TABLE } from '../models/user';

function encrypt(value: string, secret: string) {
  return crypto.AES.encrypt(value, secret).toString();
}

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
        role: 'ROOT',
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
