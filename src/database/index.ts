import connection from './connection'
import { TABLE_USERS_NAME } from './types'
import { UsersInterface } from './interfaces'

export const Users = connection<UsersInterface>(TABLE_USERS_NAME)
