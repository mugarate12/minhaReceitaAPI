import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import { UserRepository, blackListTokenRepository } from './../repositories'
import { usersValidators } from './../validators';
import { errorHandler, AppError } from './../utils'

export default class UserController {
  public create = async (req: Request, res: Response) => {
    let { name, email, password } = req.body

    const salt = await bcrypt.genSalt()
    password = await bcrypt.hash(password, salt)

    const users = new UserRepository()

    return await users.create(email, name, password)
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

      const users = new UserRepository()

      return await users.get({
        id: userID
      }, ['name', 'email'])
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
  
  public update = async (req: Request, res: Response) => {
    try {
      const userID = String(res.getHeader('userID'))
      usersValidators.authUser(userID)
      const token = String(res.getHeader('token'))

      const { name, email, password } = req.body
      const { type } = req.query

      const users = new UserRepository()
      const blackListToken = new blackListTokenRepository()

      let hashPassword
      if (type === 'password') {
        const salt = await bcrypt.genSalt()
        hashPassword = await bcrypt.hash(password, salt)
      }

      return await users.update(userID, {
        email,
        name,
        password: hashPassword
      })
        .then(async (userID) => {
          if (type === 'password') {
            await blackListToken.create(token)
          }
          
          return userID
        })
        .then(userID => {
          return res.status(200).json({ sucess: 'Operação bem sucedida'})
        })
        .catch((err: Error) => {
          errorHandler(new AppError(err.name, 406, err.message, true), res)
        })
    } catch (err) {
      return errorHandler(err, res)
    }
  }
  
}
