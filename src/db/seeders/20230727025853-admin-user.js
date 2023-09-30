/* eslint-disable @typescript-eslint/no-unused-vars */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'admin@mail.com',
        username: 'admin',
        password: 'U2FsdGVkX1/fI+kACRNjHQWmO+kEuffzBpOvWkLWQ0w=', //123456
        needChangePassword: true,
        confirmed: true,
        enabled: true,
        creationDate: new Date(),
        updatedOn: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
