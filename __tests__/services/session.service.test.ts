import type { IRequest } from '../../src/models/i-request';
import { getUserById } from '../../src/repositories/user.repository';
import * as service from '../../src/services/session.service';
import { decodeToken } from '../../src/services/token.service';

jest.mock('../../src/services/token.service');
jest.mock('../../src/repositories/user.repository');

const decodeTokenMock = decodeToken as jest.Mock;
const getUserByIdMock = getUserById as jest.Mock;

describe('test session service', () => {
  beforeEach(() => {
    decodeTokenMock.mockClear();
    getUserByIdMock.mockClear();
  });
  test('when request have session should return session', async () => {
    const session = { user: { id: 1 } };
    const req = { session } as unknown as IRequest;

    const result = await service.getSession(req);

    expect(result).toEqual(session);
  });
  test('when request dont have auth header should return undefined', async () => {
    const req = { headers: {} } as unknown as IRequest;

    const result = await service.getSession(req);

    expect(result).toBeUndefined();
  });
  test('when request have an invalid auth header should return undefined', async () => {
    const req = { headers: { authorization: 'Bearer SOME INVALID TOKEN' } } as unknown as IRequest;

    const result = await service.getSession(req);

    expect(result).toBeUndefined();
  });
  test('when request have a valid auth header should return a new session', async () => {
    const expectedResult = { user: { id: 1 } };
    const req = { headers: { authorization: 'Bearer VALID_TOKEN' } } as unknown as IRequest;

    decodeTokenMock.mockImplementationOnce(() => ({ payload: { id: 1 } }));
    getUserByIdMock.mockImplementationOnce(() => expectedResult.user);

    const result = await service.getSession(req);

    expect(result).toEqual(expectedResult);
  });
  test('when request have a valid auth header but user dont exists should return undefined', async () => {
    const req = { headers: { authorization: 'Bearer VALID_TOKEN' } } as unknown as IRequest;

    decodeTokenMock.mockImplementationOnce(() => ({ payload: { id: 1 } }));
    getUserByIdMock.mockImplementationOnce(() => undefined);

    const result = await service.getSession(req);

    expect(result).toBeUndefined();
  });
});