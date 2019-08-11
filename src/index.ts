import { initializeConfig } from './config/'
import UserController from './controllers/user.controller'
import errorHandlerMiddleware from './middlewares/error.middleware'
import Server from './server'

const config = initializeConfig()

const app = new Server()
  .withPort(config.PORT)
  .useJsonParser()
  .withMongoDB(config.MONGODB_URL)
  .withRoute('/api', new UserController().router)
  .withErrorHandler(errorHandlerMiddleware)

app.run(() => {
  console.log(`Server running on http://localhost:${app.application.get('port')}`)
})
