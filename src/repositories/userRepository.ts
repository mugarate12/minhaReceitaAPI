import { v4 as uuidv4 } from 'uuid'

import connection from './../database/connection'
import { TABLE_USERS_NAME } from './../database/types'
import { UsersInterface } from './../database/interfaces'

interface user {
  email: string;
  name: string;
}

interface updatePayloadInterface {
  name?: string;
  email?: string;
  password?: string;
}

export default class UserRepository {
  private users

  constructor() {
    this.users = connection<UsersInterface>(TABLE_USERS_NAME)
  }

  public create = async (email: string, name: string, password: string) => {
    const id = uuidv4()

    return this.users
      .insert({
        id,
        email,
        name,
        password
      })
      .then(userId => userId[0])
      .catch(err => {
        throw new err
      })
  }
  

  public get = async (id: string): Promise<user | undefined> => {
    return this.users
      .select('email', 'name')
      .where({
        id: id
      })
      .first()
      .then(user => user)
      .catch(err => {
        throw new err
      })
  }
  
  public update = async (id: string, payload: updatePayloadInterface) => {
    return this.users
      .where({
        id
      })
      .update({
        ...payload
      })
      .then(userID => userID)
      .catch(err => {
        throw new err
      })
  }
  
} 