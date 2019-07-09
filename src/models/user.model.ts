import { Request } from 'express'
import { ValidationSchema } from 'express-validator'
import mongoose, { Schema } from 'mongoose'

export type UserDocument = mongoose.Document & {
  username: string,
  password: string,
}

export const UserModelSchema: Schema = new Schema({
  username: { type: String, unique: true },
  password: String,
}, { timestamps: true })

export const UserValidationSchema: ValidationSchema = {
  username: { in: 'body', isEmail: true, normalizeEmail: true },
  password: { in: 'body', isLength: { options: { min: 6, max: 12 } } },
}

export const UserModel = mongoose.model<UserDocument>('users', UserModelSchema)

export function getModelFromRequest(request: Request): UserDocument {
  return new UserModel({
    username: request.body.username,
    password: request.body.password,
  })
}
