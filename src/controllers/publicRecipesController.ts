import { Request, Response } from 'express'

import { RecipeRepository } from './../repositories'
import { errorHandler } from './../utils'

export default class PublicRecipesController {
  public index = async (req: Request, res: Response) => {
    const { username } = req.params
    const { page } = req.query
    const recipeRepository = new RecipeRepository()

    const limit = 10
    const offset = 10 * (Number(page) - 1)

    return await recipeRepository
      .indexByUsername(username, offset, limit)
        .then(recipes => {
          return res.status(200).json({ recipes: recipes })
        })
        .catch((error) => {
          return errorHandler(error, res)
        })
  }

  public get = async (req: Request, res: Response) => {
    const { username, id } = req.params
    const recipeRepository = new RecipeRepository()

    return await recipeRepository
      .getByUsername(username, id)
        .then(recipe => {
          return res.status(200).json({ recipe: recipe })
        })
        .catch((error) => {
          return errorHandler(error, res)
        })
  }
}