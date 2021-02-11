import { Request, Response, Express } from 'express'
import bcrypt from 'bcryptjs'

import { UserRepository, blackListTokenRepository, RecipeRepository } from './../repositories'
import { usersValidators } from './../validators'
import { errorHandler, AppError } from './../utils'

interface RequestFileInterface extends Express.Multer.File {
  key?: string;
}

interface CustomRequest extends Request {
  file: RequestFileInterface;
}

export default class UserController {
  public create = async (req: Request, res: Response) => {
    let { name, email, password, username } = req.body
    try {
      usersValidators.userPassword(password)
      usersValidators.userUsername(username)
    } catch (error) {
      return errorHandler(error, res)
    }

    const salt = await bcrypt.genSalt()
    password = await bcrypt.hash(password, salt)
    name = name.trim()

    const users = new UserRepository()

    return await users.create(email, name, password, username)
      .then(userID => {
        return res.status(201).json({ sucess: `Usuário criado com sucesso!` })
      })
      .catch((err: Error) => {
        return errorHandler(new AppError('Database Error', 406, 'Erro ao inserir informações no banco de dados', true), res)
      })
  }
  
  public index = async (req: Request, res: Response) => {
    const userID = String(res.getHeader('userID'))
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }

    const users = new UserRepository()
    const recipeRepository = new RecipeRepository()

    return await users.get({
      id: userID
    }, ['name', 'email', 'username', 'biografy', 'imgURL'])
      .then(user => {
        return user
      })
      .then(async (user) => {
        await recipeRepository.getTotalOfRecipes({
          id: userID
        })
          .then(totalOfRecipes => {
            return res.status(200).json({ 
              user: user,
              totalOfRecipes: totalOfRecipes
            })
          })
      })
      .catch((err) => {
        return errorHandler(err, res)
      })
    
  }
  
  public update = async (req: CustomRequest, res: Response) => {
    const userID = String(res.getHeader('userID'))
    try {
      usersValidators.AuthUser(userID)
    } catch (error) {
      return errorHandler(error, res)
    }
    const token = String(res.getHeader('token'))
    let imgURL

    let { name, email, password, username, biografy } = req.body
    if (!!req.file) {
      if (!!req.file.key) {
        imgURL = `https://${process.env.BUCKET_NAME}.s3-${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${req.file.key}`
      }
    }
    
    const users = new UserRepository()
    const blackListToken = new blackListTokenRepository()
    
    let hashPassword
    if (!!password) {
      usersValidators.userPassword(password)
      
      const salt = await bcrypt.genSalt()
      hashPassword = await bcrypt.hash(password, salt)
    }

    if (!!name) {
      name = name.trim()
    }

    return await users.update(userID, {
      email,
      name,
      password: !!password ? hashPassword : password,
      username,
      biografy,
      imgURL
    })
      .then(async (userID) => {
        if (!!password) {
          await blackListToken.create(token)
        }
        
        return userID
      })
      .then(userID => {
        return res.status(200).json({ sucess: 'Operação bem sucedida'})
      })
      .catch((err) => {
        return errorHandler(err, res)
      })
  }
  
}
