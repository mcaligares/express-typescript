import type { Transaction } from 'sequelize';

import { getConnection } from '../../../src/db/index';
import * as service from '../../../src/endpoints/user/user.service';
import type { IUser, IUserWithID } from '../../../src/models/i-user';
import type { IUserToken, IUserTokenWithID, UserTokenType } from '../../../src/models/i-user-token';
import { confirmUserToken, createUser, createUserToken, deleteUser, findUserToken, getAllUsers, setEnableUser, setPasswordWithUserToken, updateUser } from '../../../src/repositories/user.repository';
import { encrypt } from '../../../src/services/crypt.service';
import { getNextDayAt } from '../../../src/utils/date.utils';

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
const setPasswordWithUserTokenMock = setPasswordWithUserToken as jest.Mock;

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
    setPasswordWithUserTokenMock.mockClear();
  });
  test('should create an user with default values', async () => {
    const payload = { email: 'test@mail.com', password: '1234', username: 'test' } as IUser;
    const expectedResult = { ...payload, id: 1, password: '******' } as IUser;
    const transaction = {} as Transaction;

    encryptMock.mockImplementationOnce(() => payload.password);
    createUserMock.mockImplementationOnce(() => ({ ...payload, id: 1 }));

    const result = await service.createUser(payload, transaction);

    expect(encryptMock).toHaveBeenCalledTimes(1);
    expect(encryptMock).toHaveBeenCalledWith(payload.password, process.env.SECRET_KEY_PASSWORD);
    expect(createUserMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });
  test('should create an user confirmation token', async () => {
    const transaction = {} as Transaction;
    const type: UserTokenType = 'confirmation-email';
    const user = { email: 'test@mail.com', password: '1234', username: 'test' } as IUserWithID;
    const payload = { user, type, transaction };
    const expectedResult = { userId: 1, type: 'confirmation-email', token: 'TOKEN' } as IUserToken;

    createUserTokenMock.mockImplementationOnce(() => expectedResult);

    const result = await service.createToken(payload);

    expect(createUserTokenMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });
  test('should create an user change password token', async () => {
    const transaction = {} as Transaction;
    const type: UserTokenType = 'change-password';
    const user = { email: 'test@mail.com', password: '1234', username: 'test' } as IUserWithID;
    const payload = { user, type, transaction };
    const expectedResult = { userId: 1, type: 'change-password', token: 'TOKEN' } as IUserToken;

    createUserTokenMock.mockImplementationOnce(() => expectedResult);

    const result = await service.createToken(payload);

    expect(createUserTokenMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });
  test('when use an invalid token to confirm account should return false', async () => {
    findUserTokenMock.mockImplementationOnce(() => undefined);

    const result = await service.confirmUserAccount('TOKEN');

    expect(result).toBeFalsy();
  });
  test('when use a valid token to confirm account should return true', async () => {
    const type = 'confirmation-email';
    const date = getNextDayAt(new Date());
    const transaction = (cb: CallableFunction) => { cb(); };
    const userToken = { type, expiresIn: date } as IUserTokenWithID;

    findUserTokenMock.mockImplementationOnce(() => userToken);
    getConnectionMock.mockImplementationOnce(() => ({ transaction }));

    const result = await service.confirmUserAccount('TOKEN');

    expect(result).toBeTruthy();
    expect(findUserTokenMock).toHaveBeenCalledTimes(1);
    expect(getConnectionMock).toHaveBeenCalledTimes(1);
    expect(confirmUserTokenMock).toHaveBeenCalledTimes(1);
  });
  test('when use an invalid token to set user password should return false', async () => {
    const payload = { token: 'TOKEN', password: '1234' };

    findUserTokenMock.mockImplementationOnce(() => undefined);

    const result = await service.setUserPassword(payload);

    expect(result).toBeFalsy();
  });
  test('when use a valid token to set user password should return true', async () => {
    const type = 'change-password';
    const date = getNextDayAt(new Date());
    const payload = { token: 'TOKEN', password: '1234' };
    const transaction = (cb: CallableFunction) => { cb(); };
    const userToken = { type, expiresIn: date } as IUserTokenWithID;

    findUserTokenMock.mockImplementationOnce(() => userToken);
    getConnectionMock.mockImplementationOnce(() => ({ transaction }));

    const result = await service.setUserPassword(payload);

    expect(result).toBeTruthy();
    expect(findUserTokenMock).toHaveBeenCalledTimes(1);
    expect(getConnectionMock).toHaveBeenCalledTimes(1);
    expect(setPasswordWithUserTokenMock).toHaveBeenCalledTimes(1);
  });
  test('should be get all users', async () => {
    const someUser = { id: 1, username: 'user' };

    getAllUsersMock.mockImplementationOnce(() => [someUser]);

    const result = await service.getAllUsers({});

    expect(result.length).toEqual(1);
    expect(getAllUsersMock).toHaveBeenCalledTimes(1);
  });
  test('should update user attributes', async () => {
    const updatedAttrs = { id: 1, email: 'test@mail.com', username: 'test' } as IUserWithID;
    const payload = { ...updatedAttrs, confirmed: true, enabled: false } as IUserWithID;

    updateUserMock.mockImplementationOnce(() => payload);

    const result = await service.updateUser(payload);

    expect(result).toEqual(payload);
    expect(updateUserMock).toHaveBeenCalledWith(updatedAttrs);
  });
  test('when enable user with invalid id should throw an error', async () => {
    const throwError = jest.fn();

    await service.enableUser('NaN', true).catch(throwError);

    expect(throwError).toHaveBeenCalled();
  });
  test('when enable user with valid id should return the updated user', async () => {
    const expectedResult = { id: 1 };

    setEnableUserMock.mockImplementationOnce(() => expectedResult);

    const result = await service.enableUser('1', true);

    expect(result).toEqual(expectedResult);
    expect(setEnableUserMock).toHaveBeenCalledTimes(1);
  });
  test('when delete user with invalid id should throw an error', async () => {
    const throwError = jest.fn();

    await service.deleteUser('NaN').catch(throwError);

    expect(throwError).toHaveBeenCalled();
  });
  test('when delete user with valid id should not throw an error', async () => {
    const transaction = (cb: CallableFunction) => { cb(); };

    getConnectionMock.mockImplementationOnce(() => ({ transaction }));

    await service.deleteUser('1');

    expect(getConnectionMock).toHaveBeenCalledTimes(1);
    expect(deleteUserMock).toHaveBeenCalledTimes(1);
  });
});