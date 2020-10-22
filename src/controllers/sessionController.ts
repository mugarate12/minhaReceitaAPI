import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import connection from './../database/connection'
import { UsersInterface } from './../database/interfaces'
import { TABLE_USERS_NAME } from './../database/types'
import createToken from './../utils/createToken'
import { AppError, errorHandler } from './../utils/handleError'

interface dbUSer {
  id: string;
  password: string;
}

export default class SessionController {
  public create = async (req: Request, res: Response) => {
    const { email, password } = req.body

    return await connection(TABLE_USERS_NAME)
      .select('id', 'password')
      .where({
        email: email
      })
      .first()
      .then(user => user)
      .then(async (databaseUser: dbUSer) => {
        const isValidPassword = await bcrypt.compare(password, databaseUser.password)
        if (!isValidPassword) {
          throw new AppError('Campos inválios', 406, 'Verifique as informações do usuario e tente novamente', true)
        }

        return databaseUser.id
      })
      .then(verifiedUserID => {
        const token = createToken(verifiedUserID)

        return res.status(201).json({ token: token })
      })
      .catch(err => {
        return errorHandler(err, res)
      })
  }
}
