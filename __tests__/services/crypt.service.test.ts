import * as service from '../../src/services/crypt.service';

const SECRET_KEY = 'KEY';

describe('test crypt service', () => {
  describe('encrypt', () => {
    test('encrypt value', () => {
      const encrypted = service.encrypt('VALUE', SECRET_KEY);

      expect(encrypted).toBeDefined();
    });
    test('encrypt with invalid value', () => {
      const error = 'Error hashing value. Invalid value';
      const tryEncrypt = () => {
        service.encrypt('', SECRET_KEY);
      };

      expect(tryEncrypt).toThrowError(error);
    });
    test('encrypt with invalid secret key', () => {
      const error = 'Error hashing value. Invalid secret';
      const tryEncrypt = () => {
        service.encrypt('VALUE', '');
      };

      expect(tryEncrypt).toThrowError(error);
    });
  });
  describe('decrypt', () => {
    test('decrypt value', () => {
      const value = 'U2FsdGVkX19cY3sYCPazseDP+2G1pZv+eGJcpFDk2nw=';
      const decrypted = service.decrypt(value, SECRET_KEY);

      expect(decrypted).toEqual('VALUE');
    });
    test('decrypt with invalid value', () => {
      const error = 'Error hashing value. Invalid value';
      const tryEncrypt = () => {
        service.decrypt('', SECRET_KEY);
      };

      expect(tryEncrypt).toThrowError(error);
    });
    test('decrypt with invalid secret key', () => {
      const error = 'Error hashing value. Invalid secret';
      const tryEncrypt = () => {
        service.decrypt('VALUE', '');
      };

      expect(tryEncrypt).toThrowError(error);
    });
  });
});