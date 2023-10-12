import { Sequelize } from 'sequelize-typescript';

import { getConnection, initializeDB } from '../../src/db';

jest.mock('sequelize-typescript');
jest.mock('../../src/db/models/index', () => []);

const SequelizeMock = Sequelize as unknown as jest.Mock;

describe('test db file', () => {
  beforeEach(() => {
    SequelizeMock.mockClear();
  });

  test('when initialize db should keep the connection alive', async () => {
    const addModelsMock = jest.fn();
    const syncMock = jest.fn();
    const authenticateMock = jest.fn();

    SequelizeMock.mockImplementationOnce(() => ({
      sync: syncMock,
      addModels: addModelsMock,
      authenticate: authenticateMock,
    }));

    await initializeDB();
    const connection = getConnection();

    expect(connection).toBeDefined();
    expect(SequelizeMock).toHaveBeenCalledTimes(1);
    expect(addModelsMock).toHaveBeenCalledTimes(1);
    expect(syncMock).toHaveBeenCalledTimes(1);
    expect(authenticateMock).toHaveBeenCalledTimes(1);
  });

  test('when db connection is not ready should throw an error', async () => {
    const throwInitError = jest.fn();
    const tryGetConnection = () => {
      getConnection();
    };

    SequelizeMock.mockImplementationOnce(() => ({}));

    await initializeDB().catch(throwInitError);

    expect(throwInitError).toHaveBeenCalled();
    expect(tryGetConnection).toThrowError('db connection is not alive');
  });
});