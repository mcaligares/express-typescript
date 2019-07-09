import request from 'supertest'
import UserController from '../../src/controllers/user.controller'
import Server from '../../src/server'
import { AlreadyExistException } from '../../src/utils/model.exceptions'
import { invalidEmailsList, invalidPasswordList, responseMock } from '../mocks'

describe('validation middleware test', () => {
  const server = new Server().withJson().withPort(3000).withRoute('/', new UserController().router)
  const controller = request(server.application)

  test.each(invalidEmailsList)(
    'controller should response with email errors',
    async (username) => {
      const data = { username, password: '1234567' }
      const result = await controller.post('/user').send(data)
      expect(result.status).toEqual(422)
      expect(result.body.errors.length).toBe(1)
      expect(result.body.errors[0].param).toEqual('username')
      expect(result.body.errors[0].msg).toEqual('Invalid value')
    },
  )

  test.each(invalidPasswordList)(
    'controller should response with password errors',
    async (password) => {
      const data = { username: 'test@email.com', password }
      const result = await controller.post('/user').send(data)
      expect(result.status).toEqual(422)
      expect(result.body.errors.length).toBe(1)
      expect(result.body.errors[0].param).toEqual('password')
      expect(result.body.errors[0].msg).toEqual('Invalid value')
    },
  )
})

describe('unit test for controller', () => {
  const data = { username: 'test@email.com', password: '1234567' }
  const errors = [ { code: 409, error: new AlreadyExistException() }, { code: 500, error: new Error() }]

  beforeEach(() => {
    responseMock.mockReset()
  })

  test('should respond without errors', async () => {
    const serviceMock = { create: jest.fn(), save: jest.fn(), findBy: jest.fn() }
    serviceMock.create.mockReturnValue(data)
    await new UserController(serviceMock).create({ body: data }, responseMock)
    expect(serviceMock.create).toBeCalled()
    expect(responseMock.send).toBeCalledWith(data)
  })

  test.each(errors)(
    'should respond with error',
    async (exception) => {
      const serviceMock = { save: jest.fn(), findBy: jest.fn(), create: () => { throw exception.error } }
      await new UserController(serviceMock).create({ body: data }, responseMock)
      expect(serviceMock.create).toThrow(exception.error)
      expect(responseMock.status).toBeCalledWith(exception.code)
      expect(responseMock.send).toBeCalledWith({errors: [exception.error]})
    },
  )
})
