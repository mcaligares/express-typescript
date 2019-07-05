import { Request, Response } from 'express'
import Server from './server'

const app = new Server()
  .withPort(8080)
  .withRoute('/', (request: Request, response: Response) => {
    response.send('Hello from Express with TypeScript!!!')
  })

app.run(() => {
  console.log(`Server running on http://localhost:${app.application.get('port')}`)
})
