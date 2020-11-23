import { AppError } from './../utils'

export function AuthUser(userID: string) {
  if (!userID) {
    throw new AppError('Authorization Error', 401, 'Invalid Token', true)
  }
}

export function userPassword(password: string) {
  const lowerToEightDigits = password.length < 8
  const greaterThanOrEqualToEight = password.length >= 8
  const notHaveNumbers = !password.match("\\d")

  if (lowerToEightDigits) {
    throw new AppError('Invalid Password', 406, 'Password is lower to 8 digits', true)
  } else if (greaterThanOrEqualToEight && notHaveNumbers) {
    throw new AppError('Invalid Password', 406, 'Password need have numbers', true)
  }
}
