import { v4 as uuidv4 } from 'uuid'

import connection from './../database/connection'
import { TABLE_USERS_NAME } from './../database/types'
import { UsersInterface } from './../database/interfaces'
import { AppError } from './../utils'

interface updatePayloadInterface {
  name?: string;
  email?: string;
  password?: string;
  username?: string;
}

export default class UserRepository {
  private users

  constructor() {
    this.users = connection<UsersInterface>(TABLE_USERS_NAME)
  }

  public create = async (email: string, name: string, password: string, username: string) => {
    const id = uuidv4()

    return this.users
      .insert({
        id,
        email,
        name,
        password,
        username
      })
      .then(userId => userId[0])
      .catch((err: Error) => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }
  
  public get = async (identifiers?: { email?: string, id?: string, username?: string }, options?: Array<string>) => {
    if (!!options) {
      return this.users
        .select(...options)
        .where({
          ...identifiers
        })
        .first()
        .then(user => user)
        .catch(err => {
          throw err
        })
    } else {
      return this.users
        .select('*')
        .where({
          ...identifiers
        })
        .first()
        .then(user => user)
        .catch(err => {
          throw new AppError('Database Error', 406, err.message, true)
        })
    }
  }

  public haveUsername = async (username: string) => {
    return this.users
      .select('username')
      .where({
        username: username
      })
      .first()
      .then(user => {
        if (!!user) {
          return true
        } else {
          return false
        }
      })
      .catch(err => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }
  
  public update = async (id: string, payload: updatePayloadInterface) => {
    return await this.users
      .where({
        id
      })
      .update({
        ...payload
      })
      .then(userID => userID)
      .catch(err => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  } 

  public delete = async (identifiers: { email?: string, id?: string, username?: string }) => {
    return await this.users
      .where({
        ...identifiers
      })
      .delete()
      .then(userID => userID)
      .catch(err => {
        throw new AppError('Database Error', 406, err.message, true)
      })
  }
} 