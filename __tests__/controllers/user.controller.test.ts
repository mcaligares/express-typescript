import request from 'supertest'
import UserRouter from '../../src/controllers/user.controller'
import Server from '../../src/server'
import { invalidEmailsList, invalidPasswordList } from '../mocks'

const controller = request(new Server().withJson().withPort(3000).withRoute('/', UserRouter).application)

test('controller should response with empty errors', async () => {
  const data = { username: 'email@test.com', password: '1234567' }
  const result = await controller.post('/user').send(data)
  expect(result.status).toEqual(200)
  expect(result.text).toBe('')
})

test.each(invalidEmailsList)(
  'controller should response with email errors',
  async (username: string) => {
    const data = { username, password: '1234567' }
    const result = await controller.post('/user').send(data)
    expect(result.status).toEqual(400)
    expect(result.body.errors.length).toBe(1)
    expect(result.body.errors[0].param).toEqual('username')
    expect(result.body.errors[0].msg).toEqual('Invalid value')
  },
)

test.each(invalidPasswordList)(
  'controller should response with password errors',
  async (password: string) => {
    const data = { username: 'test@email.com', password }
    const result = await controller.post('/user').send(data)
    expect(result.status).toEqual(400)
    expect(result.body.errors.length).toBe(1)
    expect(result.body.errors[0].param).toEqual('password')
    expect(result.body.errors[0].msg).toEqual('Invalid value')
  },
)
