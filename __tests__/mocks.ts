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
  json = jest.fn()
  status = jest.fn()

  constructor() {
    this.mockReset()
  }

  mockReset = () => {
    this.send.mockReset()
    this.json.mockReset()
    this.status.mockReset()
    this.status.mockReturnThis()
  }
}

export const responseMock = new ResponseMock()

class ServiceMock {
  create = jest.fn()
  save = jest.fn()
  findBy = jest.fn()
  findAllBy = jest.fn()

  constructor() { this.mockReset() }

  mockReset = () => {
    this.create.mockReset()
    this.save.mockReset()
    this.findBy.mockReset()
    this.findAllBy.mockReset()
  }
}

export const serviceMock = new ServiceMock()
