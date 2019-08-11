import { initializeConfig } from './config/'
import UserController from './controllers/user.controller'
import errorHandlerMiddleware from './middlewares/error.middleware'
import Server from './server'

try {
  const config = initializeConfig()
  const { PORT, MONGODB_URL} = config

  const app = new Server()
    .withPort(PORT)
    .useJsonParser()
    .withMongoDB(MONGODB_URL)
    .withRoute('/api', new UserController().router)
    .withErrorHandler(errorHandlerMiddleware)

  app.run(() => {
    console.log(`Server running on http://localhost:${app.application.get('port')}`)
  })
} catch (error) {
  console.error(error)
  process.exit(1)
}
