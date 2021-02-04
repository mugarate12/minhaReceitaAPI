import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import upload from './config/multer'

import {
  userController,
  sessionController,
  recipesController,
  ingredientsController,
  publicUsersController,
  publicRecipesController
} from './controllers'
import { errorHandler, AppError } from './utils'
import authJWT from './middlewares/authJWT'

// const upload = multer({
//   dest: path.resolve(__dirname, '..', 'temp', 'uploads')
// })
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
    password: Joi.string().required(),
    username: Joi.string().required()
  })
}), userController.create)

routes.get('/users', authJWT, userController.index)

routes.get('/users/:username', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    username: Joi.string().required()
  })
}), publicUsersController.get)

routes.get('/users/:username/valid', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    username: Joi.string().required()
  })
}), publicUsersController.validUsername)

routes.put('/users', authJWT, celebrate({
  [Segments.QUERY]: Joi.object().keys({
    type: Joi.string().required()
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    username: Joi.string().optional()
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

// recipes controller
routes.post('/recipes', authJWT, upload.single('img'), celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required(),
    time: Joi.string().required(),
    number_of_portions: Joi.number().required(),
    preparation_mode: Joi.string().required(),
    observations: Joi.string().required(),
    ingredients: Joi.array().items({
      name: Joi.string().required(),
      measure: Joi.string().required()
    }).optional()
  })
}), recipesController.create)

routes.get('/recipes', celebrate({
  // [Segments.BODY]: Joi.object().keys({
  //   page: Joi.number().required()
  // }),
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.string().required()
  })
}), authJWT, recipesController.index)

routes.get('/recipes/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  })
}), authJWT, recipesController.get)

routes.get('/users/:username/recipes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    username: Joi.string().required()
  }),
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.string().required()
  })
}), publicRecipesController.index)

routes.get('/users/:username/recipes/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    username: Joi.string().required(),
    id: Joi.string().required()
  })
}), publicRecipesController.get)

routes.put('/recipes/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  }),
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().optional(),
    time: Joi.string().optional(),
    number_of_portions: Joi.number().optional(),
    preparation_mode: Joi.string().optional(),
    observations: Joi.string().optional()
  })
}), authJWT, recipesController.update)

routes.put('/recipes/:id/img', authJWT, upload.single('img'), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  })
}), recipesController.updatePhoto)

routes.delete('/recipes/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  })
}), authJWT, recipesController.delete)

// ingredients routes
routes.post('/ingredients', celebrate({
  [Segments.BODY]: Joi.object().keys({
    ingredients: Joi.array().items({
      name: Joi.string().required(),
      measure: Joi.string().required(),
      recipeIDFK: Joi.string().required()
    }).required()
  })
}), authJWT, ingredientsController.create)

routes.get('/recipes/:id/ingredients', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  })
}), authJWT, ingredientsController.index)

routes.put('/recipes/:id/ingredients/:ingredientID', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
    ingredientID: Joi.number().required()
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().optional(),
    measure: Joi.string().optional()
  })
}), authJWT, ingredientsController.update)

routes.delete('/ingredients/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required()
  })
}), authJWT, ingredientsController.delete)

export default routes
