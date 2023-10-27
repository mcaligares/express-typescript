import type { Response } from 'express';

import { authenticationMiddleware } from '../../src/middlewares/authentication.middleware';
import type { IRequest } from '../../src/models/i-request';
import { getSession } from '../../src/services/session.service';

jest.mock('../../src/services/session.service');
jest.mock('../../src/services/controller.service', () => ({
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

const getSessionMock = getSession as jest.Mock;

describe('test authentication middleware', () => {
  beforeEach(() => {
    getSessionMock.mockClear();
  });
  test('when use a valid token should continue the request', async () => {
    const req = {} as IRequest;
    const res = {} as Response;
    const next = jest.fn();
    const session = { user: { id: 1 } };

    getSessionMock.mockImplementationOnce(() => session);

    const response = await authenticationMiddleware(req, res, next);

    expect(response).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.session).toEqual(session);
    expect(req.isAuthenticated).toBeTruthy();
  });
  test('when use an invalid token should return an unauthorized code', async () => {
    const req = {} as IRequest;
    const res = {} as Response;
    const next = jest.fn();
    const expectedResponse = { code: 401, isOk: false };

    getSessionMock.mockImplementationOnce(() => false);

    const response = await authenticationMiddleware(req, res, next);

    expect(response).toEqual(expectedResponse);
  });
  test('when an error happens should be return a 500 code', async () => {
    const req = {} as IRequest;
    const res = {} as Response;
    const next = jest.fn();
    const expectedResponse = { code: 403, isOk: false };

    getSessionMock.mockImplementationOnce(() => {
      throw 'some Error';
    });

    const response = await authenticationMiddleware(req, res, next);

    expect(response).toEqual(expectedResponse);
  });
});