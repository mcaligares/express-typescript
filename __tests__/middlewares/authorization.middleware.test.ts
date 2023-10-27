import type { Response } from 'express';

import { authorizationMiddleware } from '../../src/middlewares/authorization.middleware';
import type { IRequest } from '../../src/models/i-request';
import type { ISession } from '../../src/models/i-session';

jest.mock('../../src/routes/authorization.route', () => ({
  authRouteMap: [
    { key: 'some-path', allowedRoles: ['ADMIN'] }
  ]
}));
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

describe('test authorization middleware', () => {
  test('when request is not authenticated should return 403 code', () => {
    const next = jest.fn();
    const res = {} as Response;
    const req = { isAuthenticated: false } as IRequest;
    const expectedResponse = { code: 403, isOk: false };

    const response = authorizationMiddleware(req, res, next);

    expect(response).toEqual(expectedResponse);
  });
  test('when admin user wants to access to user-create path should be allowed', () => {
    const next = jest.fn();
    const res = {} as Response;
    const session = { user: { role: 'ADMIN' } } as ISession;
    const req = { isAuthenticated: true, session } as unknown as IRequest;

    const response = authorizationMiddleware(req, res, next, 'some-path');

    expect(response).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
  });
  test('when user wants to access to user-create path should be not allowed', () => {
    const next = jest.fn();
    const res = {} as Response;
    const session = { user: { role: 'USER' } } as ISession;
    const req = { isAuthenticated: true, session } as unknown as IRequest;
    const expectedResponse = { code: 403, isOk: false };

    const response = authorizationMiddleware(req, res, next, 'some-path');

    expect(response).toEqual(expectedResponse);
  });
  test('when user wants to access to path not mapped should be allowed', () => {
    const next = jest.fn();
    const res = {} as Response;
    const session = { user: { role: 'USER' } } as ISession;
    const req = { isAuthenticated: true, session } as unknown as IRequest;

    const response = authorizationMiddleware(req, res, next, 'unmapped-path');

    expect(response).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
  });
});