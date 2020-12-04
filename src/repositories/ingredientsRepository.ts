import connection from './../database/connection'
import { TABLE_INGREDIENTS } from './../database/types'
import { IngredientsInterface } from './../database/interfaces'
import { AppError } from './../utils'

interface CreateIngredientsInterface {
  name: string;
  measure: string;
  recipeIDFK: number;
}

interface updateIngredientsInterface {
  name ?: string;
  measure ?: string;
}

export default class IngredientsRepository {
  private ingredients

  constructor() {
    this.ingredients = connection<IngredientsInterface>(TABLE_INGREDIENTS)
  }

  public create = async (
    ingredients: CreateIngredientsInterface | Array<CreateIngredientsInterface>
  ) => {
    return await this.ingredients
      .insert(ingredients)
      .then(ingredientsID => ingredientsID)
      .catch((err : Error) => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }

  public index = async (recipeID: number) => {
    return await this.ingredients
      .select('*')
      .where({
        recipeIDFK: recipeID
      })
      .then(ingredients => ingredients)
      .catch((err: Error) => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }

  public update = async (
    recipeID: number,
    ingredientsID: number,
    options: updateIngredientsInterface
  ) => {
    return await this.ingredients
      .where({
        recipeIDFK: recipeID,
        id: ingredientsID
      })
      .update(options)
      .then(ingredientesID => ingredientesID)
      .catch((err: Error) => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }

  public delete = async (
    ingredientId: number
  ) => {
    return await this.ingredients
      .where({
        id: ingredientId
      })
      .first()
      .delete()
      .then(ingredientID => ingredientID)
      .catch((err: Error) => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }
}