import { AppError } from './../utils'

export function AuthUser(userID: string) {
  if (!userID) {
    throw new AppError('Authorization Error', 401, 'Invalid Token', true)
  }
}
