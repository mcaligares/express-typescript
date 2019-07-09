import { Document, Model } from 'mongoose'

export default class BaseService<T extends Document> {

  findBy(model: Model<T>, conditions: any): Promise<T> {
    return new Promise<T>((resolve) => {
      model.findOne(conditions, (error: any, found: T) => {
        if (error) throw error
        resolve(found)
      })
    })
  }

  save(model: T): Promise<T> {
    return new Promise<T>((resolve) => {
      model.save((error: any, created: T) => {
        if (error) throw error
        resolve(created)
      })
    })
  }

}
