import * as dotenv from 'dotenv'
import fs from 'fs'
import { ErrorException } from '../utils/model.exceptions'

const ENV_PATH: string = `${__dirname}/../../`

type IConfig = dotenv.DotenvParseOutput & {
  PORT: number,
  IS_PROD: boolean,
  MONGODB_URL: string,
}
/**
 * Load all environment variables from env file and return a `IConfig` object.
 * The method can throw an exception when the `dotenv.config` method fail.
 * @param path Path to your env files. Default value is `${ENV_PATH}`
 */
export function initializeConfig(path: string = ENV_PATH): IConfig {
  path += getEnvFileByEnvironment()
  const config = dotenv.config({ path })
  if (config.error) {
    throw new ErrorException(`Error reading env file ${path}. Please make sure that file exists.`, 1, config.error)
  }
  return overrideConfig(config.parsed as IConfig)
}

const getEnvFileByEnvironment = (env: string = process.env.NODE_ENV) => {
  return env === 'test' ? '.env.test' : env === 'production' ? '.env' : '.env.development'
}

const overrideConfig = (config: IConfig): IConfig => {
  const overrideConfig = { IS_PROD: process.env.NODE_ENV === 'production'}
  return Object.assign(overrideConfig, config)
}

/**
 * Get all environment variables from env file and return a `IConfig` object.
 * @param path Path to your env files. Default value is `${ENV_PATH}`
 */
export function getConfig(path: string = ENV_PATH) {
  path += getEnvFileByEnvironment()
  const config = dotenv.parse(fs.readFileSync(path))
  return overrideConfig(config as IConfig)
}
