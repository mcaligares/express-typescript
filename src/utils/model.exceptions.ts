export class ErrorException extends Error {
  constructor(
    public msg: string,
    public code: number,
  ) {
    super(msg)
  }
}

export class AlreadyExistException extends ErrorException {
  constructor(
    msg?: string,
    code?: number,
  ) {
    super(msg || 'Resource already exists', code || 409)
  }
}
