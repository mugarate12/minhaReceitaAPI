import { Router } from 'express'
import AppError from './utils/handleError'

const routes = Router()

routes.get(`/test/:id`, (req, res) => {
  const { id } = req.params

  if (!Number(id)) {
    throw new AppError('Params Error', 400, 'parametros requeridos não informados', true)
  }

  return res.status(200).json({ id: id })
})

export default routes
