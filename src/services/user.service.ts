import { UserDocument, UserModel } from '../models/user.model';
import { AlreadyExistException } from '../utils/model.exceptions'

export default class UserService {

  async create(user: UserDocument): Promise<UserDocument> {
    const userExists = await this.findBy({ username: user.username })

    if (userExists) throw new AlreadyExistException()

    return await this.save(user)
  }

  findBy(conditions: any): Promise<UserDocument> {
    return new Promise<UserDocument>((resolve) => {
      UserModel.findOne(conditions, (error: any, userFound: UserDocument) => {
        if (error) throw error
        resolve(userFound)
      })
    })
  }

  save(user: UserDocument): Promise<UserDocument> {
    return new Promise<UserDocument>((resolve) => {
      user.save((error: any, userCreated: UserDocument) => {
        if (error) throw error
        resolve(userCreated)
      })
    })
  }

}
