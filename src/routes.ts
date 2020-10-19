import { Router } from 'express'
import AppError, { errorHandler } from './utils/handleError'
import connection from './database/connection'

const routes = Router()

routes.get(`/test/:id`, async (req, res) => {
  const { id } = req.params

  try {
    if (!Number(id)) {
      throw new AppError('Params Error', 400, 'parametros requeridos não informados', true)
    }

    await connection('users').select('*')
  } catch(err) {
    return errorHandler(err, res)
  }

  return res.status(200).json({ id: id })
})

export default routes
