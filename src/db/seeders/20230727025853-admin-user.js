/* eslint-disable @typescript-eslint/no-unused-vars */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'admin@mail.com',
        password: '123456',
        needChangePassword: false,
        confirmed: true,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
