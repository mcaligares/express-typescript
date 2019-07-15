import bcrypt from 'bcrypt'
import { UserDocument, UserModel } from '../models/user.model';
import * as exception from '../utils/model.exceptions'
import BaseService from './base.service'

const SALT_ROUNDS = 10

export default class UserService extends BaseService<UserDocument> {

  async create(user: UserDocument): Promise<UserDocument> {
    const userExists = await this.findBy(UserModel, { username: user.username })
    if (userExists) throw new exception.AlreadyExistException()

    user.password = await bcrypt.hash(user.password, SALT_ROUNDS)

    return await this.save(user)
  }

  async findyByUsernameAndPassword(username: string, password: string): Promise<UserDocument> {
    const user = await this.findBy(UserModel, { username })
    if (!user) throw new exception.NotFoundException()

    const isSamePassword = await bcrypt.compare(password, user.password)
    if (!isSamePassword) throw new exception.WrongPasswordException()

    return user
  }

}
