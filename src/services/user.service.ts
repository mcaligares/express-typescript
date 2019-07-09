import { UserDocument, UserModel } from '../models/user.model';
import { AlreadyExistException } from '../utils/model.exceptions'
import BaseService from './base.service';

export default class UserService extends BaseService<UserDocument> {

  async create(user: UserDocument): Promise<UserDocument> {
    const userExists = await this.findBy(UserModel, { username: user.username })
    if (userExists) throw new AlreadyExistException()

    const userCreated = await this.save(user)
    return userCreated
  }

}
