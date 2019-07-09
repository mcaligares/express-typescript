import { UserModel } from '../../src/models/user.model'
import UserService from '../../src/services/user.service'
import { AlreadyExistException } from '../../src/utils/model.exceptions';

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
