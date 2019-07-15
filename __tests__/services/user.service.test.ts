import bcrypt from 'bcrypt'
import { UserModel } from '../../src/models/user.model'
import UserService from '../../src/services/user.service'
import { AlreadyExistException, NotFoundException, WrongPasswordException } from '../../src/utils/model.exceptions';

const user = new UserModel({ username: 'test@email.com', password: '1234567' })

test('should create an user using findby and save methods', async () => {
  const service = new UserService()
  const userSaved = new UserModel({ id: '1', username: user.username })

  service.findBy = jest.fn().mockReturnValue(null)
  service.save = jest.fn().mockReturnValue(userSaved)

  const userCreated = await service.create(user)

  expect(userCreated).toEqual(userSaved)
  expect(service.save).toBeCalledWith(user)
  expect(service.findBy).toBeCalledWith(UserModel, { username: user.username })
})

test('should throw an exception when user to create already exists', async () => {
  const service = new UserService()
  const userFound = new UserModel({ id: '1', username: user.username })

  service.save = jest.fn()
  service.findBy = jest.fn().mockReturnValue(userFound)

  try {
    await service.create(user)
  } catch (e) {
    expect(service.save).not.toBeCalled()
    expect(service.findBy).toBeCalledWith(UserModel, { username: user.username })
    expect(e instanceof AlreadyExistException).toBeTruthy()
  }
})

test('should return the user found', async () => {
  const service = new UserService()

  service.findBy = jest.fn().mockReturnValue(user)

  const userFound = await service.findyByUsernameAndPassword(user.username, '1234567')

  expect(userFound).toEqual(user)
  expect(service.findBy).toBeCalledWith(UserModel, { username: user.username })
})

test('should throw an exception when user is not found', async () => {
  const service = new UserService()

  service.findBy = jest.fn().mockReturnValue(null)

  try {
    await service.findyByUsernameAndPassword(user.username, '1234567')
  } catch (e) {
    expect(service.findBy).toBeCalledWith(UserModel, { username: user.username })
    expect(e instanceof NotFoundException).toBeTruthy()
  }
})

test('should throw an exception when the password are incorrect', async () => {
  const service = new UserService()

  service.findBy = jest.fn().mockReturnValue(user)

  try {
    await service.findyByUsernameAndPassword(user.username, 'wrong password')
  } catch (e) {
    expect(service.findBy).toBeCalledWith(UserModel, { username: user.username })
    expect(e instanceof WrongPasswordException).toBeTruthy()
  }
})
