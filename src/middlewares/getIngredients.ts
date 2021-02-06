import { Request, Response, NextFunction } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
  if (typeof(req.body.ingredients) === 'string') {
    req.body.ingredients = JSON.parse(req.body.ingredients)
  }
  next()
}