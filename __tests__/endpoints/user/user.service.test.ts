import type { Transaction } from 'sequelize';

import { getConnection } from '../../../src/db/index';
import * as service from '../../../src/endpoints/user/user.service';
import type { IUser, IUserWithID } from '../../../src/models/i-user';
import type { IUserToken, IUserTokenWithID } from '../../../src/models/i-user-token';
import { confirmUserToken, createUser, createUserToken, deleteUser, findUserToken, getAllUsers, setEnableUser, updateUser } from '../../../src/repositories/user.repository';
import { encrypt } from '../../../src/services/crypt.service';

jest.mock('../../../src/db/index');
jest.mock('../../../src/services/token.service');
jest.mock('../../../src/services/crypt.service');
jest.mock('../../../src/repositories/user.repository');

const encryptMock = encrypt as jest.Mock;
const createUserMock = createUser as jest.Mock;
const createUserTokenMock = createUserToken as jest.Mock;
const findUserTokenMock = findUserToken as jest.Mock;
const getConnectionMock = getConnection as jest.Mock;
const getAllUsersMock = getAllUsers as jest.Mock;
const updateUserMock = updateUser as jest.Mock;
const setEnableUserMock = setEnableUser as jest.Mock;
const deleteUserMock = deleteUser as jest.Mock;
const confirmUserTokenMock = confirmUserToken as jest.Mock;

describe('test user service', () => {
  beforeEach(() => {
    encryptMock.mockClear();
    createUserMock.mockClear();
    createUserTokenMock.mockClear();
    findUserTokenMock.mockClear();
    getConnectionMock.mockClear();
    getAllUsersMock.mockClear();
    updateUserMock.mockClear();
    setEnableUserMock.mockClear();
    deleteUserMock.mockClear();
    confirmUserTokenMock.mockClear();
  });
  test('create user', async () => {
    const payload = { email: 'test@mail.com', password: '1234', username: 'test' } as IUser;
    const expectedResult = { ...payload, password: '******' } as IUser;
    const transaction = {} as Transaction;

    encryptMock.mockImplementationOnce(() => payload.password);
    createUserMock.mockImplementationOnce(() => payload);

    const result = await service.createUser(payload, transaction);

    expect(encryptMock).toHaveBeenCalledTimes(1);
    expect(encryptMock).toHaveBeenCalledWith(payload.password, process.env.SECRET_KEY_PASSWORD);
    expect(result).toEqual(expectedResult);
  });
  test('create confirmation token', async () => {
    const payload = { email: 'test@mail.com', password: '1234', username: 'test' } as IUserWithID;
    const expectedResult = { userId: 1, type: 'confirmation-email', token: 'TOKEN' } as IUserToken;
    const transaction = {} as Transaction;

    createUserTokenMock.mockImplementationOnce(() => expectedResult);

    const result = await service.createConfirmationToken(payload, transaction);

    expect(createUserTokenMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });
  test('create change password token', async () => {
    const payload = { email: 'test@mail.com', password: '1234', username: 'test' } as IUserWithID;
    const expectedResult = { userId: 1, type: 'change-password', token: 'TOKEN' } as IUserToken;
    const transaction = {} as Transaction;

    createUserTokenMock.mockImplementationOnce(() => expectedResult);

    const result = await service.createChangePasswordToken(payload, transaction);

    expect(createUserTokenMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });
  test('confirm user account with invalid token', async () => {
    findUserTokenMock.mockImplementationOnce(() => undefined);

    const result = await service.confirmUserAccount('TOKEN');

    expect(result).toBeFalsy();
  });
  test('confirm user account with valid token', async () => {
    const userToken = { id: 1, token: 'TOKEN', type: 'confirmation-email', expiresIn: new Date() } as IUserTokenWithID;

    findUserTokenMock.mockImplementationOnce(() => userToken);
    getConnectionMock.mockImplementationOnce(() => ({ transaction: (cb: CallableFunction) => { cb(); } }));

    const result = await service.confirmUserAccount('TOKEN');

    expect(result).toBeTruthy();
    expect(findUserTokenMock).toHaveBeenCalledTimes(1);
    expect(getConnectionMock).toHaveBeenCalledTimes(1);
    expect(confirmUserTokenMock).toHaveBeenCalledTimes(1);
  });
  test('set user password with invalid token', async () => {
    const payload = { token: 'TOKEN', password: '1234' };

    findUserTokenMock.mockImplementationOnce(() => undefined);

    const result = await service.setUserPassword(payload);

    expect(result).toBeFalsy();
  });
  test('set user password with valid token', async () => {
    const payload = { token: 'TOKEN', password: '1234' };
    const userToken = { id: 1, token: 'TOKEN', type: 'change-password', expiresIn: new Date() } as IUserTokenWithID;

    getConnectionMock.mockImplementationOnce(() => ({ transaction: jest.fn() }));
    findUserTokenMock.mockImplementationOnce(() => userToken);

    const result = await service.setUserPassword(payload);

    expect(result).toBeTruthy();
  });
  test('test get all users', async () => {
    getAllUsersMock.mockImplementationOnce(() => []);

    const result = await service.getAllUsers({});

    expect(result.length).toEqual(0);
  });
  test('test update user', async () => {
    const payload = { id: 1 } as IUserWithID;

    updateUserMock.mockImplementationOnce(() => payload);

    const result = await service.updateUser(payload);

    expect(result).toEqual(payload);
  });
  test('test enable user with invalid user id', async () => {
    try {
      await service.enableUser('NaN', true);
      expect(false).toBeTruthy();
    } catch (e) {
      expect(true).toBeTruthy();
    }
  });
  test('test enable user with valid user id', async () => {
    const expectedResult = { id: 1 };

    setEnableUserMock.mockImplementationOnce(() => expectedResult);

    const result = await service.enableUser('1', true);

    expect(result).toEqual(expectedResult);
  });
  test('delete user with invalid user id', async () => {
    try {
      await service.deleteUser('NaN');
      expect(false).toBeTruthy();
    } catch (e) {
      expect(true).toBeTruthy();
    }
  });
  test('delete user with valid user id', async () => {
    getConnectionMock.mockImplementationOnce(() => ({ transaction: (cb: CallableFunction) => { cb(); } }));

    await service.deleteUser('1');

    expect(getConnectionMock).toHaveBeenCalledTimes(1);
    expect(deleteUserMock).toHaveBeenCalledTimes(1);
  });
});