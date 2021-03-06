import request from 'supertest'
import UserController from '../../src/controllers/user.controller'
import { UserModel } from '../../src/models/user.model'
import Server from '../../src/server'
import * as exception from '../../src/utils/model.exceptions'
import * as mocks from '../mocks'

describe('validation middleware test', () => {
  const server = new Server().useJsonParser().withPort(3000).withRoute('/', new UserController().router)
  const controller = request(server.application)

  test.each(mocks.invalidEmailsList)(
    'controller should response with email errors',
    async (username) => {
      const data = { username, password: '1234567' }
      const result = await controller.put('/user').send(data)
      expect(result.status).toEqual(422)
      expect(result.body.errors.length).toBe(1)
      expect(result.body.errors[0].param).toEqual('username')
      expect(result.body.errors[0].msg).toEqual('Invalid value')
    },
  )

  test.each(mocks.invalidPasswordList)(
    'controller should response with password errors',
    async (password) => {
      const data = { username: 'test@email.com', password }
      const result = await controller.put('/user').send(data)
      expect(result.status).toEqual(422)
      expect(result.body.errors.length).toBe(1)
      expect(result.body.errors[0].param).toEqual('password')
      expect(result.body.errors[0].msg).toEqual('Invalid value')
    },
  )
})

describe('unit test for controller', () => {
  beforeEach(() => {
    mocks.nextMock.mockReset()
    mocks.serviceMock.mockReset()
    mocks.responseMock.mockReset()
  })

  const controller = (service: any) => new UserController(service)

  const validData = { username: 'test@email.com', password: '1234567' }
  test('create endpoint should respond without errors when send valid data', async () => {
    mocks.serviceMock.create.mockReturnValue(validData)
    await controller(mocks.serviceMock).create({ body: validData }, mocks.responseMock, mocks.nextMock)
    expect(mocks.serviceMock.create).toBeCalled()
    expect(mocks.responseMock.json).toBeCalledWith(validData)
  })

  const errorsList = [new exception.AlreadyExistException(), new Error()]
  test.each(errorsList)(
    'create endpoint should respond with an error when is throw by create method',
    async (exception) => {
      mocks.serviceMock.create.mockImplementation(() => { throw exception })
      await controller(mocks.serviceMock).create({ body: validData }, mocks.responseMock, mocks.nextMock)
      expect(mocks.serviceMock.create).toThrow(exception)
      expect(mocks.nextMock).toBeCalledWith(exception)
    },
  )

  test('list endpoint should respond with an user list', async () => {
    const users = [ 'user 1', 'user 2' ]
    mocks.serviceMock.findAllBy.mockReturnValue(users)
    await controller(mocks.serviceMock).list({}, mocks.responseMock, mocks.nextMock)
    expect(mocks.serviceMock.findAllBy).toBeCalledWith(UserModel)
    expect(mocks.responseMock.json).toBeCalledWith(users)
  })

  test('login endpoint should respond with the logged user', async () => {
    mocks.serviceMock.findyByUsernameAndPassword.mockReturnValue(validData)
    await controller(mocks.serviceMock).login({ body: validData }, mocks.responseMock, mocks.nextMock)
    expect(mocks.serviceMock.findyByUsernameAndPassword).toBeCalledWith(validData.username, validData.password)
    expect(mocks.responseMock.json).toBeCalledWith(validData)
  })

  const errorsLogin = [new Error(), new exception.NotFoundException(), new exception.WrongPasswordException()]
  test.each(errorsLogin)(
    'login endpoint should respond with an error when is throw by findByUsernameAndPassword method',
    async (exception) => {
      mocks.serviceMock.findyByUsernameAndPassword.mockImplementation(() => { throw exception })
      await controller(mocks.serviceMock).login({ body: validData }, mocks.responseMock, mocks.nextMock)
      expect(mocks.serviceMock.findyByUsernameAndPassword).toThrow(exception)
      expect(mocks.nextMock).toBeCalledWith(exception)
    },
  )

})
