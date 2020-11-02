import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

import { UserRepository } from './../repositories'
import {
  createToken,
  AppError,
  errorHandler,
  sendEmail
} from './../utils'

export default class SessionController {
  public create = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const userRepository = new UserRepository()

    return await userRepository.get({
      email
    }, ['id', 'password'])
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

    const userRepository = new UserRepository()

    return await userRepository.get({
      email
    }, ['id', 'name'])
      .then(user => user)
      .then(async (databaseUser) => {
        const randomString = uuidv4()

        const salt = await bcrypt.genSalt()
        const hashNewPassword = await bcrypt.hash(randomString, salt)

        return await userRepository.update(databaseUser?.id, { password: hashNewPassword })
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
