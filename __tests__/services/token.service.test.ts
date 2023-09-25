import jwt from 'jsonwebtoken';

import * as service from '../../src/services/token.service';

jest.mock('jsonwebtoken');

const SECRET_KEY = 'KEY';

describe('test token service', () => {
  describe('test generate token', () => {
    test('generate token', () => {
      (jwt.sign as jest.Mock).mockImplementationOnce(() => 'TOKEN');

      const token = service.generateToken({}, SECRET_KEY);

      expect(token).toEqual('TOKEN');
    });
    test('generate token with invalid payload', () => {
      const errorMessage = 'Error generating token. Invalid payload';
      const tryGenerateToken = () => {
        service.generateToken(undefined, '');
      };

      expect(tryGenerateToken).toThrowError(errorMessage);
    });
    test('generate token with invalid secret', () => {
      const errorMessage = 'Error generating token. Invalid secret key';
      const tryGenerateToken = () => {
        service.generateToken({}, '');
      };

      expect(tryGenerateToken).toThrowError(errorMessage);
    });
    test('generate token with error', () => {
      (jwt.sign as jest.Mock).mockImplementationOnce(() => {
        throw 'error';
      });

      const tryGenerateToken = () => {
        service.generateToken({}, 'KEY');
      };

      expect(tryGenerateToken).toThrowError();
    });
  });

  describe('test decode token', () => {
    test('decode token', () => {
      (jwt.verify as jest.Mock).mockImplementationOnce(() => ({ iat: 1, payload: {} }));
      const token = '123456qwerty';
      const decoded = service.decodeToken(token, SECRET_KEY) as { iat: number, payload: unknown };

      expect(decoded).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.payload).toBeDefined();
    });
    test('decode token with invalid token', () => {
      const errorMessage = 'Error decoding token. Invalid token';
      const tryDecodeToken = () => {
        service.decodeToken('', SECRET_KEY);
      };

      expect(tryDecodeToken).toThrowError(errorMessage);
    });
    test('decode token with invalid secret key', () => {
      const errorMessage = 'Error decoding token. Invalid secret key';
      const tryDecodeToken = () => {
        service.decodeToken('TOKEN', '');
      };

      expect(tryDecodeToken).toThrowError(errorMessage);
    });
  });
});
