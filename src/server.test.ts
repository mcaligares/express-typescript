import { Request, Response } from 'express'
import request from 'supertest'
import Application from './app'

const app = new Application()

beforeAll(() => {
  app.withPort(3000).withRoute('/', (request: Request, response: Response) => {
    response.send('Hello from Express server with TypeScript!')
  })
})

describe('server test', () => {
  test('test response', async () => {
    const result = await request(app.expressApplication).get('/')
    expect(result.status).toEqual(200)
    expect(result.text).toEqual('Hello from Express server with TypeScript!')
  })
})
