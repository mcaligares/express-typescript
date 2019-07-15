import express, { Application, ErrorRequestHandler, RequestHandler } from 'express'
import mongoose from 'mongoose'

export default class Server {
  private port: number
  private app: Application
  private running: boolean = false

  constructor(expressApplication?: Application | any) {
   this.app = expressApplication || express()
  }

  get isRunning() {
    return this.running
  }

  get application(): Application {
    return this.app
  }

  withPort(port: number): Server {
    this.port = port
    this.app.set('port', port)
    return this
  }

  withRoute(path: string, ...handler: RequestHandler[]): Server {
    this.app.use(path, handler)
    return this
  }

  withErrorHandler(handler: ErrorRequestHandler): Server {
    this.app.use(handler)
    return this
  }

  withJson(): Server {
    this.app.use(express.json())
    return this
  }

  withMongoDB(uri: string): Server {
    const options = {
      useCreateIndex: true,
      useNewUrlParser: true,
    }
    mongoose.connect(uri, options).catch((error: any) => {
      throw new Error('MongoDB connection error. Please make sure MongoDB is running. ' + error)
    })
    return this
  }

  run(callback?: Function) {
    if (!this.port) throw new Error('Server port not defined yet.')

    if (this.running) throw new Error('Server is already running.')

    return new Promise((resolve) => this.app.listen(this.port, () => {
      this.running = true
      if (callback) callback()
      resolve()
    }))
  }

}
