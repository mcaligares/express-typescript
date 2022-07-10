/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Level, Logger as Logger4JS } from 'log4js';
import { getLogger, levels } from 'log4js';

const defaultLevel = levels.ALL;

export class Logger {
  private static level: Level = defaultLevel;
  private _logger: Logger4JS;

  constructor(category = '') {
    this._logger = getLogger(category || process.env.APP_NAME);
    this._logger.level = Logger.level;
  }

  static setLevel(level: Level = levels.ALL) {
    Logger.level = level;
  }

  public error(message: any, ...args: any[]) {
    this._logger.error(message, ...args);
  }

  public warn(message: string, ...args: any[]) {
    this._logger.warn(message, ...args);
  }

  public info(message: string, ...args: any[]) {
    this._logger.info(message, ...args);
  }

  public debug(message: string, ...args: any[]) {
    this._logger.debug(message, ...args);
  }

  public log(message: string, ...args: any[]) {
    this._logger.log(message, ...args);
  }

  public trace(message: string, ...args: any[]) {
    this._logger.trace(message, ...args);
  }
}

Logger.setLevel((process.env.LOG_LEVEL || defaultLevel) as Level);

export const logger = new Logger();
