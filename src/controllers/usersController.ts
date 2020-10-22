import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

import connection from './../database/connection'
import { UsersInterface } from './../database/interfaces'
import { TABLE_USERS_NAME } from './../database/types'
import { errorHandler, AppError } from './../utils'

export default class UserController {
  public create = async (req: Request, res: Response) => {
    let { name, email, password } = req.body

    const salt = await bcrypt.genSalt()
    password = await bcrypt.hash(password, salt)

    const id = uuidv4()

    return connection<UsersInterface>(TABLE_USERS_NAME)
    .insert({
        id,
        email,
        name,
        password
      })
        .then(userID => {
          return res.status(201).json({ sucess: `Usuário criado com sucesso!` })
        })
        .catch((err: Error) => {
          return errorHandler(new AppError('Database Error', 406, 'Erro ao inserir informações no banco de dados', true), res)
        })
  }
}
