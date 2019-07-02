import express from 'express'

export default class Application {
  private port: number
  private app: express.Application

  constructor() {
   this.app = express()
  }

  withPort(port: number): Application {
    this.port = port
    this.app.set('port', port)
    return this
  }

  withRoute(path: string, handler: any): Application {
    this.app.use(path, handler)
    return this
  }

  run(callback?: Function) {
    if (!this.port) {
      console.log('Application port not defined yet.')
      process.exit(-1)
    }
    this.app.listen(this.port, () => {
      console.log(`Application running on http://localhost:${this.port}`)
      if (callback) callback()
    })
  }
}
