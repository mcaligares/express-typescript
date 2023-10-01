import * as service from '../../../src/endpoints/signin/signin.service';
import { findUserByEmailOrUsername } from '../../../src/repositories/user.repository';
import { decrypt } from '../../../src/services/crypt.service';
import { generateToken } from '../../../src/services/token.service';

jest.mock('../../../src/services/token.service');
jest.mock('../../../src/services/crypt.service');
jest.mock('../../../src/repositories/user.repository');

const decryptMock = decrypt as jest.Mock;
const generateTokenMock = generateToken as jest.Mock;
const findUserByEmailOrUsernameMock = findUserByEmailOrUsername as jest.Mock;

describe('test signin service', () => {
  beforeEach(() => {
    decryptMock.mockClear();
    generateTokenMock.mockClear();
    findUserByEmailOrUsernameMock.mockClear();
  });
  test('signin successfully', async () => {
    const email = 'some@mail.com';
    const password = '1234';
    const accessToken = '';
    const payload = { email, password };
    const payloadWithoutPass = { email, password: '******' };
    const expectedResult = { accessToken, user: payloadWithoutPass };

    decryptMock.mockImplementationOnce(() => password);
    generateTokenMock.mockImplementationOnce(() => accessToken);
    findUserByEmailOrUsernameMock.mockImplementationOnce(() => payload);

    const result = await service.signin(payload);

    expect(findUserByEmailOrUsernameMock).toHaveBeenCalledTimes(1);
    expect(findUserByEmailOrUsernameMock).toHaveBeenCalledWith({ email });
    expect(decryptMock).toHaveBeenCalledTimes(1);
    expect(decryptMock).toHaveBeenCalledWith(payload.password, process.env.SECRET_KEY_PASSWORD);
    expect(generateTokenMock).toHaveBeenCalledTimes(1);
    expect(generateTokenMock).toHaveBeenCalledWith(payloadWithoutPass, process.env.SECRET_KEY_TOKEN);
    expect(result).toEqual(expectedResult);
  });
  test('signin with invalid email', async () => {
    const email = 'some@mail.com';
    const password = '1234';
    const payload = { email, password };
    const expectedResult = undefined;

    findUserByEmailOrUsernameMock.mockImplementationOnce(() => undefined);

    const result = await service.signin(payload);

    expect(findUserByEmailOrUsernameMock).toHaveBeenCalledTimes(1);
    expect(findUserByEmailOrUsernameMock).toHaveBeenCalledWith({ email });
    expect(result).toEqual(expectedResult);
  });
  test('signin with invalid password', async () => {
    const email = 'some@mail.com';
    const password = '4321';
    const payload = { email, password };
    const expectedResult = undefined;

    decryptMock.mockImplementationOnce(() => 'OTHER_PASS');
    findUserByEmailOrUsernameMock.mockImplementationOnce(() => payload);

    const result = await service.signin(payload);

    expect(findUserByEmailOrUsernameMock).toHaveBeenCalledTimes(1);
    expect(findUserByEmailOrUsernameMock).toHaveBeenCalledWith({ email });
    expect(decryptMock).toHaveBeenCalledTimes(1);
    expect(decryptMock).toHaveBeenCalledWith(payload.password, process.env.SECRET_KEY_PASSWORD);
    expect(result).toEqual(expectedResult);
  });
});