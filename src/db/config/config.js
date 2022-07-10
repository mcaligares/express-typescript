require('dotenv').config();

const envConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  seederStorageTableName: 'SequelizeData'
};

const dbConfig = {
  development: {
    ...envConfig,
    pool: {
      max: 30,
      acquire: 120000,
      idle: 60000
    }
  },
  test: {
    ...envConfig,
    logging: false
  },
  production: {
    ...envConfig,
    pool: {
      max: 100,
      acquire: 60000,
      idle: 30000
    }
  }
};

const config = dbConfig[process.env.ENV || 'development'];

module.exports = config;
