import createTokenFunction from './createToken'
import SendEmailFunction from './sendEmail'
import {
  errorHandler as errorHandlerFuncintion,
  AppError as AppErrorObject
} from './handleError'

export const createToken = createTokenFunction
export const sendEmail = SendEmailFunction
export const errorHandler = errorHandlerFuncintion
export const AppError = AppErrorObject
