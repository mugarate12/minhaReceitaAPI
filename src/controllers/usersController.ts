import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

import { errorHandler, AppError } from './../utils/handleError'
import { Users } from './../database'

export default class UserController {
  public create = async (req: Request, res: Response) => {
    let { name, email, password } = req.body

    try {
      const salt = await bcrypt.genSalt()
      password = await bcrypt.hash(password, salt)

      const id = uuidv4()

      return Users.insert({
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
    } catch (err) {
      return errorHandler(err, res)
    }
  }
  
}
