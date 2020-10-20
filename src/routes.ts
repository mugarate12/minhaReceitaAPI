import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'

import { userController } from './controllers';
import { errorHandler, AppError } from './utils/handleError'

const routes = Router()

routes.get(`/test/:id`, async (req, res) => {
  const { id } = req.params

  try {
    if (!Number(id)) {
      throw new AppError('Params Error', 400, 'parametros requeridos não informados', true)
    }
  } catch(err) {
    return errorHandler(err, res)
  }

  return res.status(200).json({ id: id })
})

// user routes
routes.post('/users', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
}), userController.create)

export default routes
