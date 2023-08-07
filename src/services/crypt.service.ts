import crypto from 'crypto-js/';
import { Logger } from './logger.service';

const logger = new Logger('CryptService');

export function encrypt(value: string, secret: string) {
  if (!value) {
    throw new Error('Error hashing value. Invalid value');
  }
  if (!secret) {
    throw new Error('Error hashing value. Invalid secret');
  }

  try {
    return crypto.AES.encrypt(value, secret).toString();
  } catch (e) {
    logger.error('Error generating hash', e);
    throw e;
  }
}

export function decrypt(value: string, secret: string) {
  if (!value) {
    throw new Error('Error hashing value. Invalid value');
  }
  if (!secret) {
    throw new Error('Error hashing value. Invalid secret');
  }

  try {
    return crypto.AES.decrypt(value, secret).toString(crypto.enc.Utf8);
  } catch (e) {
    logger.error('Error comparing hash', e);
    throw e;
  }
}
