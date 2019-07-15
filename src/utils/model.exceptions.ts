export class ErrorException extends Error {
  constructor(
    public msg: string,
    public code: number,
  ) {
    super(msg)
  }
}

export class AlreadyExistException extends ErrorException {
  constructor(msg?: string, code?: number) {
    super(msg || 'Resource already exists', code || 409)
  }
}

export class NotFoundException extends ErrorException {
  constructor(msg?: string, code?: number) {
    super(msg || 'Resource not found', code || 404)
  }
}

export class WrongPasswordException extends ErrorException {
  constructor(msg?: string, code?: number) {
    super(msg || 'Wrong password', code || 404)
  }
}
