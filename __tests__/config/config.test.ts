import * as dotenv from 'dotenv'
import {getConfig, initializeConfig} from '../../src/config/'
import { ErrorException } from '../../src/utils/model.exceptions';

describe('config initialization', () => {

  test('initialize config should return an object with all env variables', () => {
    const config = initializeConfig()
    expect(config.IS_PROD).toBeFalsy()
    expect(config.PORT).toBe('8080')
    expect(config.MONGODB_URL).toBe('mongodb://localhost:27017/express')
  })

  test('initialize config should throw an exception when dotenv.config method fail', () => {
    try {
      const config = initializeConfig('/bad/path/')
      expect(true).toBeFalsy()
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException)
      expect(error.message).toContain('Please make sure that file exists.')
    }
  })
})
describe('get config', () => {
  test('config should return an object with all env variables', () => {
    expect(false).toBe(true)
  })
})
