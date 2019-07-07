import UserRouter from './controllers/user.controller'
import Server from './server'

const app = new Server()
  .withJson()
  .withPort(8080)
  .withRoute('/api', UserRouter)

app.run(() => {
  console.log(`Server running on http://localhost:${app.application.get('port')}`)
})
