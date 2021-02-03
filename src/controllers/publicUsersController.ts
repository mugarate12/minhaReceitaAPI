import { Request, Response } from 'express'

import { UserRepository } from './../repositories'
import { errorHandler } from './../utils'

export default class PublicUsersController {
  public get =  async (req: Request, res: Response) => {
    const { username } = req.params
    const usersRepository = new UserRepository()

    return await usersRepository
      .get({
        username: String(username)
      }, ['name', 'email', 'username'])
      .then(user => {
        return res.status(200).json({ user: user })
      })
      .catch(error => {
        return errorHandler(error, res)
      })
  }

  public validUsername = async (req: Request, res: Response) => {
    const { username } = req.params
    const usersRepository = new UserRepository()

    return await usersRepository
      .haveUsername(username)
      .then(isvalid => {
        return res.status(200).json({ valid: !isvalid })
      })
      .catch(error => {
        return errorHandler(error, res)
      })
  }
}