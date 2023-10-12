import type { Response } from 'express';

import * as controller from '../../../src/endpoints/user/user.controller';
import * as service from '../../../src/endpoints/user/user.service';
import type { IUser, IUserWithID } from '../../../src/models/i-user';

jest.mock('../../../src/endpoints/user/user.service');
jest.mock('../../../src/services/controller.service', () => ({
  createResponse: (code: number, isOk: boolean) => {
    const response = {
      withMessage: () => response,
      withResult: () => response,
      withLogger: () => response,
      send: () => ({ code, isOk }),
    };

    return response;
  }
}));

const serviceCreateUserMock = service.createUser as jest.Mock;
const serviceCreateTokenMock = service.createToken as jest.Mock;
const serviceWithTransactionMock = service.withTransaction as jest.Mock;
const serviceConfirmUserAccountMock = service.confirmUserAccount as jest.Mock;
const serviceSetUserPasswordMock = service.setUserPassword as jest.Mock;
const serviceGetAllUsersMock = service.getAllUsers as jest.Mock;
const serviceUpdateUserMock = service.updateUser as jest.Mock;
const serviceEnableUserMock = service.enableUser as jest.Mock;
const serviceDeleteUserMock = service.deleteUser as jest.Mock;

describe('test user controller', () => {
  beforeEach(() => {
    serviceCreateUserMock.mockClear();
    serviceCreateTokenMock.mockClear();
    serviceWithTransactionMock.mockClear();
    serviceWithTransactionMock.mockImplementationOnce((cb: CallableFunction) => cb());
    serviceConfirmUserAccountMock.mockClear();
    serviceSetUserPasswordMock.mockClear();
    serviceGetAllUsersMock.mockClear();
    serviceUpdateUserMock.mockClear();
    serviceEnableUserMock.mockClear();
    serviceDeleteUserMock.mockClear();
  });

  describe('test create user endpoint', () => {
    test('should create a new user', async () => {
      const res = {} as Response;
      const payload = { email: 'test@mail.com', password: '1234' } as IUser;
      const expectedResponse = { code: 200, isOk: true };

      serviceCreateUserMock.mockImplementationOnce(() => {
        return { ...payload, id: 1 } as IUserWithID;
      });

      const response = await controller.user(payload, res);

      expect(response).toEqual(expectedResponse);
      expect(serviceCreateUserMock).toHaveBeenCalledTimes(1);
      expect(serviceCreateTokenMock).toHaveBeenCalledTimes(1);
      expect(serviceWithTransactionMock).toHaveBeenCalledTimes(1);
    });
    test('when an error happens should be return 500 code', async () => {
      const res = {} as Response;
      const payload = { email: 'test@mail.com', password: '1234' } as IUser;
      const expectedResponse = { code: 500, isOk: false };

      serviceCreateUserMock.mockImplementationOnce(() => {
        throw 'some Error';
      });

      const response = await controller.user(payload, res);

      expect(response).toEqual(expectedResponse);
      expect(serviceCreateUserMock).toHaveBeenCalledTimes(1);
      expect(serviceWithTransactionMock).toHaveBeenCalledTimes(1);
    });
  });
  describe('test confirm user account endpoint', () => {
    test('should confirm the user account', async () => {
      const res = {} as Response;
      const payload = { token: 'TOKEN' };
      const expectedResponse = { code: 200, isOk: true };

      serviceConfirmUserAccountMock.mockImplementationOnce(() => {
        return true;
      });

      const response = await controller.confirm(payload, res);

      expect(response).toEqual(expectedResponse);
      expect(serviceConfirmUserAccountMock).toHaveBeenCalledTimes(1);
    });
    test('when use an invalid token should be return a 403 code', async () => {
      const res = {} as Response;
      const payload = { token: 'TOKEN' };
      const expectedResponse = { code: 403, isOk: false };

      serviceConfirmUserAccountMock.mockImplementationOnce(() => {
        return false;
      });

      const response = await controller.confirm(payload, res);

      expect(response).toEqual(expectedResponse);
      expect(serviceConfirmUserAccountMock).toHaveBeenCalledTimes(1);
    });
    test('when an error happens should be return a 500 code', async () => {
      const res = {} as Response;
      const payload = { token: 'TOKEN' };
      const expectedResponse = { code: 500, isOk: false };

      serviceConfirmUserAccountMock.mockImplementationOnce(() => {
        throw 'some Error';
      });

      const response = await controller.confirm(payload, res);

      expect(response).toEqual(expectedResponse);
      expect(serviceConfirmUserAccountMock).toHaveBeenCalledTimes(1);
    });
  });
  describe('test set user password endpoint', () => {
    test('should set the user password', async () => {
      const res = {} as Response;
      const payload = { token: 'TOKEN', password: '1234' };
      const expectedResponse = { code: 200, isOk: true };

      serviceSetUserPasswordMock.mockImplementationOnce(() => {
        return true;
      });

      const response = await controller.setPassword(payload, res);

      expect(response).toEqual(expectedResponse);
      expect(serviceSetUserPasswordMock).toHaveBeenCalledTimes(1);
    });
    test('when use an invalid token should be return a 403 code', async () => {
      const res = {} as Response;
      const payload = { token: 'TOKEN', password: '1234' };
      const expectedResponse = { code: 403, isOk: false };

      serviceSetUserPasswordMock.mockImplementationOnce(() => {
        return false;
      });

      const response = await controller.setPassword(payload, res);

      expect(response).toEqual(expectedResponse);
      expect(serviceSetUserPasswordMock).toHaveBeenCalledTimes(1);
    });
    test('when an error happens should be return a 500 code', async () => {
      const res = {} as Response;
      const payload = { token: 'TOKEN', password: '1234' };
      const expectedResponse = { code: 500, isOk: false };

      serviceSetUserPasswordMock.mockImplementationOnce(() => {
        throw 'some Error';
      });

      const response = await controller.setPassword(payload, res);

      expect(response).toEqual(expectedResponse);
      expect(serviceSetUserPasswordMock).toHaveBeenCalledTimes(1);
    });
  });
  describe('test get users endpoint', () => {
    test('should be return all users', async () => {
      const users = [1, 2, 3];
      const res = {} as Response;
      const expectedResponse = { code: 200, isOk: true };

      serviceGetAllUsersMock.mockImplementationOnce(() => users);

      const response = await controller.users({}, res);

      expect(response).toEqual(expectedResponse);
      expect(serviceGetAllUsersMock).toHaveBeenCalledTimes(1);
    });
    test('whe an error happens should be return a 500 code', async () => {
      const res = {} as Response;
      const expectedResponse = { code: 500, isOk: false };

      serviceGetAllUsersMock.mockImplementationOnce(() => {
        throw 'some Error';
      });

      const response = await controller.users({}, res);

      expect(response).toEqual(expectedResponse);
      expect(serviceGetAllUsersMock).toHaveBeenCalledTimes(1);
    });
  });
  describe('test update user endpoint', () => {
    test('should update user', async () => {
      const res = {} as Response;
      const payload = { id: 1, email: 'test@mail.com' } as IUserWithID;
      const expectedResponse = { code: 200, isOk: true };

      serviceUpdateUserMock.mockImplementationOnce(() => payload);

      const response = await controller.update(payload, res);

      expect(response).toEqual(expectedResponse);
      expect(serviceUpdateUserMock).toHaveBeenCalledTimes(1);
    });
    test('when an error happens should be return a 500 code', async () => {
      const res = {} as Response;
      const payload = { id: 1, email: 'test@mail.com' } as IUserWithID;
      const expectedResponse = { code: 500, isOk: false };

      serviceUpdateUserMock.mockImplementationOnce(() => {
        throw 'some Error';
      });

      const response = await controller.update(payload, res);

      expect(response).toEqual(expectedResponse);
      expect(serviceUpdateUserMock).toHaveBeenCalledTimes(1);
    });
  });
  describe('test enable user endpoint', () => {
    test('should enable user', async () => {
      const res = {} as Response;
      const user = { id: 1, email: 'test@mail.com' } as IUserWithID;
      const expectedResponse = { code: 200, isOk: true };

      serviceEnableUserMock.mockImplementationOnce(() => user);

      const response = await controller.enable('1', res);

      expect(response).toEqual(expectedResponse);
      expect(serviceEnableUserMock).toHaveBeenCalledTimes(1);
    });
    test('should disable user', async () => {
      const res = {} as Response;
      const user = { id: 1, email: 'test@mail.com' } as IUserWithID;
      const expectedResponse = { code: 200, isOk: true };

      serviceEnableUserMock.mockImplementationOnce(() => user);

      const response = await controller.disable('1', res);

      expect(response).toEqual(expectedResponse);
      expect(serviceEnableUserMock).toHaveBeenCalledTimes(1);
    });
    test('when an error happens should be return a 500 code', async () => {
      const res = {} as Response;
      const expectedResponse = { code: 500, isOk: false };

      serviceEnableUserMock.mockImplementationOnce(() => {
        throw 'some Error';
      });

      const response = await controller.disable('1', res);

      expect(response).toEqual(expectedResponse);
      expect(serviceEnableUserMock).toHaveBeenCalledTimes(1);
    });
  });
  describe('test delete user endpoint', () => {
    test('should delete user', async () => {
      const res = {} as Response;
      const expectedResponse = { code: 200, isOk: true };

      const response = await controller._delete('1', res);

      expect(response).toEqual(expectedResponse);
      expect(serviceDeleteUserMock).toHaveBeenCalledTimes(1);
    });
    test('when an error happens should return a 500 code', async () => {
      const res = {} as Response;
      const expectedResponse = { code: 500, isOk: false };

      serviceDeleteUserMock.mockImplementationOnce(() => {
        throw 'some Error';
      });

      const response = await controller._delete('1', res);

      expect(response).toEqual(expectedResponse);
      expect(serviceDeleteUserMock).toHaveBeenCalledTimes(1);
    });
  });
});