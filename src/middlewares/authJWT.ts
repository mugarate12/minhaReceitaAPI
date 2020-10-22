import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import { Request, Response, NextFunction } from 'express'

import connection from './../database/connection'
import { UsersInterface } from './../database/interfaces'
import { TABLE_USERS_NAME } from './../database/types'
import { AppError, errorHandler } from './../utils/handleError';

const JWT_SECRET = process.env.JWT_SECRET || 'Secret'

interface decodedTokenInterface {
  id: string;
  iat: number;
}

export default async function authJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return errorHandler(new AppError('Authorization Error', 401, 'Token não fornecido', true), res)
  }

  const [schema, token] = authHeader.split(' ')

  try {
    const decoded: any = await promisify(jwt.verify)(token, JWT_SECRET)
    const idUserByToken = decoded.id

    return await connection<UsersInterface>(TABLE_USERS_NAME)
      .select('id')
      .where({
        id: idUserByToken  
      })
      .first()
      .then(userId => {
        res.setHeader('userId', userId?.id || '')

        next()
      })
      .catch(err => {
        throw new AppError('Authorization Error', 401, 'Não tem autorização pra isso', true)
      })
  } catch (err) {
    return errorHandler(new AppError('Authorization Error', 401, 'Não autorizado ou token inválido', true), res)
  }
}
