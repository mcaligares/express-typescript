import { Request, Response } from 'express'
import request from 'supertest'
import Server from '../src/server'

const port = 3000
const message = 'welcome!'
const server = new Server().withPort(port).withRoute('/', (req: Request, res: Response) => res.send(message))

test('server should have an express application', () => {
  expect(server.application).toBeDefined()
})

test('server should set port', () => {
  expect(server.application.get('port')).toBe(port)
})

test('server should throw an error when port is undefined', () => {
  expect(() => new Server().run()).toThrowError('Server port not defined yet.')
})

test('server should throw an error when is already running', async () => {
  const server = new Server().withPort(port + 1)
  await server.run()
  expect(server.isRunning).toBeTruthy()
  expect(() => server.run()).toThrowError('Server is already running.')
})

test('server should call to callback when it startup', async () => {
  const callback = jest.fn()
  await new Server().withPort(port + 2).run(callback)
  expect(callback).toBeCalled()
})

test('server should response with a welcome message', async () => {
  const result = await request(server.application).get('/')
  expect(result.status).toEqual(200)
  expect(result.text).toEqual('welcome!')
})
