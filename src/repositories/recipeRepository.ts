import { v4 as uuidv4 } from 'uuid'

import connection from './../database/connection'
import { TABLE_RECIPE, TABLE_USERS_NAME } from './../database/types'
import { RecipeInterface, UsersInterface } from './../database/interfaces'
import { AppError } from './../utils'

interface updateRecipeInterface {
  title?: string,
  time?: string,
  number_of_portions?: number,
  preparation_mode?: string,
  observations?: string,
  imgURL?: string
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
    userID: string,
    imgURL?: string
  ) => {
    const id = uuidv4()

    return await this.recipes.insert({
      id,
      title,
      time,
      number_of_portions,
      preparation_mode,
      observations,
      userIDFK: userID,
      imgURL
    })
      .then(recipeID => id)
      .catch((err: Error) => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }

  public get = async (id: string) => {
    return await this.recipes.select('*')
      .where({
        id: id
      })
      .first()
      .then(recipe => recipe)
      .catch((err: Error) => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }

  public getTotalOfRecipes = async (userIdentifiers?: { email?: string, id?: string, username?: string }) => {
    const user = await connection<UsersInterface>(TABLE_USERS_NAME)
      .select('id')
      .where({
        ...userIdentifiers
      })
      .first()
    
    return await this.recipes.count('id')
      .where({
        userIDFK: user?.id
      })
      .then(total => total[0]['count(`id`)'])
      .catch((err: Error) => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }

  public getByUsername = async (username: string, id: string) => {
    const user = await connection<UsersInterface>(TABLE_USERS_NAME)
        .select('id')
        .where({
          username: username
        })
        .first()

    return await this.recipes.select('*')
      .where({
        id: id,
        userIDFK: user?.id
      })
      .first()
      .then(recipe => recipe)
      .catch((err: Error) => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }

  public index = async (userID: string, offset: number, limit: number, options?: Array<string>) => {
    return await this.recipes.select(['id', 'title', 'time', 'number_of_portions', 'imgURL'])
      .where({
        userIDFK: userID
      })
      .limit(limit)
      .offset(offset)
      .then(recipes => recipes)
      .catch((err: Error) => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }

  public indexByUsername = async (username: string, offset: number, limit: number, options?: Array<string>) => {
      const user = await connection<UsersInterface>(TABLE_USERS_NAME)
        .select('id')
        .where({
          username: username
        })
        .first()
      
      return await this.recipes.select(['id', 'title', 'time', 'number_of_portions', 'imgURL'])
        .where({
          userIDFK: user?.id
        })
        .limit(limit)
        .offset(offset)
        .then(recipes => recipes)
        .catch((err: Error) => {
          throw new AppError('Database Error', 406, err.message, true)
        })
  }

  public update = async (id: string, payload: updateRecipeInterface) => {
    return await this.recipes
      .where({
        id: id
      })
      .update({
        ...payload
      })
      .then(recipeID => recipeID)
      .catch((err: Error) => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }

  public delete = async (id:string) => {
    return await this.recipes
      .where({
        id: id
      })
      .first()
      .delete()
      .then(recipeID => recipeID)
      .catch((err: Error) => {
        throw new AppError(err.name, 406, err.message, true)
      })
  }
}