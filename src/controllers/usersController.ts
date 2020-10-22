import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

import connection from './../database/connection'
import { UsersInterface } from './../database/interfaces'
import { TABLE_USERS_NAME } from './../database/types'
import { usersValidators } from './../validators';
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
  
  public index = async (req: Request, res: Response) => {
    try {
      const userID = String(res.getHeader('userID'))
      usersValidators.authUser(userID)

      return await connection<UsersInterface>(TABLE_USERS_NAME)
        .select('email', 'name')
        .where({
          id: userID
        })
        .first()
        .then(user => {
          return res.status(200).json({ user: user })
        })
        .catch((err: Error) => {
          return new AppError(err.name, 406, err.message, true)
        })
    } catch (err) {
      return errorHandler(err, res)
    }
  }
  
}
