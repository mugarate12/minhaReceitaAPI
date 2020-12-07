import { Request, Response } from 'express'

import { IngredientsRepository } from './../repositories'
import { usersValidators } from './../validators'
import { errorHandler } from './../utils'

export default class IngredientsController {
  public create = async (req: Request, res: Response) => {
    const { ingredients } = req.body
    const userID = String(res.getHeader('userID'))
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }

    const ingredientsRepository = new IngredientsRepository()

    return await ingredientsRepository
      .create(ingredients)
      .then(ingredients => {
        return res.status(201).json({ sucess: 'ingredientes inseridos com sucesso' })
      })
      .catch(error => {
        return errorHandler(error, res)
      })
  }

  public index = async (req: Request, res: Response) => {
    const { id } = req.params
    const userID = String(res.getHeader('userID'))
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }

    const ingredientsRepository =  new IngredientsRepository()

    return await ingredientsRepository
      .index(Number(id))
      .then(ingredients => {
        return res.status(200).json({ ingredients: ingredients })
      })
      .catch(error => {
        return errorHandler(error, res)
      })
  }

  public update = async (req: Request, res: Response) => {
    const { id, ingredientID } = req.params
    const { name, measure } = req.body
    const userID = String(res.getHeader('userID'))
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }

    const ingredientsRepository = new IngredientsRepository()

    return await ingredientsRepository
      .update(Number(id), Number(ingredientID), {
        name,
        measure
      })
      .then(response => {
        return res.status(200).json({ sucess: 'ingrediente alterado com sucesso' })
      })
      .catch(error => {
        return errorHandler(error, res)
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

    const ingredientsRepository = new IngredientsRepository()

    return await ingredientsRepository
      .delete(Number(id))
      .then(response => {
        return res.status(200).json({ sucess: 'Deletado com sucesso!' })
      })
      .catch(error => {
        return errorHandler(error, res)
      })
  }
}