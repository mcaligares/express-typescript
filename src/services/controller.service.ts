import type { Response } from 'express';

import type { IResponse } from '@/models/i-response';

import type { Logger } from './logger.service';

class ControllerResponse<T> {
  private message?: string;
  private result?: T;

  constructor(
    private code: number,
    private ok: boolean
  ) { }

  withMessage(message: string) {
    this.message = message;

    return this;
  }

  withResult(result: T) {
    this.result = result;

    return this;
  }

  send(res: Response) {
    const obj: IResponse<T> = {
      ok: this.ok,
      result: this.result,
      message: this.message as string,
    };

    return res.status(this.code).send(obj);
  }

  withLogger(logger: Logger) {
    logger.debug('sending response', this);

    return this;
  }
}

export function createResponse<T>(code: number, isOk: boolean) {
  return new ControllerResponse<T>(code, isOk);
}
