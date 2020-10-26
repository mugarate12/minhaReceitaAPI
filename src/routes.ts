import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'

import { userController, sessionController } from './controllers'
import { errorHandler, AppError } from './utils'
import authJWT from './middlewares/authJWT'

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

routes.get('/users', authJWT, userController.index)

routes.put('/users', authJWT, celebrate({
  [Segments.QUERY]: Joi.object().keys({
    type: Joi.string().required()
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional()
  })
}), userController.update)

// session routes
routes.post('/session', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
}), sessionController.create)

routes.put('/session', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required()
  })
}), sessionController.update)

export default routes
