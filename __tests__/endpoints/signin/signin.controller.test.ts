import type { Response } from 'express';

import * as controller from '../../../src/endpoints/signin/signin.controller';
import { signin } from '../../../src/endpoints/signin/signin.service';
import { createResponse } from '../../../src/services/controller.service';

jest.mock('../../../src/services/controller.service');
jest.mock('../../../src/endpoints/signin/signin.service');

const signinMock = signin as jest.Mock;
const createResponseMock = createResponse as jest.Mock;

const createResponseImplementation = (sendMock: CallableFunction) => {
  const withResultMock = () => {
    return { withMessage: withMessageMock, send: sendMock };
  };
  const withMessageMock = () => {
    return { withResult: withResultMock, send: sendMock };
  };

  return () => ({ withMessage: withMessageMock, withResult: withResultMock });
};

const checkExpectations = (payload: unknown, code: number, error: boolean, sendMock: unknown) => {
  expect(signinMock).toHaveBeenCalledTimes(1);
  expect(signinMock).toHaveBeenCalledWith(payload);
  expect(createResponseMock).toHaveBeenCalledTimes(1);
  expect(createResponseMock).toHaveBeenCalledWith(code, error);
  expect(sendMock).toHaveBeenCalledTimes(1);
};

describe('test signin controller', () => {
  beforeEach(() => {
    (signin as jest.Mock).mockClear();
    (createResponse as jest.Mock).mockClear();
  });
  describe('login with email', () => {
    test('login successfully', async () => {
      const res = {} as Response;
      const payload = { email: 'mail', password: '1234' };
      const expectedResponse = { user: 'mock' };
      const sendMock = jest.fn(() => expectedResponse);

      signinMock.mockImplementationOnce(() => expectedResponse);
      createResponseMock.mockImplementationOnce(
        createResponseImplementation(sendMock)
      );

      const response = await controller.signinWithEmail(payload, res);

      checkExpectations(payload, 200, true, sendMock);
      expect(response).toEqual(expectedResponse);
    });
    test('login with wrong payload', async () => {
      const res = {} as Response;
      const payload = { email: 'some@mail.com', password: '1234' };
      const expectedResponse = undefined;
      const sendMock = jest.fn(() => expectedResponse);

      signinMock.mockImplementationOnce(() => expectedResponse);
      createResponseMock.mockImplementationOnce(
        createResponseImplementation(sendMock)
      );

      const response = await controller.signinWithEmail(payload, res);

      checkExpectations(payload, 400, false, sendMock);
      expect(response).toEqual(expectedResponse);
    });
    test('login with unexpected error', async () => {
      const res = {} as Response;
      const payload = { email: 'some@mail.com', password: '1234' };
      const expectedResponse = { ok: false };
      const sendMock = jest.fn(() => expectedResponse);

      signinMock.mockImplementationOnce(() => { throw 'mock error'; });
      createResponseMock.mockImplementationOnce(
        createResponseImplementation(sendMock)
      );

      const response = await controller.signinWithEmail(payload, res);

      checkExpectations(payload, 500, false, sendMock);
      expect(response).toEqual(expectedResponse);
    });
  });
  describe('login with username', () => {
    test('login successfully', async () => {
      const res = {} as Response;
      const payload = { username: 'user', password: '1234' };
      const expectedResponse = { user: 'mock' };
      const sendMock = jest.fn(() => expectedResponse);

      signinMock.mockImplementationOnce(() => expectedResponse);
      createResponseMock.mockImplementationOnce(
        createResponseImplementation(sendMock)
      );

      const response = await controller.signinWithUsername(payload, res);

      checkExpectations(payload, 200, true, sendMock);
      expect(response).toEqual(expectedResponse);
    });
    test('login with wrong payload', async () => {
      const res = {} as Response;
      const payload = { username: 'user', password: '1234' };
      const expectedResponse = undefined;
      const sendMock = jest.fn(() => expectedResponse);

      signinMock.mockImplementationOnce(() => expectedResponse);
      createResponseMock.mockImplementationOnce(
        createResponseImplementation(sendMock)
      );

      const response = await controller.signinWithUsername(payload, res);

      checkExpectations(payload, 400, false, sendMock);
      expect(response).toEqual(expectedResponse);
    });
    test('login with unexpected error', async () => {
      const res = {} as Response;
      const payload = { username: 'user', password: '1234' };
      const expectedResponse = { ok: false };
      const sendMock = jest.fn(() => expectedResponse);

      signinMock.mockImplementationOnce(() => { throw 'mock error'; });
      createResponseMock.mockImplementationOnce(
        createResponseImplementation(sendMock)
      );

      const response = await controller.signinWithUsername(payload, res);

      checkExpectations(payload, 500, false, sendMock);
      expect(response).toEqual(expectedResponse);
    });
  });
});