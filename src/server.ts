import { Request, Response } from 'express'
import Application from './app'

const app = new Application()
  .withPort(8080)
  .withRoute('/', (request: Request, response: Response) => {
    response.send('Hello from Express server with TypeScript!')
  })

app.run()
