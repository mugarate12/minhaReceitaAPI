import { Request, Response } from 'express'

import { UserRepository, RecipeRepository } from './../repositories'
import { errorHandler } from './../utils'

export default class PublicUsersController {
  public get =  async (req: Request, res: Response) => {
    const { username } = req.params
    const usersRepository = new UserRepository()
    const recipeRepository = new RecipeRepository()

    return await usersRepository
      .get({
        username: String(username)
      }, ['name', 'email', 'username'])
      .then(user => {
        return user
      })
      .then(async (user) => {
        await recipeRepository.getTotalOfRecipes({
          username: username
        })
          .then(totalOfRecipes => {
            return res.status(200).json({ 
              user: user,
              totalOfRecipes: totalOfRecipes
            })
          })
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