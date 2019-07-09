export const invalidEmailsList = [
  'test',
  'test@',
  'test@email',
  'test@email.',
  'test@email.x',
  'test@email.x.',
  '@email',
  '@email.com',
]

export const invalidPasswordList = [
  '1234',
  '12345',
  '1234567890123',
  '12345678901234',
]

class ResponseMock {
  send = jest.fn()
  status = jest.fn()

  constructor() {
    this.mockReset()
  }

  mockReset = () => {
    this.send.mockReset()
    this.status.mockReset()
    this.status.mockReturnThis()
  }
}

export const responseMock = new ResponseMock()
