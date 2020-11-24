import connection from './../database/connection'
import { TABLE_RECIPE } from './../database/types'
import { RecipeInterface } from './../database/interfaces'

export default class recipeRepository {
  private recipes

  constructor() {
    this.recipes = connection<RecipeInterface>(TABLE_RECIPE)
  }

  public create = async (
    title: string,
    time: string,
    number_of_portions: number,
    preparation_mode: string,
    observations: string
  ) => {
    return this.recipes.insert({
      title,
      time,
      number_of_portions,
      preparation_mode,
      observations
    })
      .then(recipeID => recipeID[0])
      .catch((err: Error) => {
        throw err
      })
  }
}