import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

import connection from './../database/connection'
import { UsersInterface } from './../database/interfaces'
import { TABLE_USERS_NAME } from './../database/types'
import createToken from './../utils/createToken'
import SendEmail from './../utils/sendEmail'
import { AppError, errorHandler } from './../utils/handleError'
import sendEmail from './../utils/sendEmail'

export default class SessionController {
  public create = async (req: Request, res: Response) => {
    const { email, password } = req.body

    return await connection<UsersInterface>(TABLE_USERS_NAME)
      .select('id', 'password')
      .where({
        email: email
      })
      .first()
      .then(user => user)
      .then(async (databaseUser) => {
        const isValidPassword = await bcrypt.compare(password, databaseUser?.password || '')
        if (!isValidPassword) {
          throw new AppError('Campos inválios', 406, 'Verifique as informações do usuario e tente novamente', true)
        }

        return databaseUser?.id
      })
      .then(verifiedUserID => {
        const token = createToken(verifiedUserID || '')

        return res.status(201).json({ token: token })
      })
      .catch(err => {
        return errorHandler(err, res)
      })
  }

  public update = async (req: Request, res: Response) => {
    const { email } = req.body

    return await connection<UsersInterface>(TABLE_USERS_NAME)
      .select('id', 'name')
      .where({
        email: email
      })
      .first()
      .then(user => user)
      .then(async (databaseUser) => {
        const randomString = uuidv4()

        const salt = await bcrypt.genSalt()
        const hashNewPassword = await bcrypt.hash(randomString, salt)

        return await connection<UsersInterface>(TABLE_USERS_NAME)
          .where({
            id: databaseUser?.id
          })
          .update({
            password: hashNewPassword
          })
          .then(userID => {
            const UserInformation = {
              userName: databaseUser?.name,
              newPassword: randomString
            }

            return UserInformation
          })
          .catch(err => {
            throw new AppError('Database Update Error', 406, 'Erro ao tentar alterar a senha do usuário', true)
          })
      })
      .then(async (userInformation) => {
        const emailContent = `
          Olá ${userInformation.userName}!
          Sua nova Senha é: ${userInformation.newPassword}
        `

        return await sendEmail(email, 'Sua nova senha', emailContent)
          .then(result => {
            return res.status(200).json({})
          })
          .catch(err => err)
      })
      .catch(err => errorHandler(err, res))
  }
}
