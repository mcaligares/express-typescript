export interface IUser {
  email: string
  username: string
  password: string
  needChangePassword: boolean
  confirmed: boolean
  enabled: boolean
}

export interface IUserWithID extends IUser {
  id: number
}
