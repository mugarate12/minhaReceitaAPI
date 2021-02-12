import { Request, Response } from 'express'

import { RecipeRepository, IngredientsRepository } from './../repositories'
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
          return recipes
        })
        .then(async (recipes) => {
          return await recipeRepository.getTotalOfRecipes({
            username: username
          })
            .then(totalOfRecipes => {
              return res.status(200).json({
                recipes: recipes,
                totalOfRecipes
              })
            })
        })
        .catch((error) => {
          return errorHandler(error, res)
        })
  }

  public get = async (req: Request, res: Response) => {
    const { id } = req.params
    const recipeRepository = new RecipeRepository()
    const ingredientsRepository = new IngredientsRepository()

    return await recipeRepository
      .get(id)
        .then(recipe => {
          return recipe
        })
        .then(async (recipe) => {
          await ingredientsRepository.index(id)
            .then(ingredients => {
              return res.status(200).json({
                recipe: {...recipe, ingredients}
              })
            })
        })
        .catch((error) => {
          return errorHandler(error, res)
        })
  }
}