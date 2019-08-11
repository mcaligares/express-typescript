import UserController from './controllers/user.controller'
import errorHandlerMiddleware from './middlewares/error.middleware'
import Server from './server'

const app = new Server()
  .withPort(8080)
  .useJsonParser()
  .withMongoDB('mongodb://localhost:27017/express')
  .withRoute('/api', new UserController().router)
  .withErrorHandler(errorHandlerMiddleware)

app.run(() => {
  console.log(`Server running on http://localhost:${app.application.get('port')}`)
})
