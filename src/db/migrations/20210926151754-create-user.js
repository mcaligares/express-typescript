'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      needChangePassword: {
        type: Sequelize.BOOLEAN
      },
      confirmed: {
        type: Sequelize.BOOLEAN
      },
      enabled: {
        type: Sequelize.BOOLEAN
      },
      creationDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedOn: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletionDate: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  }
};
