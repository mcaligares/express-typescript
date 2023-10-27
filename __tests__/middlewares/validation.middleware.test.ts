import type { Response } from 'express';
import type { Schema } from 'joi';

import { validationMiddleware } from '../../src/middlewares/validation.middleware';
import type { IRequest } from '../../src/models/i-request';

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

describe('test validation middleware', () => {
  test('when send a valid request should continue the request', () => {
    const req = {} as IRequest;
    const res = {} as Response;
    const next = jest.fn();
    const validateMock = jest.fn();
    const schema = { validate: validateMock } as unknown as Schema;

    validateMock.mockImplementationOnce(() => ({
      error: false,
      value: {},
    }));

    const response = validationMiddleware(req, res, next, schema);

    expect(response).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
  });
  test('when send an invalid request should return a 400 code', () => {
    const req = {} as IRequest;
    const res = {} as Response;
    const next = jest.fn();
    const validateMock = jest.fn();
    const schema = { validate: validateMock } as unknown as Schema;
    const expectedResponse = { code: 400, isOk: false };

    validateMock.mockImplementationOnce(() => ({
      error: true,
      value: {},
    }));

    const response = validationMiddleware(req, res, next, schema);

    expect(response).toEqual(expectedResponse);
  });
  test('when an error happens should be return a 500 code', () => {
    const req = {} as IRequest;
    const res = {} as Response;
    const next = jest.fn();
    const validateMock = jest.fn();
    const schema = { validate: validateMock } as unknown as Schema;
    const expectedResponse = { code: 500, isOk: false };

    validateMock.mockImplementationOnce(() => {
      throw 'some Error';
    });

    const response = validationMiddleware(req, res, next, schema);

    expect(response).toEqual(expectedResponse);
  });
});