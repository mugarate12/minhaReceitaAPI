import { Request, response, Response } from 'express'

import { RecipeRepository, IngredientsRepository } from './../repositories'
import { usersValidators } from './../validators'
import {
  AppError,
  errorHandler
} from './../utils'
import { error } from 'console'

export default class RecipesController {
  public create = async (req: Request, res: Response) => {
    const { title, time, number_of_portions, preparation_mode, observations } = req.body
    const userID = String(res.getHeader('userID'))
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }

    const recipeRepository = new RecipeRepository()

    return await recipeRepository.create(
      title, 
      time, 
      number_of_portions, 
      preparation_mode, 
      observations, 
      userID)
        .then(recipeID => {
          return res.status(201).json({ sucess: 'Receita criada com sucesso' })
        })
        .catch((error) => {
          return errorHandler(error, res)
        })
  }

  public index = async (req: Request, res: Response) => {
    const { page } = req.body
    const userID = String(res.getHeader('userID'))
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }

    const limit = 10
    const offset = 10 * (page - 1)

    const recipeRepository = new RecipeRepository()

    return await recipeRepository
      .index(userID, offset, limit)
      .then(recipes => {
        return res.status(200).json({ recipes: recipes })
      })
      .catch((error) => {
        return errorHandler(error, res)
      })
  }

  public get = async (req: Request, res: Response) => {
    const { id } = req.params
    const userID = String(res.getHeader('userID'))
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }

    const recipeRepository = new RecipeRepository()

    return await recipeRepository
      .get(Number(id))
      .then(recipe => {
        return res.status(200).json({ recipe: recipe })
      })
      .catch(error => {
        errorHandler(error, res)
      })
  }

  public update = async (req: Request, res: Response) => {
    const { id } = req.params
    const { title, time, number_of_portions, preparation_mode, observations } = req.body
    const userID = String(res.getHeader('userID'))
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }
    const recipeRepository = new RecipeRepository()

    return await recipeRepository
      .update(Number(id), {
        title,
        time,
        number_of_portions,
        preparation_mode,
        observations
      })
      .then(response => {
        return res.status(200).json({ sucess: 'receita alterada com sucesso!' })
      })
      .catch(err => {
        return errorHandler(err, res)
      })
  }

  public delete = async (req: Request, res: Response) => {
    const { id } = req.params
    const userID = String(res.getHeader('userID'))
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }

    const recipeRepository = new RecipeRepository()
    const ingredientsRepository = new IngredientsRepository()

    return await ingredientsRepository
      .deleteAll(Number(id))
      .then(async (response) => {
        return await recipeRepository
          .delete(Number(id))
      })
      .then(response => {
        return res.status(200).json({ sucess: 'receita deletada com sucesso' })
      })
      .catch()
  }
}