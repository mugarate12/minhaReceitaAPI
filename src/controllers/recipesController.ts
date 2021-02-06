import { Request, response, Response, Express } from 'express'

import { RecipeRepository, IngredientsRepository } from './../repositories'
import { usersValidators } from './../validators'
import {
  errorHandler
} from './../utils'

interface createRecipeInterface {
  title: string;
  time: string;
  number_of_portions: number;
  preparation_mode: string;
  observations: string;
  ingredients?: Array<{
    name: string;
    measure: string;
  }>
}

interface RequestFileInterface extends Express.Multer.File {
  key?: string;
}

interface CustomRequest extends Request {
  file: RequestFileInterface;
}

export default class RecipesController {
  public create = async (req: CustomRequest, res: Response) => {
    const { title, time, number_of_portions, preparation_mode, observations, ingredients }: createRecipeInterface = req.body
    const userID = String(res.getHeader('userID'))
    let imgURL
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }
    
    if (!!req.file) {
      if (!!req.file.key) {
        imgURL = `https://${process.env.BUCKET_NAME}.s3-${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${req.file.key}`
      }
    }
    const recipeRepository = new RecipeRepository()

    return await recipeRepository.create(
      title, 
      time, 
      number_of_portions, 
      preparation_mode, 
      observations, 
      userID,
      imgURL)
        .then(recipeID => {
          const ingredientsArray = ingredients?.map((value, index) => {
            return {
              name: value.name,
              measure: value.measure,
              recipeIDFK: recipeID
            }
          })

          return ingredientsArray
        })
        .then(async (ingredientsArray) => {
          if (!!ingredientsArray && ingredientsArray.length > 0) {
            const ingredientsRepository = new IngredientsRepository()

            await ingredientsRepository.create(ingredientsArray)
            return
          }
          return
        })
        .then(response => {
          return res.status(201).json({ sucess: 'Receita criada com sucesso' })
        })
        .catch((error) => {
          return errorHandler(error, res)
        })
  }

  public index = async (req: Request, res: Response) => {
    const { page } = req.query
    const userID = String(res.getHeader('userID'))
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }

    const limit = 10
    const offset = 10 * (Number(page) - 1)

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
              recipe: {...recipe, ingredients: ingredients}
            })
          })
      })
      .catch(error => {
        return errorHandler(error, res)
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
      .update(id, {
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

  public updatePhoto = async (req: CustomRequest, res: Response) => {
    const { id } = req.params
    const userID = String(res.getHeader('userID'))
    let imgURL
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }

    if (!!req.file) {
      imgURL = `https://${process.env.BUCKET_NAME}.s3-${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${req.file.key}`
    }
    const recipeRepository = new RecipeRepository()

    if (!!imgURL) {
      return await recipeRepository
        .update(id, {
          imgURL
        })
          .then(response => {
            return res.status(200).json({ sucess: 'imagem da receita alterada com sucesso!'})
          })
          .catch(err => {
            return errorHandler(err, res)
          })
    } else {
      return res.status(406).json({
        error: {
          name: 'Invalid Image',
          message: 'Unexpected error occurred, please try again'
        }
      })
    }
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
      .deleteAll(id)
      .then(async (response) => {
        return await recipeRepository
          .delete(id)
      })
      .then(response => {
        return res.status(200).json({ sucess: 'receita deletada com sucesso' })
      })
      .catch(error => {
        return errorHandler(error, res)
      })
  }
}