import connection from './../database/connection'
import { TABLE_RECIPE } from './../database/types'
import { RecipeInterface } from './../database/interfaces'

interface updateRecipeInterface {
  title?: string,
  time?: string,
  number_of_portions?: number,
  preparation_mode?: string,
  observations?: string
}

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
    observations: string,
    userID: string
  ) => {
    return this.recipes.insert({
      title,
      time,
      number_of_portions,
      preparation_mode,
      observations,
      userIDFK: userID
    })
      .then(recipeID => recipeID[0])
      .catch((err: Error) => {
        throw err
      })
  }

  public get = async (id: number) => {
    return this.recipes.select('*')
      .where({
        id: id
      })
      .first()
      .then(recipe => recipe)
      .catch((err: Error) => {
        throw err
      })
  }

  public index = async (userID: string) => {
    return this.recipes.select('*')
      .where({
        userIDFK: userID
      })
      .then(recipes => recipes)
      .catch((err: Error) => {
        throw err
      })
  }

  public update = async (id: number, payload: updateRecipeInterface) => {
    return await this.recipes
      .where({
        id: id
      })
      .update({
        ...payload
      })
      .then(recipeID => recipeID)
      .catch((err: Error) => {
        throw err
      })
  }

  public delete = async (id:number) => {
    return await this.recipes
      .where({
        id: id
      })
      .first()
      .delete()
      .then(recipeID => recipeID)
      .catch((err: Error) => {
        throw err
      })
  }
}