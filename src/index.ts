import UserController from './controllers/user.controller'
import Server from './server'

const app = new Server()
  .withJson()
  .withPort(8080)
  .withMongoDB('mongodb://localhost:27017/express')
  .withRoute('/api', new UserController().router)

app.run(() => {
  console.log(`Server running on http://localhost:${app.application.get('port')}`)
})
